import { inject, injectable } from 'tsyringe';
import { UserService } from '../services/user.service';
import type { NextFunction, Request, Response } from 'express';
import { resSend } from '../helper';
import type { UserDto } from '../dtos/user.dto';

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async getUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id;
    try {
      const user: UserDto = await this.userService.getUserById(userId);
      resSend(res, user);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const userId: number = parseInt(req.params.userid);
    try {
      const user = await this.userService.getUserById(userId);
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
}
