import { container } from 'tsyringe';
import { UserController } from '../controllers/user.controller';
import type { NextFunction, Request, Response } from 'express';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const userController = container.resolve(UserController);

router.get('/getUser', auth, (req: Request, res: Response, next: NextFunction) =>
  userController.getUser(req, res, next),
);

router.get('/databyuserid/:userid', auth, (req: Request, res: Response, next: NextFunction) =>
  userController.getUserById(req, res, next),
);

router.get('/getAll', auth, async (req: Request, res: Response, next: NextFunction) =>
  userController.getAllUsers(req, res, next),
);

router.put('/update', auth, async (req: Request, res: Response) =>
  userController.updateUser(req, res),
);

module.exports = router;
