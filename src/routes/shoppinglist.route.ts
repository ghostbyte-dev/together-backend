import type { NextFunction, Request, Response } from 'express';
import { ShoppinglistController } from '../controllers/shoppinglist.controller';
import { container } from 'tsyringe';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const shoppinglistController = container.resolve(ShoppinglistController);

router.post('/', auth, async (req: Request, res: Response, next: NextFunction) =>
  shoppinglistController.addItem(req, res, next),
);

router.get('/open', auth, async (req: Request, res: Response, next: NextFunction) =>
  shoppinglistController.getOpen(req, res, next),
);

router.get('/done', auth, async (req: Request, res: Response, next: NextFunction) =>
  shoppinglistController.getClosed(req, res, next),
);

router.put('/', auth, async (req: Request, res: Response, next: NextFunction) =>
  shoppinglistController.updateItem(req, res, next),
);

module.exports = router;
