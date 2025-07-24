import { injectable, inject } from 'tsyringe';
import { CommunityService } from '../services/community.service';
import type { Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
import { ApiError } from '../errors/apiError';
import type { UserDto } from '../dtos/user.dto';

@injectable()
export class CommunityController {
  constructor(@inject(CommunityService) private communityService: CommunityService) {}

  async getMembers(req: Request, res: Response) {
    const communityId: string | undefined = req.params.communityId;
    if (!communityId) {
      resSend(res, null, ResStatus.ERROR, 'Missing Community Id');
      return;
    }

    const communityIdNumber: number = parseInt(communityId);

    try {
      const user: UserDto[] = await this.communityService.getMembers(communityIdNumber);
      resSend(res, user);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        resSend(res, null, ResStatus.ERROR, err.message, err.status);
      } else {
        resSend(res, null, ResStatus.ERROR, 'An unexpected Error occured', 500);
      }
    }
  }

  async sendRequest(req: Request, res: Response) {
    const inviteCode = parseInt(req.body.code);
    if (!inviteCode) {
      resSend(res, null, ResStatus.ERROR, 'Missing Invite Code');
      return;
    }
    const userId = req.user.id;

    try {
      await this.communityService.sendRequest(inviteCode, userId);
      resSend(res, { message: 'created Request' });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        resSend(res, null, ResStatus.ERROR, err.message, err.status);
      } else {
        resSend(res, null, ResStatus.ERROR, 'An unexpected Error occured', 500);
      }
    }
  }
}
