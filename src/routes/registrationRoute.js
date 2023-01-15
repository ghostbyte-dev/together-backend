const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const helper = require('../helper')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Registrate a new user.'

  if (
    !req.body.email ||
    !req.body.firstname ||
    !req.body.lastname ||
    !req.body.password
  ) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty fields!')
    return
  } else if (!helper.testPasswordStrength(req.body.password)) {
    helper.resSend(res, null, helper.resStatuses.error, 'The password must be at least 6 characters long. There must be at least one letter and one number.')
    return
  }

  const user = await prisma.user.findFirst({
    where: { email: req.body.email }
  })
  if (user) {
    helper.resSend(res, null, helper.resStatuses.error, 'This email is already used!')
    return
  }

  const code = helper.generateRandomString()

  bcrypt.genSalt(512, (_err, salt) => {
    bcrypt.hash(req.body.password, salt, async (_err, enc) => {
      await prisma.user.create({
        data: {
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: enc,
          verificationcode: code
        }
      })
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
        select: { id: true }
      })
      // helper.sendMail(
      //   req.body.email,
      //   'Email verification',
      //   'Open this link to enable your account: https://ideaoverflow.xyz/verify/' +
      //   code
      // )
      const usertoken = helper.createJWT(
        user.id,
        req.body.email,
        req.body.firstname
      )
      helper.resSend(res, { token: usertoken })
    })
  })
})

router.post('/login', async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Login'
  if (!req.body.email || !req.body.password) {
    return res.json({ message: 'Empty fields!' })
  } else {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    })
    if (!user) {
      helper.resSend(res, null, helper.resStatuses.error, 'This user does not exist!')
      return
    }
    bcrypt.compare(
      req.body.password,
      user.password,
      async (err, isMatch) => {
        if (err) {
          return helper.resSend(res, null, helper.resStatuses.error, 'Bcrypt compare error')
        }
        if (!isMatch) {
          helper.resSend(res, null, helper.resStatuses.error, 'Wrong password!')
        } else {
          const usertoken = helper.createJWT(
            user.id,
            user.email,
            user.username
          )

          const answer = { token: usertoken }
          helper.resSend(res, answer)
        }
      }
    )
  }
})

router.get('/verify/:code', async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Verfy a new account'
  const verified = await prisma.user.findFirst({
    where: { verificationcode: req.params.code },
    select: {
      verified: true
    }
  })
  if (verified === 1) {
    return helper.resSend(res, null, helper.resStatuses.error, 'User was already Verified')
  } else if (verified === -1) {
    return helper.resSend(res, null, helper.resStatuses.error, 'Code doesnt exist')
  } else {
    await prisma.user.update({
      where: {
        verificationcode: req.params.code
      },
      data: {
        verified: true,
        verificationcode: null
      }
    })
    return helper.resSend(res, {
      verified: true,
      message: 'Verified successfully'
    })
  }
})

module.exports = router
