import type { Response } from 'express';
import type { ApiResponse } from './types/apiResponse';
import { PrismaClient } from '@prisma/client';

require('dotenv').config();

export enum ResStatus {
  OK = 'OK',
  ERROR = 'Error',
}

export function resSend<T = undefined>(
  res: Response,
  data: T | null,
  status = ResStatus.OK,
  error?: string,
  httpStatusCode = 200,
) {
  const response: ApiResponse<T> = {
    status: status,
    data: (data ?? {}) as T,
    error: error,
  };

  res.status(httpStatusCode).json(response);
}

export const checkIfUserIsInCommunity = async (
  userId: number,
  communityId: number,
  prisma: PrismaClient,
): Promise<boolean> => {
  const community = await prisma.community.findFirst({
    where: {
      id: communityId,
      users: {
        some: {
          id: userId,
        },
      },
    },
  });
  return community !== null;
};
