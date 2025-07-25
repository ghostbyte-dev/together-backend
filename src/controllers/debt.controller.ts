import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
import { DebtService } from '../services/debt.service';
import { BalanceDto } from '../dtos/balance.dto';
import { DebtDto } from '../dtos/debt.dto';

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

  async balance(req: Request, res: Response, next: NextFunction) {
    const communityId = req.user.communityId;
    const userId = req.user.id;

    try {
      const balance: BalanceDto[] = await this.debtService.balance(userId, communityId);
      resSend(res, balance);
    } catch (error) {
      next(error);
    }
  }

  async mine(req: Request, res: Response, next: NextFunction) {
    const communityId = req.user.communityId;
    const userId = req.user.id;

    try {
      const debts: DebtDto[] = await this.debtService.mine(userId, communityId);
      resSend(res, debts);
    } catch (error) {
      next(error);
    }
  }
}
