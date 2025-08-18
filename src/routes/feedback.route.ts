import type { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { FeedbackController } from '../controllers/feedback.controller';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const feedbackController = container.resolve(FeedbackController);

router.post('/', auth, (req: Request, res: Response, next: NextFunction) =>
  feedbackController.create(req, res, next),
);

module.exports = router;
