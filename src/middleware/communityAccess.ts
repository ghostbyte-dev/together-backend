import type { NextFunction, Request, Response } from 'express';
import { checkIfUserIsInCommunity } from '../helper';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const communityAccess = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(500).send('Unexpected Error');
  }
  const communityId = parseInt(req.headers.communityid as string);
  if (!communityId || communityId === -1) {
    return res.status(400).send('No Community id passed');
  }

  const isUserInCommunty = await checkIfUserIsInCommunity(userId, communityId, prisma);
  if (!isUserInCommunty) {
    return res.status(401).send('unathorized');
  }

  req.user.communityId = communityId;
  next();
};
