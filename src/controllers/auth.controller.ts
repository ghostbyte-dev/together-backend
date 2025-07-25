import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
import { AuthService } from '../services/auth.service';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      resSend(res, null, ResStatus.ERROR, 'Invalid Data', 400);
    }
    try {
      await this.authService.register(email, name, password);
      resSend(res, 'registered');
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const verificationCode: string = req.params.code;
    if (!verificationCode) {
      resSend(res, null, ResStatus.ERROR, 'invalid arguments');
    }

    try {
      await this.authService.verifyEmail(verificationCode);
      resSend(res, {
        verified: true,
        message: 'Verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
