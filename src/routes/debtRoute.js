const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const { PrismaClient } = require('@prisma/client');
import { DebtController } from '../controllers/debt.controller';
import { resSend, ResStatus } from '../helper';
const prisma = new PrismaClient();
import { container } from 'tsyringe';

const debtController = container.resolve(DebtController);

router.post('/', auth, async (req, res, next) => debtController.create(req, res, next));

router.get('/mine', auth, async (req, res) => {
  // #swagger.tags = ['Debt']
  // #swagger.description = 'Endpoint to get all debts of a user.'
  /* #swagger.security = [{"Bearer": []}] */
  /* const debts = await prisma.debt.findMany({
    where: {
      fk_community_id: req.user.communityId,
      OR: [
        {
          fk_user_creditor_id: req.user.id,
        },
        {
          fk_user_debitor_id: req.user.id,
        },
      ],
    },
    select: {
      id: true,
      name: true,
      amount: true,
      timestamp: true,
      user_debt_fk_user_creditor_idTouser: {
        select: {
          name: true,
          color: true,
          profile_image: true,
          id: true,
        },
      },
      user: {
        select: {
          name: true,
          color: true,
          profile_image: true,
          id: true,
        },
      },
    },
    orderBy: [
      {
        timestamp: 'desc',
      },
    ],
  });
  resSend(res, debts);
  */
  resSend(res, null);
});

router.get('/balance', auth, async (req, res, next) => debtController.balance(req, res, next));

const createOneBalanceOutOfgettingAndPayingMoney = async (moneyToPay, gettingMoney, myUser) => {
  const moneyToPayAlreadyAddedToResult = [];
  const result = [];
  const allUsers = await getAllUsers(myUser.fk_community_id);
  gettingMoney.forEach((element) => {
    const moneyToPayDebt = moneyToPay.find(
      (el) => el.fk_user_creditor_id === element.fk_user_debitor_id,
    );
    let amount = parseFloat(element._sum.amount);
    if (moneyToPayDebt !== undefined) {
      amount -= moneyToPayDebt._sum.amount;
      moneyToPayAlreadyAddedToResult.push(element.fk_user_debitor_id);
    }
    const debtorUser = allUsers.find((user) => user.id === element.fk_user_debitor_id);
    if (amount !== 0) {
      result.push({
        amount,
        debtor: debtorUser,
      });
    }
  });
  moneyToPay.forEach((element) => {
    if (!moneyToPayAlreadyAddedToResult.includes(element.fk_user_creditor_id)) {
      const debtorUser = allUsers.find((user) => user.id === element.fk_user_creditor_id);
      result.push({
        amount: element._sum.amount * -1,
        debtor: debtorUser,
      });
    }
  });
  return result;
};

const getAllUsers = async (communityId) => {
  const user = await prisma.user.findMany({
    where: {
      fk_community_id: communityId,
    },
    select: {
      id: true,
      name: true,
      profile_image: true,
    },
  });
  return user;
};

router.get('/single/:id', auth, async (req, res) => {
  // #swagger.tags = ['Debt']
  /* #swagger.security = [{"Bearer": []}] */
  const debt = await prisma.debt.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  resSend(res, debt);
});

module.exports = router;
