import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/apiError';
import { resSend, ResStatus } from '../helper';

export const errorHandlerMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log('error');
  if (err instanceof ApiError) {
    resSend(res, null, ResStatus.ERROR, err.message, err.status);
  } else {
    console.error(err);
    resSend(res, null, ResStatus.ERROR, 'An unexpected Error occured', 500);
  }
};
