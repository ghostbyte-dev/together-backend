const mailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Str = require("@supercharge/strings");

const pwStrength = /^(?=.*[A-Za-z])(?=.*\d)[\S]{6,}$/; // mindestens 6 Stellen && eine Zahl && ein Buchstabe

module.exports = {
  testPasswordStrength: function (password) {
    return pwStrength.test(password);
  },

  createJWT: function (id, email, username) {
    return jwt.sign({ id, email, username }, "ideaoverflow420", {
      expiresIn: "1y",
    });
  },

  generateRandomString: function () {
    return Str.random(90);
  },

  sendMail: function (to, subject, text) {
    const transporter = mailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "noreply.ideaoverflow@gmail.com",
        pass: "Omemomemo420",
      },
    });

    const mailOptions = {
      from: "noreply.ideaoverflow@gmail.com",
      to,
      subject,
      text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    });
  },
};
