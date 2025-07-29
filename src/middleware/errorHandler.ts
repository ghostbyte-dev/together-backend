import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/apiError';
import { resSend, ResStatus } from '../helper';

export const errorHandlerMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    console.log(err.message);
    resSend(res, null, ResStatus.ERROR, err.message, err.status);
  } else {
    console.error(err);
    resSend(res, null, ResStatus.ERROR, 'An unexpected Error occured', 500);
  }
};
