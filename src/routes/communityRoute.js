const express = require('express')
const helper = require('../helper')
const router = express.Router()
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/getbyid/:id', passport.authenticate('userAuth', { session: false }), async (req, res) => {
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

router.get('/getbycode/:code', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  const code = req.params.code
  const community = await prisma.community.findUnique({
    where: { code }
  })
  if (!community) {
    helper.resSend(res, null, helper.resStatuses.error, 'Comunity with the id ' + code.toString() + " doesn't exist")
    return
  }

  console.log(community)
  helper.resSend(res, community)
})

router.get('/requests/:communityid', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  const communityId = parseInt(req.params.communityid)
  const requests = await prisma.request.findMany({
    where: { fk_community_id: communityId }
  })
  helper.resSend(res, requests)
})

router.post('/create', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  if (!req.body.name) {
    helper.resSend(res, null, helper.resStatuses.error, 'missing Name')
    return
  }
  const inviteCode = helper.generateCommunityInviteCode()
  await prisma.community.create({
    data: {
      name: req.body.name,
      code: inviteCode,
      fk_admin_id: req.user.id // use id from jwt Token
    }
  })
  helper.resSend(res, { code: inviteCode })
})

module.exports = router
