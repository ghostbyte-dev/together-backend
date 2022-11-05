const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const database = require("../database");
const helper = require("../helper");

router.post("/register", async (req, res) => {
  console.log(req.body.email);
  database.getConnection((_err, con) => {
    if (
      !req.body.email ||
      !req.body.username ||
      !req.body.password1 ||
      !req.body.password2
    ) {
      con.release();
      return res.json({ header: "Error", message: "Empty fields!" });
    } else if (!helper.testPasswordStrength(req.body.password1)) {
      con.release();
      return res.json({
        header: "Error",
        message:
          "The password must be at least 6 characters long. There must be at least one letter and one number.",
      });
    } else if (req.body.password1 !== req.body.password2) {
      con.release();
      return res.json({
        header: "Error",
        message: "Passwords are not the same!",
      });
    }

    con.query(
      `SELECT * FROM user WHERE email = ${con.escape(
        req.body.email
      )} OR username = ${con.escape(req.body.username)}`,
      (err, user) => {
        if (err) {
          con.release();
          return res.status(401).json({ err });
        } else if (user[0]) {
          con.release();
          if (user[0].email === req.body.email) {
            return res.json({
              header: "Error",
              message: "This email is already used!",
            });
          } else {
            return res.json({
              header: "Error",
              message: "This username already used!",
            });
          }
        }

        const code = helper.generateRandomString();

        bcrypt.genSalt(512, (_err, salt) => {
          bcrypt.hash(req.body.password1, salt, (_err, enc) => {
            con.query(
              `
                INSERT INTO user (email, username, password, verificationcode) 
                VALUES (${con.escape(req.body.email)}, ${con.escape(
                req.body.username
              )}, ${con.escape(enc)}, ${con.escape(code)})
                `,
              (err, _result) => {
                con.release();
                if (err) {
                  return res.status(500).json({ err });
                }

                helper.sendMail(
                  req.body.email,
                  "Email verification",
                  "Open this link to enable your account: https://ideaoverflow.xyz/verify/" +
                    code
                );
                return res.json({
                  status: 1,
                  header: "Congrats!",
                  message:
                    "The user has been created. Please confirm your e-mail, it may have ended up in the spam folder. After that you can log in.",
                });
              }
            );
          });
        });
      }
    );
  });
});

router.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.json({ message: "Empty fields!" });
  } else {
    database.getConnection((_err, con) => {
      con.query(
        `SELECT * FROM user WHERE email = ${con.escape(req.body.email)}`,
        (err, users) => {
          if (err) {
            con.release();
            return res.status(404).json({ err });
          }

          if (users.length === 0) {
            con.release();
            return res.json({ message: "This user does not exist!" });
          }

          if (users[0].verified === 1 || users[0].verified === 2) {
            bcrypt.compare(
              req.body.password,
              users[0].password,
              (err, isMatch) => {
                if (err) {
                  con.release();
                  return res.status(500).json({ err });
                }
                if (!isMatch) {
                  con.release();
                  return res.json({
                    message: "Wrong password!",
                    wrongpw: true,
                  });
                } else {
                  if (users[0].verified === 2) {
                    con.query(
                      `UPDATE user SET verified = 1, verificationcode = "" WHERE id = ${con.escape(
                        users[0].id
                      )}`,
                      () => {
                        con.release();
                      }
                    );
                  }

                  const usertoken = helper.createJWT(
                    users[0].id,
                    users[0].email,
                    users[0].username
                  );

                  const answer = { token: usertoken };
                  return res.json(answer);
                }
              }
            );
          } else {
            return res.json({ notverified: true });
          }
        }
      );
    });
  }
});

router.get("/verify/:code", (req, res) => {
  database.dbGetSingleValue(
    "SELECT verified as val FROM user WHERE verificationcode = ?",
    [req.params.code],
    -1,
    (result, err) => {
      if (err) {
        return database.resSend(
          res,
          null,
          database.resStatuses.error,
          "SQL Error"
        );
      } else if (result === 1) {
        return database.resSend(res, {
          verified: true,
          message: "User was already Verified",
        });
      } else if (result === -1) {
        return database.resSend(res, {
          verified: false,
          message: "Code doesnt exist",
        });
      } else {
        database.dbQuery(
          "UPDATE user SET verified = 1, verificationcode = '' WHERE verificationcode = ?",
          [req.params.code],
          (result, err) => {
            if (err) {
              return database.resSend(
                res,
                null,
                database.resStatuses.error,
                "SQL Error"
              );
            }
            return database.resSend(res, {
              verified: true,
              message: "Verified successfully",
            });
          }
        );
      }
    }
  );
});

