const jwt = require('jsonwebtoken')
const Str = require('@supercharge/strings')
require('dotenv').config()
const pwStrength = /^(?=.*[A-Za-z])(?=.*\d)[\S]{6,}$/ // mindestens 6 Stellen && eine Zahl && ein Buchstabe
const nodemailer = require('nodemailer')

module.exports = {
  testPasswordStrength: (password) => pwStrength.test(password),

  createJWT: (id, email, username, communities) => jwt.sign({ version: 4, user: { id, email, username, communities } }, process.env.JWT_SECRET, {
      expiresIn: '1y'
    }),

  generateRandomString: () => Str.random(90),

  generateCommunityInviteCode: () => Math.floor(Math.random() * (999999 - 100000)) + 100000,

  sendVerifyEmail: (email, subject, url) => {
    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
      host: process.env.MY_EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD_EMAIL
      }
    });

    // Wrap in an async IIFE so we can use await.
    (async () => {
      const info = await transporter.sendMail({
        from: `"Together" <${process.env.MY_EMAIL}>`,
        to: email,
        subject,
        html: `<a href=${url}>Verify</a>` // HTML body
      })

      console.log('Message sent:', info.messageId)
    })()
  },

  resSend (res, data, status, errors) {
    data = data ?? {}
    status = status?.toString() ?? this.resStatuses.ok
    errors = errors ?? []
    if (!Array.isArray(errors)) errors = [errors]

    const rspJson = {}
    rspJson.status = status
    rspJson.errors = errors
    rspJson.data = data

    res.send(JSON.stringify(rspJson))
  },

  resStatuses: Object.freeze({ ok: 'OK', error: 'Error' })
}
