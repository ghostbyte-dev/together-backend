const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const helper = require('../helper')
const auth = require('../middleware/userAuth')
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

  bcrypt.genSalt(10, (_err, salt) => {
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
      helper.sendVerifyEmail(
        req.body.email,
        'Email verification',
        process.env.CLIENT_URL + '/verify/' + code
      )
      helper.resSend(res, { registered: true })
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
    if (!user.verified) {
      helper.resSend(res, { verified: false }, helper.resStatuses.error, 'This user is not verified yet!')
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
            user.username,
            user.fk_community_id
          )

          const answer = { token: usertoken }
          helper.resSend(res, answer)
        }
      }
    )
  }
})

router.get('/getnewtoken', auth, async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Get new JWT'

  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  })

  const usertoken = helper.createJWT(
    user.id,
    user.email,
    user.username,
    user.fk_community_id
  )

  const answer = { token: usertoken }
  helper.resSend(res, answer)
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
  if (!verified) {
    return helper.resSend(res, null, helper.resStatuses.error, 'Verification code not found')
  } else if (verified === 1) {
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

router.post('/resendVerificationEmail', async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Verfy a new account'
  if (!req.body.email) {
    return res.json({ message: 'Empty fields!' })
  }
  const user = await prisma.user.findUnique({
    where: { email: req.body.email }
  })

  if (!user) {
    return helper.resSend(res, null, helper.resStatuses.error, 'User with this email does not exist')
  }

  if (user.verified === 1) {
    return helper.resSend(res, null, helper.resStatuses.error, 'User was already Verified')
  }
  const code = helper.generateRandomString()
  await prisma.user.update({
    where: {
      email: req.body.email
    },
    data: {
      verificationcode: code
    }
  })
  helper.sendVerifyEmail(
    req.body.email,
    'Email verification',
    process.env.CLIENT_URL + '/verify/' + code
  )
  return helper.resSend(res, {
    verified: true,
    message: 'Sent Verification Email'
  })
})

module.exports = router
