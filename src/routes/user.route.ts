import type { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../controllers/user.controller';
import { optionalCommunity } from '../middleware/optionalCommunity';
import multer from 'multer';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const userController = container.resolve(UserController);

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put(
  '/avatar',
  auth,
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) =>
    userController.uploadAvatar(req, res, next),
);

router.get('/', auth, optionalCommunity, (req: Request, res: Response, next: NextFunction) =>
  userController.getUser(req, res, next),
);

router.delete('/', auth, (req: Request, res: Response, next: NextFunction) =>
  userController.deleteAccount(req, res, next),
);

router.get('/all', auth, async (req: Request, res: Response, next: NextFunction) =>
  userController.getAllUsers(req, res, next),
);

router.put('/password-change', auth, async (req: Request, res: Response, next: NextFunction) =>
  userController.changePassword(req, res, next),
);

router.get('/:userid', auth, optionalCommunity, (req: Request, res: Response, next: NextFunction) =>
  userController.getUserById(req, res, next),
);

router.patch('/', auth, async (req: Request, res: Response) => userController.updateUser(req, res));

module.exports = router;
