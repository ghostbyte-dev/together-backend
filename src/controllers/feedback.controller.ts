import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
import { FeedbackService } from '../services/feedback.service';

@injectable()
export class FeedbackController {
  constructor(@inject(FeedbackService) private feedbackService: FeedbackService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { feedback } = req.body;
    if (!feedback) {
      resSend(res, null, ResStatus.ERROR, 'Invalid Data');
    }

    const userId = req.user.id;

    try {
      await this.feedbackService.create(feedback, userId);
      resSend(res, null, ResStatus.OK, undefined, 201);
    } catch (error) {
      next(error);
    }
  }
}
