import type { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { CommunityController } from '../controllers/community.controller';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');

const communityController = container.resolve(CommunityController);

router.get('/code/:code', auth, async (req: Request, res: Response, next: NextFunction) =>
  communityController.getByCode(req, res, next),
);

router.post('/', auth, async (req: Request, res: Response, next: NextFunction) =>
  communityController.create(req, res, next),
);

router.get('/requests', auth, async (req: Request, res: Response, next: NextFunction) =>
  communityController.getRequests(req, res, next),
);

router.get('/:communityId/members', auth, async (req: Request, res: Response, next: NextFunction) =>
  communityController.getMembers(req, res, next),
);

router.post('/request', auth, async (req: Request, res: Response, next: NextFunction) =>
  communityController.sendRequest(req, res, next),
);

router.post('/request/accept', auth, async (req: Request, res: Response, next: NextFunction) =>
  communityController.acceptRequest(req, res, next),
);

router.post('/request/decline', auth, async (req: Request, res: Response, next: NextFunction) =>
  communityController.declineRequest(req, res, next),
);

router.get('/:id', auth, async (req: Request, res: Response, next: NextFunction) =>
  communityController.getById(req, res, next),
);

module.exports = router;
