import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller';
import type { NextFunction, Request, Response } from 'express';
const express = require('express');
const router = express.Router();

const authController = container.resolve(AuthController);

router.post('/register', async (req: Request, res: Response, next: NextFunction) =>
  authController.register(req, res, next),
);

router.post('/verify/:code', async (req: Request, res: Response, next: NextFunction) =>
  authController.verifyEmail(req, res, next),
);

router.post('/login', async (req: Request, res: Response, next: NextFunction) =>
  authController.login(req, res, next),
);

router.post('/resendVerificationEmail', async (req: Request, res: Response, next: NextFunction) =>
  authController.resendVerificationEmail(req, res, next),
);

router.post('/password-reset/request', async (req: Request, res: Response, next: NextFunction) =>
  authController.requestPasswordReset(req, res, next),
);

router.post('/password-reset', async (req: Request, res: Response, next: NextFunction) =>
  authController.resetPassword(req, res, next),
);

module.exports = router;
