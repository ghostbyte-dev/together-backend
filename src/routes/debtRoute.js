const express = require('express')
const router = express.Router()
const passport = require('passport')

const { PrismaClient } = require('@prisma/client')
const helper = require('../helper')
const prisma = new PrismaClient()

router.post('/create', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  if (!req.body.name || !req.body.amount || !req.body.debtorId) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  const debt = await prisma.debt.create({
    data: {
      fk_community_id: req.user.fk_community_id,
      fk_user_creditor_id: req.user.id,
      fk_user_debtor_id: req.body.debtorId,
      name: req.body.name,
      amount: req.body.amount
    }
  })
  helper.resSend(res, debt)
})

router.get('/all', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  const debts = await prisma.debt.findMany({
    where: {
      fk_community_id: req.user.fk_community_id
    }
  })
  helper.resSend(res, debts)
})

router.get('/single/:id', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  const debt = await prisma.debt.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })
  helper.resSend(res, debt)
})

module.exports = router
