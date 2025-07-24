import { container } from 'tsyringe';
import { UserController } from '../controllers/user.controller';
import type { Request, Response } from 'express';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const userController = container.resolve(UserController);

router.get('/getUser', auth, (req: Request, res: Response) => userController.getUser(req, res));

router.get('/databyuserid/:userid', auth, (req: Request, res: Response) =>
  userController.getUserById(req, res),
);

router.get('/getAll', auth, async (req: Request, res: Response) =>
  userController.getAllUsers(req, res),
);

router.put('/update', auth, async (req: Request, res: Response) =>
  userController.updateUser(req, res),
);

module.exports = router;
