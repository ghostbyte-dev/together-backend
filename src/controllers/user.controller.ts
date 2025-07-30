import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
import type { UserDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async getUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const communityId: number | undefined = req.user.communityId;
    try {
      const user: UserDto = await this.userService.getUserById(userId, communityId);
      resSend(res, user);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const userId: number = parseInt(req.params.userid);
    const communityId: number | undefined = req.user.communityId;
    try {
      const user = await this.userService.getUserById(userId, communityId);
      resSend(res, user);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();
      resSend(res, users);
    } catch (error) {
      next(error);
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

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const { newPassword, oldPassword } = req.body;
    if (!newPassword || !oldPassword) {
      resSend(res, null, ResStatus.ERROR, 'invalid arguments', 400);
    }
    const userId = req.user.id;
    try {
      await this.userService.changePassword(oldPassword, newPassword, userId);
      resSend(res, 'succesfully changed Password');
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    const file: Express.Multer.File | undefined = req.file;
    if (!file) {
      return resSend(res, null, ResStatus.ERROR, 'invalid data', 400);
    }
    const userId = req.user.id;
    try {
      const user = await this.userService.uploadAvatar(file, userId);
      resSend(res, user);
    } catch (error) {
      next(error);
    }
  }
}
