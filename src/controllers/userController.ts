import { inject, injectable } from 'tsyringe';
import { UserService } from '../services/userService';
import type { Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
import { ApiError } from '../errors/apiError';
import type { UserDto } from '../dtos/user.dto';

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async getUser(req: Request, res: Response) {
    const userId = req.user.id;
    try {
      const user: UserDto = await this.userService.getUserById(userId);
      resSend(res, user);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        resSend(res, null, ResStatus.ERROR, err.message, err.status);
      } else {
        resSend(res, null, ResStatus.ERROR, 'An unexpected Error occured', 500);
      }
    }
  }

  async getUserById(req: Request, res: Response) {
    const userId: number = parseInt(req.params.userid);
    try {
      const user = await this.userService.getUserById(userId);
      resSend(res, user);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        resSend(res, null, ResStatus.ERROR, err.message, err.status);
      } else {
        resSend(res, null, ResStatus.ERROR, 'An unexpected Error occured', 500);
      }
    }
  }

  async getAllUsers(_req: Request, res: Response) {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();
      resSend(res, users);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        resSend(res, null, ResStatus.ERROR, err.message, err.status);
      } else {
        resSend(res, null, ResStatus.ERROR, 'An unexpected Error occured', 500);
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    const user = await this.userService.updateUser(
      req.user.id,
      req.body.name,
      req.body.email,
      req.body.profile_image,
      req.body.color,
    );
    resSend(res, user);
  }
}
