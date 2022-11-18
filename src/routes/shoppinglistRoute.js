const express = require('express')
const router = express.Router()
const helper = require('../helper')
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.post('/items/add', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  if (!req.body.name) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  const shoppingItem = await prisma.shoppinglist_item.create({
    data: {
      name: req.body.name,
      fk_community_id: req.user.fk_community_id
    }
  })
  helper.resSend(res, shoppingItem)
})

router.get('/items/getopen', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  const items = await prisma.shoppinglist_item.findMany({
    where: {
      fk_community_id: req.user.fk_community_id,
      done: false
    }
  })
  helper.resSend(res, items)
})

router.get('/items/getdone', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  const items = await prisma.shoppinglist_item.findMany({
    where: {
      fk_community_id: req.user.fk_community_id,
      done: true,
      done_date: { gte: new Date(new Date().toISOString().split('T')[0]) }
    }
  })
  helper.resSend(res, items)
})

router.put('/items/update', passport.authenticate('userAuth', { session: false }), async (req, res) => {
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
