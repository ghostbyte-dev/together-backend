import type { NextFunction, Request, Response } from 'express';
import { ShoppinglistController } from '../controllers/shoppinglist.controller';
import { container } from 'tsyringe';
import { communityAccess } from '../middleware/communityAccess';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const shoppinglistController = container.resolve(ShoppinglistController);

router.post('/', auth, async (req: Request, res: Response, next: NextFunction) =>
  shoppinglistController.addItem(req, res, next),
);

router.get(
  '/open',
  auth,
  communityAccess,
  async (req: Request, res: Response, next: NextFunction) =>
    shoppinglistController.getOpen(req, res, next),
);

router.get(
  '/done',
  auth,
  communityAccess,
  async (req: Request, res: Response, next: NextFunction) =>
    shoppinglistController.getClosed(req, res, next),
);

router.patch('/', auth, communityAccess, async (req: Request, res: Response, next: NextFunction) =>
  shoppinglistController.updateItem(req, res, next),
);

router.delete(
  '/:id',
  auth,
  communityAccess,
  async (req: Request, res: Response, next: NextFunction) =>
    shoppinglistController.deleteItem(req, res, next),
);

module.exports = router;
