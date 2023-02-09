const express = require('express')
const router = express.Router()
const helper = require('../helper')
const auth = require('../middleware/userAuth')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.post('/items/add', auth, async (req, res) => {
  // #swagger.tags = ['Shopping List']
  /* #swagger.security = [{"Bearer": []}] */
  if (!req.body.name) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  const shoppingItem = await prisma.shoppinglist_item.create({
    data: {
      name: req.body.name,
      fk_community_id: req.user.communityId
    }
  })
  helper.resSend(res, shoppingItem)
})

router.get('/items/getopen', auth, async (req, res) => {
  // #swagger.tags = ['Shopping List']
  /* #swagger.security = [{"Bearer": []}] */
  if (req.user.communityId) {
    const items = await prisma.shoppinglist_item.findMany({
      where: {
        fk_community_id: req.user.communityId,
        done: false
      }
    })
    helper.resSend(res, items)
  } else {
    helper.resSend(res, [])
  }
})

router.get('/items/getdone', auth, async (req, res) => {
  // #swagger.tags = ['Shopping List']
  /* #swagger.security = [{"Bearer": []}] */
  if (req.user.communityId) {
    const items = await prisma.shoppinglist_item.findMany({
      where: {
        fk_community_id: req.user.communityId,
        done: true,
        done_date: { gte: new Date(new Date().toISOString().split('T')[0]) }
      }
    })
    console.log(items)
    helper.resSend(res, items)
  } else {
    helper.resSend(res, [])
  }
})

router.put('/items/update', auth, async (req, res) => {
  // #swagger.tags = ['Shopping List']
  /* #swagger.security = [{"Bearer": []}] */
  if (!req.body.id) {
    helper.resSend(res, null, helper.resStatuses.error, 'Missing Id')
    return
  }
  console.log(req.body.done)
  const item = await prisma.shoppinglist_item.update({
    where: { id: req.body.id },
    data: {
      name: req.body.name ?? undefined,
      done: req.body.done ?? undefined,
      done_date: req.body.done !== undefined && req.body.done ? new Date() : undefined
    }
  })
  helper.resSend(res, item)
})

module.exports = router
