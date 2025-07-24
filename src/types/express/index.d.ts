import * as express from 'express'
import { JwtPayload } from '../jwtPayload'
declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        name: string;
        email: string;
        communityId: number;
      }
    }
  }
}

