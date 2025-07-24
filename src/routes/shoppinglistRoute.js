const express = require('express');
const router = express.Router();
import { resSend, ResStatus } from '../helper';
const auth = require('../middleware/userAuth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/items/add', auth, async (req, res) => {
  // #swagger.tags = ['Shopping List']
  /* #swagger.security = [{"Bearer": []}] */
  if (!req.body.name) {
    resSend(res, null, ResStatus.ERROR, 'Empty Fields!');
    return;
  }
  const shoppingItem = await prisma.shoppinglist_item.create({
    data: {
      name: req.body.name,
      fk_community_id: req.user.communityId,
    },
  });
  resSend(res, shoppingItem);
});

router.get('/items/getopen', auth, async (req, res) => {
  // #swagger.tags = ['Shopping List']
  /* #swagger.security = [{"Bearer": []}] */
  if (req.user.communityId) {
    const items = await prisma.shoppinglist_item.findMany({
      where: {
        fk_community_id: req.user.communityId,
        done: false,
      },
    });
    resSend(res, items);
  } else {
    resSend(res, []);
  }
});

router.get('/items/getdone', auth, async (req, res) => {
  // #swagger.tags = ['Shopping List']
  /* #swagger.security = [{"Bearer": []}] */
  if (req.user.communityId) {
    const items = await prisma.shoppinglist_item.findMany({
      where: {
        fk_community_id: req.user.communityId,
        done: true,
        done_date: { gte: new Date(new Date().toISOString().split('T')[0]) },
      },
    });
    resSend(res, items);
  } else {
    resSend(res, []);
  }
});

router.put('/items/update', auth, async (req, res) => {
  // #swagger.tags = ['Shopping List']
  /* #swagger.security = [{"Bearer": []}] */
  if (!req.body.id) {
    resSend(res, null, ResStatus.ERROR, 'Missing Id');
    return;
  }
  const item = await prisma.shoppinglist_item.update({
    where: { id: req.body.id },
    data: {
      name: req.body.name ?? undefined,
      done: req.body.done ?? undefined,
      done_date: req.body.done !== undefined && req.body.done ? new Date() : undefined,
    },
  });
  resSend(res, item);
});

module.exports = router;
