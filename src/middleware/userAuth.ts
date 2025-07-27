import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from '../types/jwtPayload';
import { resSend } from '../helper';

const jwt = require('jsonwebtoken');

const config = process.env;

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const decoded: JwtPayload = jwt.verify(token, config.JWT_SECRET);
    req.user = { id: decoded.user.id, name: '', email: decoded.user.email, communityId: 0 };

    if (!req.user.id) {
      resSend(res, 'no UserId');
      return;
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send('Invalid Token');
  }
  return next();
};

module.exports = auth;
