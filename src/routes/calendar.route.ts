import { container } from 'tsyringe';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
import { CalendarController } from '../controllers/calendar.controller';
import type { NextFunction, Request, Response } from 'express';
import type { TypedRequestQuery } from '../types/QueryRequest';

const calendarController = container.resolve(CalendarController);

router.post('/', auth, async (req: Request, res: Response, next: NextFunction) =>
  calendarController.create(req, res, next),
);
router.patch('/', auth, async (req: Request, res: Response, next: NextFunction) =>
  calendarController.update(req, res, next),
);

router.get(
  '/interval',
  auth,
  async (
    req: TypedRequestQuery<{ startDate: string; endDate: string }>,
    res: Response,
    next: NextFunction,
  ) => calendarController.interval(req, res, next),
);

router.delete('/:id', auth, async (req: Request, res: Response, next: NextFunction) =>
  calendarController.delete(req, res, next),
);

router.post('/routine', auth, async (req: Request, res: Response, next: NextFunction) =>
  calendarController.createRoutine(req, res, next),
);

router.patch('/routine', auth, async (req: Request, res: Response, next: NextFunction) =>
  calendarController.updateRoutine(req, res, next),
);

router.get('/routine/all', auth, async (req: Request, res: Response, next: NextFunction) =>
  calendarController.getAllRoutines(req, res, next),
);

module.exports = router;
