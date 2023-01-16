const express = require('express')
const router = express.Router()
const passport = require('passport')

const { PrismaClient } = require('@prisma/client')
const helper = require('../helper')
const prisma = new PrismaClient()

router.post('/create', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  // #swagger.tags = ['Debt']
  /* #swagger.security = [{"Bearer": []}] */
  console.log(req.body)
  if (!req.body.name || !req.body.amount || !req.body.debitorId) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  const debt = await prisma.debt.create({
    data: {
      fk_community_id: req.user.fk_community_id,
      fk_user_creditor_id: req.body.creditorId,
      fk_user_debitor_id: req.body.debitorId,
      name: req.body.name,
      amount: req.body.amount
    }
  })
  helper.resSend(res, debt)
})

router.get('/mine', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  // #swagger.tags = ['Debt']
  // #swagger.description = 'Endpoint to get all debts of a user.'
  /* #swagger.security = [{"Bearer": []}] */
  const debts = await prisma.debt.findMany({
    where: {
      fk_community_id: req.user.fk_community_id,
      OR: [
        {
          fk_user_creditor_id: req.user.id
        },
        {
          fk_user_debitor_id: req.user.id
        }
      ]
    },
    select: {
      id: true,
      name: true,
      amount: true,
      timestamp: true,
      user_debt_fk_user_creditor_idTouser: {
        select: {
          firstname: true,
          lastname: true,
          color: true,
          profile_image: true,
          id: true
        }
      },
      user: {
        select: {
          firstname: true,
          lastname: true,
          color: true,
          profile_image: true,
          id: true
        }
      }
    },
    orderBy: [
      {
        timestamp: 'desc'
      }
    ]
  })
  helper.resSend(res, debts)
})

router.get('/balance', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  // #swagger.tags = ['Debt']
  /* #swagger.security = [{"Bearer": []}] */
  const moneyToPay = await prisma.debt.groupBy({
    by: ['fk_user_creditor_id'],
    where: {
      fk_user_debitor_id: req.user.id
    },
    _sum: {
      amount: true
    }
  })
  const gettingMoney = await prisma.debt.groupBy({
    by: ['fk_user_debitor_id'],
    where: {
      fk_user_creditor_id: req.user.id
    },
    _sum: {
      amount: true
    }
  })
  const result = await createOneBalanceOutOfgettingAndPayingMoney(moneyToPay, gettingMoney, req.user)
  helper.resSend(res, result)
})

const createOneBalanceOutOfgettingAndPayingMoney = async (moneyToPay, gettingMoney, myUser) => {
  const moneyToPayAlreadyAddedToResult = []
  const result = []
  const allUsers = await getAllUsers(myUser.fk_community_id)
  gettingMoney.forEach((element) => {
    const moneyToPayDebt = moneyToPay.find(el => el.fk_user_creditor_id === element.fk_user_debitor_id)
    let amount = parseFloat(element._sum.amount)
    if (moneyToPayDebt !== undefined) {
      amount -= moneyToPayDebt._sum.amount
      moneyToPayAlreadyAddedToResult.push(element.fk_user_debitor_id)
    }
    const debtorUser = allUsers.find(user => user.id === element.fk_user_debitor_id)
    if (amount !== 0) {
      result.push({
        amount,
        debtor: debtorUser
      })
    }
  })
  moneyToPay.forEach((element) => {
    if (!moneyToPayAlreadyAddedToResult.includes(element.fk_user_creditor_id)) {
      const debtorUser = allUsers.find(user => user.id === element.fk_user_creditor_id)
      result.push({
        amount: element._sum.amount * -1,
        debtor: debtorUser
      })
    }
  })
  return result
}

const getAllUsers = async (communityId) => {
  const user = await prisma.user.findMany({
    where: {
      fk_community_id: communityId
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      profile_image: true
    }
  })
  return user
}

router.get('/single/:id', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  // #swagger.tags = ['Debt']
  /* #swagger.security = [{"Bearer": []}] */
  const debt = await prisma.debt.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })
  helper.resSend(res, debt)
})

module.exports = router
