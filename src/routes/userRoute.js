import { container } from 'tsyringe';
import { UserController } from '../controllers/userController';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const { PrismaClient } = require('@prisma/client');
const helper = require('../helper');
const prisma = new PrismaClient();
const userController = container.resolve(UserController);

router.get('/getUser', auth, (req, res) => userController.getUser(req, res));

router.get('/databyuserid/:userid', auth, async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.security = [{"Bearer": []}] */
  const userId = parseInt(req.params.userid);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      communities: true,
    },
  });
  if (!user) {
    helper.resSend(
      res,
      null,
      helper.resStatuses.error,
      `User with the id ${userId.toString()} doesn't exist`,
    );
    return;
  }
  helper.resSend(res, user);
});

router.get('/getAll', auth, async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.security = [{"Bearer": []}] */
  const user = await prisma.user.findMany();
  if (!user) {
    helper.resSend(res, null, helper.resStatuses.error, 'No User Exists');
    return;
  }
  helper.resSend(res, user);
});

router.get('/getcommunitymembers/:communityId', auth, async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.security = [{"Bearer": []}] */
  if (!req.params.communityId) {
    helper.resSend(res, null, helper.resStatuses.error, 'Missing Community Id');
    return;
  }

  const communityWithUsers = await prisma.community.findUnique({
    where: { id: parseInt(req.params.communityId) },
    include: {
      users: true,
    },
  });

  const users = communityWithUsers.users;

  if (!users) {
    helper.resSend(res, null, helper.resStatuses.error, 'No User Exists in this Community');
    return;
  }
  helper.resSend(res, users);
});

router.put('/update', auth, async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.security = [{"Bearer": []}] */
  const user = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      name: req.body.name ?? undefined,
      email: req.body.email ?? undefined,
      profile_image: req.body.profile_image ?? undefined,
      color: req.body.color ?? undefined,
    },
  });
  helper.resSend(res, user);
});

router.post('/sendrequest', auth, async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.security = [{"Bearer": []}] */
  const inviteCode = parseInt(req.body.code);
  if (!inviteCode) {
    helper.resSend(res, null, helper.resStatuses.error, 'Missing Invite Code');
    return;
  }
  const community = await prisma.community.findUnique({
    where: { code: inviteCode },
  });
  if (!community) {
    helper.resSend(
      res,
      null,
      helper.resStatuses.error,
      'No Community exists with this invite code',
    );
    return;
  }
  const userBeforeAdded = await prisma.request.findFirst({
    where: { fk_user_id: req.user.id },
  });
  if (userBeforeAdded) {
    helper.resSend(res, null, helper.resStatuses.error, 'User already sent an Request');
    return;
  }
  await prisma.request.create({
    data: {
      fk_user_id: req.user.id,
      fk_community_id: community.id,
    },
  });
  helper.resSend(res, { message: 'created Request' });
});

module.exports = router;
