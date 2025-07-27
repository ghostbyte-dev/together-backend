import type { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { TodoController } from '../controllers/todo.controller';
import { communityAccess } from '../middleware/communityAccess';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const todoController = container.resolve(TodoController);

router.post('/', auth, communityAccess, (req: Request, res: Response, next: NextFunction) =>
  todoController.create(req, res, next),
);

router.patch('/', auth, communityAccess, (req: Request, res: Response, next: NextFunction) =>
  todoController.update(req, res, next),
);

router.delete('/:id', auth, communityAccess, (req: Request, res: Response, next: NextFunction) =>
  todoController.delete(req, res, next),
);

router.get('/open', auth, communityAccess, (req: Request, res: Response, next: NextFunction) =>
  todoController.getOpen(req, res, next),
);

router.get('/done', auth, communityAccess, (req: Request, res: Response, next: NextFunction) =>
  todoController.getDone(req, res, next),
);

module.exports = router;
