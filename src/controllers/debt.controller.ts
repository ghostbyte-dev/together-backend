import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
import { DebtService } from '../services/debt.service';

@injectable()
export class DebtController {
  constructor(@inject(DebtService) private debtService: DebtService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const communityId = req.user.communityId;
    const { name, amount, debitorId, creditorId } = req.body;
    if (!name || !amount || !debitorId || !creditorId) {
      resSend(res, null, ResStatus.ERROR, 'Invalid Arguments', 400);
      return;
    }

    try {
      const debt = await this.debtService.create(name, amount, debitorId, creditorId, communityId);
      resSend(res, debt);
    } catch (error) {
      next(error);
    }
  }
}
