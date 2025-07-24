import { container } from 'tsyringe';
import { UserController } from '../controllers/userController';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const { PrismaClient } = require('@prisma/client');
import { resSend, ResStatus } from '../helper';
const prisma = new PrismaClient();
const userController = container.resolve(UserController);

router.get('/getUser', auth, (req, res) => userController.getUser(req, res));

router.get('/databyuserid/:userid', auth, (req, res) => userController.getUserById(req, res));

router.get('/getAll', auth, async (req, res) => userController.getAllUsers(req, res));

router.get('/getcommunitymembers/:communityId', auth, async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.security = [{"Bearer": []}] */
  if (!req.params.communityId) {
    resSend(res, null, ResStatus.ERROR, 'Missing Community Id');
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
    resSend(res, null, ResStatus.ERROR, 'No User Exists in this Community');
    return;
  }
  resSend(res, users);
});

router.put('/update', auth, async (req, res) => userController.updateUser(req, res));

router.post('/sendrequest', auth, async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.security = [{"Bearer": []}] */
  const inviteCode = parseInt(req.body.code);
  if (!inviteCode) {
    resSend(res, null, ResStatus.ERROR, 'Missing Invite Code');
    return;
  }
  const community = await prisma.community.findUnique({
    where: { code: inviteCode },
  });
  if (!community) {
    resSend(res, null, ResStatus.ERROR, 'No Community exists with this invite code');
    return;
  }
  const userBeforeAdded = await prisma.request.findFirst({
    where: { fk_user_id: req.user.id },
  });
  if (userBeforeAdded) {
    resSend(res, null, ResStatus.ERROR, 'User already sent an Request');
    return;
  }
  await prisma.request.create({
    data: {
      fk_user_id: req.user.id,
      fk_community_id: community.id,
    },
  });
  resSend(res, { message: 'created Request' });
});

module.exports = router;
