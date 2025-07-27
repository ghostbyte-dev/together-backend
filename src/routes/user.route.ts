import type { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../controllers/user.controller';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const userController = container.resolve(UserController);

router.get('/', auth, (req: Request, res: Response, next: NextFunction) =>
  userController.getUser(req, res, next),
);

router.get('/all', auth, async (req: Request, res: Response, next: NextFunction) =>
  userController.getAllUsers(req, res, next),
);

router.get('/:userid', auth, (req: Request, res: Response, next: NextFunction) =>
  userController.getUserById(req, res, next),
);

router.patch('/', auth, async (req: Request, res: Response) => userController.updateUser(req, res));

module.exports = router;