router.post("/sendverificationmailagain", async (req, res) => {
  database.getConnection((err, con) => {
    if (err) {
      return res.status(500).json(err);
    }
    con.query(
      "SELECT verificationcode FROM user WHERE email = ?",
      [req.body.email],
      (err, result) => {
        if (err) {
          con.release();
          return res.status(500).json(err);
        } else if (result.length === 0) {
          con.release();
          return res
            .status(500)
            .json({ header: "Error", message: "Failed to send mail!" });
        }
        helper.sendMail(
          req.body.email,
          "Email verification",
          "Open this link to enable your account: https://ideaoverflow.xyz/verify/" +
            result[0].verificationcode
        );
        return res
          .status(200)
          .json({ header: "Success!", message: "Mail sent!" });
      }
    );
  });
});

router.post("/resetpassword", async (req, res) => {
  database.getConnection((err, con) => {
    if (err) {
      return res.status(500).json(err);
    }
    const code = helper.generateRandomString();
    con.query(
      "UPDATE user SET verified = 2, verificationcode = ? WHERE email = ?",
      [code, req.body.email],
      (err, result) => {
        if (err) {
          con.release();
          return res.status(500).json(err);
        } else if (result.affectedRows === 0) {
          con.release();
          return res.status(200).json({
            header: "Fehler",
            message: "Die E-Mail wurde nicht gefunden",
          });
        }
        helper.sendMail(
          req.body.email,
          "Reset password",
          "Open the following link to reset your password: https://ideaoverflow.xyz/resetpassword/" +
            code
        );
        return res.status(200).json({
          header: "Nice!",
          message: "Mail sent to " + req.body.email + "!",
        });
      }
    );
  });
});

router.get("/checkresetcode/:code", (req, res) => {
  database.dbQuery(
    "SELECT * FROM user WHERE verificationcode = ?",
    [req.params.code],
    (result, err) => {
      if (err) {
        return res.status(500).json({ err });
      }
      if (result.length === 0) {
        return res
          .status(200)
          .json({ message: "This code does not exist!", exists: false });
      }
      if (result.length === 1) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({
          message:
            "This code exists multiple times. Please contact hiebeler.daniel@gmail.com",
          exists: false,
        });
      }
    }
  );
});

router.post("/setpassword", async (req, res) => {
  database.getConnection((err, con) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!req.body.pw1 || !req.body.pw2) {
      con.release();
      return res.json({
        header: "Error",
        message: "Informationen unvollständig!",
        stay: true,
      });
    } else if (req.body.pw1 !== req.body.pw2) {
      con.release();
      return res.json({
        header: "Error",
        message: "Passwords are not the same!",
        stay: true,
      });
    } else if (!helper.testPasswordStrength(req.body.pw1)) {
      con.release();
      return res.json({
        header: "Error",
        message:
          "The password must be at least 6 characters long. There must be at least one letter and one number.",
        stay: true,
      });
    }

    con.query(
      "SELECT * FROM user WHERE verificationcode = ?",
      [req.body.vcode],
      (err, users) => {
        if (err) {
          con.release();
          return res.status(500).json({ err });
        }
        if (users.length === 0) {
          con.release();
          return res.json({
            header: "Error",
            message: "This code does not exist",
            stay: false,
          });
        }

        bcrypt.genSalt(512, (_err, salt) => {
          bcrypt.hash(req.body.pw1, salt, (_err, enc) => {
            con.query(
              "UPDATE user SET verified = 1, password = ?, verificationcode = ? WHERE verificationcode = ?",
              [enc, "", req.body.vcode],
              (err, _resutl) => {
                if (err) {
                  con.release();
                  return res.status(500).json({ err });
                }
                con.release();
                return res.json({
                  header: "Congrats",
                  message: "Your password has been changed",
                  stay: false,
                });
              }
            );
          });
        });
      }
    );
  });
});

module.exports = router;
