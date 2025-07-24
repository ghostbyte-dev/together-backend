import { inject, injectable } from 'tsyringe';
import { ShoppinglistService } from '../services/shoppinglist.service';
import type { NextFunction, Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';

@injectable()
export class ShoppinglistController {
  constructor(@inject(ShoppinglistService) private shoppinglistService: ShoppinglistService) {}

  async getOpen(req: Request, res: Response, next: NextFunction) {
    const communityId = req.user.communityId;
    if (!communityId) {
      resSend(res, null, ResStatus.ERROR, 'no community id passed', 400);
      return;
    }
    try {
      const shoppinglistItems = await this.shoppinglistService.getItems(communityId, false);
      resSend(res, shoppinglistItems);
    } catch (error) {
      next(error);
    }
  }

  async getClosed(req: Request, res: Response, next: NextFunction) {
    const communityId = req.user.communityId;
    if (!communityId) {
      resSend(res, null, ResStatus.ERROR, 'no community id passed', 400);
      return;
    }
    try {
      const shoppinglistItems = await this.shoppinglistService.getItems(communityId, true);
      resSend(res, shoppinglistItems);
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    const communityId = req.user.communityId;
    if (!communityId) {
      resSend(res, null, ResStatus.ERROR, 'no community id passed', 400);
      return;
    }
    const name = req.body.name;
    if (!name) {
      resSend(res, null, ResStatus.ERROR, 'Empty Fields!');
      return;
    }
    try {
      const item = await this.shoppinglistService.addItem(name, communityId);
      resSend(res, item);
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction) {
    const itemId: number = req.body.id;
    const name: string | undefined = req.body.name;
    const done: boolean | undefined = req.body.done;
    if (!itemId) {
      resSend(res, null, ResStatus.ERROR, 'Empty Fields!');
      return;
    }
    try {
      const item = await this.shoppinglistService.updateItem(itemId, name, done);
      resSend(res, item);
    } catch (error) {
      next(error);
    }
  }
}
