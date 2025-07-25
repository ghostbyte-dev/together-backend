const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
import { AuthController } from '../controllers/auth.controller';
import { createJWT, resSend, ResStatus } from '../helper';
import { container } from 'tsyringe';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const authController = container.resolve(AuthController);

router.post('/register', async (req, res, next) => authController.register(req, res, next));

router.post('/verify/:code', async (req, res, next) => authController.verifyEmail(req, res, next));

router.post('/login', async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Login'
  if (!req.body.email || !req.body.password) {
    return res.json({ message: 'Empty fields!' });
  } else {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
      include: {
        communities: true,
      },
    });
    if (!user) {
      resSend(res, null, ResStatus.ERROR, 'This user does not exist!');
      return;
    }
    if (!user.verified) {
      resSend(res, { verified: false }, ResStatus.ERROR, 'This user is not verified yet!');
      return;
    }
    bcrypt.compare(req.body.password, user.password, async (err, isMatch) => {
      if (err) {
        return resSend(res, null, ResStatus.ERROR, 'Bcrypt compare error');
      }
      if (!isMatch) {
        resSend(res, null, ResStatus.ERROR, 'Wrong password!');
      } else {
        const communities = user.communities.map((community) => community.id);
        const usertoken = createJWT(user.id, user.email, user.username, communities);

        const answer = { token: usertoken };
        resSend(res, answer);
      }
    });
  }
});

router.get('/getnewtoken', async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Get new JWT'
  console.log('get new token');
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const config = process.env;
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log(decoded);
    const userId = decoded.version === 4 ? decoded.user.id : decoded.id;
    console.log(userId);
    if (!userId) {
      throw Error('invalid token');
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        communities: true,
      },
    });
    const communities = user.communities.map((community) => community.id);

    const usertoken = helper.createJWT(user.id, user.email, user.username, communities);

    const answer = { token: usertoken };
    resSend(res, answer);
  } catch (err) {
    console.log(err);
    resSend(res, null, ResStatus.ERROR, err.message);
  }
});

router.post('/resendVerificationEmail', async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Verfy a new account'
  if (!req.body.email) {
    return res.json({ message: 'Empty fields!' });
  }
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!user) {
    return resSend(res, null, ResStatus.ERROR, 'User with this email does not exist');
  }

  if (user.verified === 1) {
    return resSend(res, null, ResStatus.ERROR, 'User was already Verified');
  }
  const code = helper.generateRandomString();
  await prisma.user.update({
    where: {
      email: req.body.email,
    },
    data: {
      verificationcode: code,
    },
  });
  helper.sendVerifyEmail(
    req.body.email,
    'Email verification',
    process.env.CLIENT_URL + '/verify/' + code,
  );
  return resSend(res, {
    verified: true,
    message: 'Sent Verification Email',
  });
});

module.exports = router;
