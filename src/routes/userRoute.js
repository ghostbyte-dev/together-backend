const express = require('express')
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const helper = require('../helper')
const prisma = new PrismaClient()

router.get('/databyuserid/:userid', async (req, res) => {
  const userId = parseInt(req.params.userid)
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })
  if (!user) {
    helper.resSend(res, null, helper.resStatuses.error, 'User with the id ' + userId.toString() + " doesn't exist")
    return
  }
  helper.resSend(res, user)
})

router.get('/getAll', async (req, res) => {
  const user = await prisma.user.findMany()
  if (!user) {
    helper.resSend(res, null, helper.resStatuses.error, 'No User Exists')
    return
  }
  helper.resSend(res, user)
})

module.exports = router
