import type { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { TodoController } from '../controllers/todo.controller';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const todoController = container.resolve(TodoController);

router.post('/', auth, (req: Request, res: Response, next: NextFunction) =>
  todoController.create(req, res, next),
);

router.patch('/', auth, (req: Request, res: Response, next: NextFunction) =>
  todoController.update(req, res, next),
);

router.get('/open', auth, (req: Request, res: Response, next: NextFunction) =>
  todoController.getOpen(req, res, next),
);

router.get('/done', auth, (req: Request, res: Response, next: NextFunction) =>
  todoController.getDone(req, res, next),
);

module.exports = router;
