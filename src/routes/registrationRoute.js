const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const database = require('../database')
const helper = require('../helper')

router.post('/register', async (req, res) => {
  if (
    !req.body.email ||
    !req.body.firstname ||
    !req.body.lastname ||
    !req.body.password
  ) {
    database.resSend(res, null, database.resStatuses.error, 'Empty fields!')
    return
  } else if (!helper.testPasswordStrength(req.body.password)) {
    database.resSend(res, null, database.resStatuses.error, 'The password must be at least 6 characters long. There must be at least one letter and one number.')
    return
  }

  const user = await database.dbGetSingleRow('SELECT * FROM user WHERE email = ?', [req.body.email])
  if (user) {
    database.resSend(res, null, database.resStatuses.error, 'This email is already used!')
    return
  }

  const code = helper.generateRandomString()

  bcrypt.genSalt(512, (_err, salt) => {
    bcrypt.hash(req.body.password, salt, async (_err, enc) => {
      const userId = await database.dbInsert('INSERT INTO user (email, firstname, lastname, password, verificationcode) VALUES (?, ?, ?, ?, ?)', [req.body.email, req.body.firstname, req.body.lastname, enc, code])
      // helper.sendMail(
      //   req.body.email,
      //   'Email verification',
      //   'Open this link to enable your account: https://ideaoverflow.xyz/verify/' +
      //   code
      // )
      const usertoken = helper.createJWT(
        userId,
        req.body.email,
        req.body.firstname
      )
      database.resSend(res, { token: usertoken })
    })
  })
})

router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.json({ message: 'Empty fields!' })
  } else {
    const user = await database.dbGetSingleRow('SELECT * FROM user WHERE email = ?', req.body.email)
    if (!user) {
      database.resSend(res, null, database.resStatuses.error, 'This user does not exist!')
      return
    }
    bcrypt.compare(
      req.body.password,
      user.password,
      async (err, isMatch) => {
        if (err) {
          return database.resSend(res, null, database.resStatuses.error, 'Bcrypt compare error')
        }
        if (!isMatch) {
          database.resSend(res, null, database.resStatuses.error, 'Wrong password!')
        } else {
          if (user.verified === 2) {
            await database.dbQuery('UPDATE user SET verified = 1, verificationcode = "" WHERE id = ?', user.id)
          }

          const usertoken = helper.createJWT(
            user.id,
            user.email,
            user.username
          )

          const answer = { token: usertoken }
          database.resSend(res, answer)
        }
      }
    )
  }
})

router.get('/verify/:code', async (req, res) => {
  const verified = await database.dbGetSingleValue(
    'SELECT verified as val FROM user WHERE verificationcode = ?',
    [req.params.code],
    -1)
  if (verified === 1) {
    return database.resSend(res, null, database.resStatuses.error, 'User was already Verified')
  } else if (verified === -1) {
    return database.resSend(res, null, database.resStatuses.error, 'Code doesnt exist')
  } else {
    await database.dbQuery(
      "UPDATE user SET verified = 1, verificationcode = '' WHERE verificationcode = ?",
      [req.params.code])
    return database.resSend(res, {
      verified: true,
      message: 'Verified successfully'
    })
  }
})

router.post('/sendverificationmailagain', async (req, res) => {
  database.getConnection((err, con) => {
    if (err) {
      return res.status(500).json(err)
    }
    con.query(
      'SELECT verificationcode FROM user WHERE email = ?',
      [req.body.email],
      (err, result) => {
        if (err) {
          con.release()
          return res.status(500).json(err)
        } else if (result.length === 0) {
          con.release()
          return res
            .status(500)
            .json({ header: 'Error', message: 'Failed to send mail!' })
        }
        helper.sendMail(
          req.body.email,
          'Email verification',
          'Open this link to enable your account: https://ideaoverflow.xyz/verify/' +
          result[0].verificationcode
        )
        return res
          .status(200)
          .json({ header: 'Success!', message: 'Mail sent!' })
      }
    )
  })
})

router.post('/resetpassword', async (req, res) => {
  database.getConnection((err, con) => {
    if (err) {
      return res.status(500).json(err)
    }
    const code = helper.generateRandomString()
    con.query(
      'UPDATE user SET verified = 2, verificationcode = ? WHERE email = ?',
      [code, req.body.email],
      (err, result) => {
        if (err) {
          con.release()
          return res.status(500).json(err)
        } else if (result.affectedRows === 0) {
          con.release()
          return res.status(200).json({
            header: 'Fehler',
            message: 'Die E-Mail wurde nicht gefunden'
          })
        }
        helper.sendMail(
          req.body.email,
          'Reset password',
          'Open the following link to reset your password: https://ideaoverflow.xyz/resetpassword/' +
          code
        )
        return res.status(200).json({
          header: 'Nice!',
          message: 'Mail sent to ' + req.body.email + '!'
        })
      }
    )
  })
})

router.get('/checkresetcode/:code', (req, res) => {
  database.dbQuery(
    'SELECT * FROM user WHERE verificationcode = ?',
    [req.params.code],
    (result, err) => {
      if (err) {
        return res.status(500).json({ err })
      }
      if (result.length === 0) {
        return res
          .status(200)
          .json({ message: 'This code does not exist!', exists: false })
      }
      if (result.length === 1) {
        return res.status(200).json({ exists: true })
      } else {
        return res.status(200).json({
          message:
            'This code exists multiple times. Please contact hiebeler.daniel@gmail.com',
          exists: false
        })
      }
    }
  )
})

router.post('/setpassword', async (req, res) => {
  database.getConnection((err, con) => {
    if (err) {
      return res.status(500).json(err)
    }
    if (!req.body.pw1 || !req.body.pw2) {
      con.release()
      return res.json({
        header: 'Error',
        message: 'Informationen unvollständig!',
        stay: true
      })
    } else if (req.body.pw1 !== req.body.pw2) {
      con.release()
      return res.json({
        header: 'Error',
        message: 'Passwords are not the same!',
        stay: true
      })
    } else if (!helper.testPasswordStrength(req.body.pw1)) {
      con.release()
      return res.json({
        header: 'Error',
        message:
          'The password must be at least 6 characters long. There must be at least one letter and one number.',
        stay: true
      })
    }

    con.query(
      'SELECT * FROM user WHERE verificationcode = ?',
      [req.body.vcode],
      (err, users) => {
        if (err) {
          con.release()
          return res.status(500).json({ err })
        }
        if (users.length === 0) {
          con.release()
          return res.json({
            header: 'Error',
            message: 'This code does not exist',
            stay: false
          })
        }

        bcrypt.genSalt(512, (_err, salt) => {
          bcrypt.hash(req.body.pw1, salt, (_err, enc) => {
            con.query(
              'UPDATE user SET verified = 1, password = ?, verificationcode = ? WHERE verificationcode = ?',
              [enc, '', req.body.vcode],
              (err, _resutl) => {
                if (err) {
                  con.release()
                  return res.status(500).json({ err })
                }
                con.release()
                return res.json({
                  header: 'Congrats',
                  message: 'Your password has been changed',
                  stay: false
                })
              }
            )
          })
        })
      }
    )
  })
})

module.exports = router
