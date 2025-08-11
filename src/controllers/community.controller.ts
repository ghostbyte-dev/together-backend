import { injectable, inject } from 'tsyringe';
import { CommunityService } from '../services/community.service';
import type { NextFunction, Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
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

  async getMine(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id;
    try {
      const community: CommunityDto[] = await this.communityService.getMine(userId);
      resSend(res, community);
    } catch (error) {
      next(error);
    }
  }

  async getByCode(req: Request, res: Response, next: NextFunction) {
    const code = parseInt(req.params.code);
    if (!code) {
      resSend(res, null, ResStatus.ERROR, 'Invalid Community Code');
    }
    try {
      const community: CommunityDto = await this.communityService.getByCode(code);
      resSend(res, community);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const name = req.body.name;
    if (!name) {
      resSend(res, null, ResStatus.ERROR, 'missing Name');
    }

    try {
      const community = this.communityService.create(name, req.user.id);
      resSend(res, community);
    } catch (error) {
      next(error);
    }
  }

  async getRequests(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const communityId = req.user.communityId;

    try {
      const requests = await this.communityService.getRequests(userId, communityId);
      resSend(res, requests);
    } catch (error) {
      next(error);
    }
  }

  async acceptRequest(req: Request, res: Response, next: NextFunction) {
    const requestId = req.body.id;
    const communityId = req.user.communityId;
    const userId = req.user.id;

    if (!requestId) {
      resSend(res, null, ResStatus.ERROR, 'Invalid request Id');
    }

    try {
      await this.communityService.acceptRequest(userId, communityId, requestId);
      resSend(res, { message: 'accepted' });
    } catch (error) {
      next(error);
    }
  }

  async declineRequest(req: Request, res: Response, next: NextFunction) {
    const requestId = req.body.id;
    const communityId = req.user.communityId;
    const userId = req.user.id;

    if (!requestId) {
      resSend(res, null, ResStatus.ERROR, 'Invalid request Id');
    }

    try {
      await this.communityService.declineRequest(userId, communityId, requestId);
      resSend(res, { message: 'declined' });
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

  async updateName(req: Request, res: Response, next: NextFunction) {
    const name = req.body.name;
    const communityId = parseInt(req.params.id as string);
    if (!name || !communityId) {
      resSend(res, null, ResStatus.ERROR, 'Invalid Arguments', 400);
      return;
    }
    const userId = req.user.id;

    try {
      const updatedCommunity = await this.communityService.updateName(name, communityId, userId);
      resSend(res, updatedCommunity);
    } catch (error) {
      next(error);
    }
  }

  async leave(req: Request, res: Response, next: NextFunction) {
    const communityId = parseInt(req.params.id);
    if (!communityId) {
      return resSend(res, null, ResStatus.ERROR, 'Invalid Arguments', 400);
    }
    const userId = req.user.id;
    try {
      await this.communityService.leave(communityId, userId);
      resSend(res, { message: 'left community' });
    } catch (error) {
      next(error);
    }
  }
}
