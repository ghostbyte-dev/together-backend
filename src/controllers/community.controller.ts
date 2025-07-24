import { injectable, inject } from 'tsyringe';
import { CommunityService } from '../services/community.service';
import type { NextFunction, Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
import { ApiError } from '../errors/apiError';
import type { UserDto } from '../dtos/user.dto';
import type { CommunityDto } from '../dtos/community.dto';

@injectable()
export class CommunityController {
  constructor(@inject(CommunityService) private communityService: CommunityService) {}

  async getById(req: Request, res: Response, next: NextFunction) {
    const communityId = parseInt(req.params.id);
    try {
      const community: CommunityDto = await this.communityService.getById(communityId);
      resSend(res, community);
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction) {
    const communityId: string | undefined = req.params.communityId;
    if (!communityId) {
      resSend(res, null, ResStatus.ERROR, 'Missing Community Id');
      return;
    }

    const communityIdNumber: number = parseInt(communityId);

    try {
      const user: UserDto[] = await this.communityService.getMembers(communityIdNumber);
      resSend(res, user);
    } catch (error) {
      next(error);
    }
  }

  async sendRequest(req: Request, res: Response, next: NextFunction) {
    const inviteCode = parseInt(req.body.code);
    if (!inviteCode) {
      resSend(res, null, ResStatus.ERROR, 'Missing Invite Code');
      return;
    }
    const userId = req.user.id;

    try {
      await this.communityService.sendRequest(inviteCode, userId);
      resSend(res, { message: 'created Request' });
    } catch (error) {
      next(error);
    }
  }
}
