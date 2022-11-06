const express = require('express')
const helper = require('../helper')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/getById/:id', async (req, res) => {
  const communityId = parseInt(req.params.id)
  const community = await prisma.community.findUnique({
    where: { id: communityId }
  })
  if (!community) {
    helper.resSend(res, null, helper.resStatuses.error, 'Comunity with the id ' + communityId.toString() + " doesn't exist")
    return
  }
  helper.resSend(res, community)
})

router.get('/getByInviteCode/:code', async (req, res) => {
  const code = req.params.code
  const community = await prisma.community.findUnique({
    where: { code }
  })
  if (!community) {
    helper.resSend(res, null, helper.resStatuses.error, 'Comunity with the id ' + code.toString() + " doesn't exist")
    return
  }
  helper.resSend(res, community)
})

router.post('/create', async (req, res) => {
  if (!req.body.name) {
    helper.resSend(res, null, helper.resStatuses.error, 'missing Name')
    return
  }
  const inviteCode = helper.generateCommunityInviteCode()
  await prisma.community.create({
    data: {
      name: req.body.name,
      code: inviteCode,
      fk_admin_id: 10 // use id from jwt Token
    }
  })
  helper.resSend(res, { code: inviteCode })
})

module.exports = router
