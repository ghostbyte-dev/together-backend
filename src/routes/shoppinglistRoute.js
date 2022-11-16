const express = require('express')
const router = express.Router()
const helper = require('../helper')
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.post('/item/add', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  if (!req.body.name || !req.body.amount || !req.body.fk_shoppinglist_id) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  const shoppingItem = await prisma.shoppinglist_item.create({
    data: {
      name: req.body.name,
      amount: req.body.amount,
      done: req.body.done ?? undefined,
      fk_shoppinglist_id: req.body.fk_shoppinglist_id
    }
  })
  helper.resSend(res, shoppingItem)
})

router.get('/items/all', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  const items = await prisma.shoppinglist.findUnique({
    where: {
      fk_community_id: req.user.fk_community_id
    },
    include: { shoppinglist_item: true }
  })
  console.log(req.user.fk_community_id)
  helper.resSend(res, items)
})

module.exports = router
