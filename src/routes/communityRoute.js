const express = require('express')
const helper = require('../helper')
const router = express.Router()
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const deleteOrAcceptRequest = async function (req, res, accept) {
  const requestId = req.body.id
  const community = await prisma.community.findFirst({
    where: { fk_admin_id: req.user.id },
    select: {
      id: true,
      request: {
        where: {
          id: requestId
        }
      }
    }
  })
  if (!community) {
    helper.resSend(res, null, helper.resStatuses.error, 'No Admin of a Community')
    return
  }
  if (community.request.length === 0) {
    helper.resSend(res, null, helper.resStatuses.error, 'No request from this user')
    return
  }
  if (accept) {
    await prisma.user.update({
      where: { id: community.request[0].fk_user_id },
      data: {
        fk_community_id: community.id
      }
    })
  }
  await prisma.request.delete({
    where: {
      id: community.request[0].id
    }
  })
  helper.resSend(res, { message: 'worked' })
}

router.get('/getbyid/:id', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  // #swagger.tags = ['Community']
  // #swagger.description = 'Get Community by id'
  /* #swagger.security = [{"Bearer": []}] */
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
  // #swagger.tags = ['Community']
  // #swagger.description = 'Find Community by the invite code'
  /* #swagger.security = [{"Bearer": []}] */
  const code = parseInt(req.params.code)
  const community = await prisma.community.findUnique({
    where: { code },
    select: {
      id: true,
      name: true,
      code: true,
      fk_admin_id: true,
      _count: {
        select: {
          user: true
        }
      }
    }
  })
  if (!community) {
    helper.resSend(res, null, helper.resStatuses.error, 'Comunity with the id ' + code.toString() + " doesn't exist")
    return
  }
  helper.resSend(res, { id: community.id, name: community.name, code: community.code, adminId: community.fk_admin_id, userCount: community._count.user })
})

router.get('/requests', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  // #swagger.tags = ['Community']
  // #swagger.description = 'Get all requests to a community, only admin can do this'
  /* #swagger.security = [{"Bearer": []}] */
  const community = await prisma.community.findFirst({
    where: { fk_admin_id: req.user.id },
    include: {
      request: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              profile_image: true
            }
          }
        }
      }
    }
  })
  if (!community) {
    helper.resSend(res, null, helper.resStatuses.error, 'No Admin of a Community')
    return
  }
  helper.resSend(res, community.request)
})

router.get('/requests/:communityid', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  // #swagger.tags = ['Community']
  /* #swagger.security = [{"Bearer": []}] */
  const communityId = parseInt(req.params.communityid)
  const requests = await prisma.request.findMany({
    where: { fk_community_id: communityId }
  })
  helper.resSend(res, requests)
})

router.post('/acceptrequest', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  // #swagger.tags = ['Community']
  /* #swagger.security = [{"Bearer": []}] */
  deleteOrAcceptRequest(req, res, true)
})

router.post('/denierequest', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  // #swagger.tags = ['Community']
  /* #swagger.security = [{"Bearer": []}] */
  deleteOrAcceptRequest(req, res, false)
})

router.post('/create', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  // #swagger.tags = ['Community']
  /* #swagger.security = [{"Bearer": []}] */
  if (!req.body.name) {
    helper.resSend(res, null, helper.resStatuses.error, 'missing Name')
    return
  }
  const inviteCode = helper.generateCommunityInviteCode()
  const community = await prisma.community.create({
    data: {
      name: req.body.name,
      code: inviteCode,
      fk_admin_id: req.user.id
    }
  })
  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      fk_community_id: community.id
    }
  })
  helper.resSend(res, { code: inviteCode })
})

module.exports = router
