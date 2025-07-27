import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express';
import { resSend, ResStatus } from '../helper';
import { CalendarService } from '../services/calendar.service';
import type { CreateCalendarEntry } from '../types/createCalendarEntry';
import { UpdateCalendarEntry } from '../types/updateCalendarEntry';
import { ApiError } from '../errors/apiError';
import { TypedRequestQuery } from '../types/QueryRequest';
import { CreateRoutine } from '../types/createRoutine';

@injectable()
export class CalendarController {
  constructor(@inject(CalendarService) private calendarService: CalendarService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const data: CreateCalendarEntry = req.body;
    if (!data.name || !data.date) {
      resSend(res, 'Invalid Data');
      return;
    }

    if (typeof data.date === 'string') {
      const parsedDate = new Date(data.date);
      if (Number.isNaN(parsedDate.getTime())) {
        return resSend(res, 'Invalid Date Format');
      }
      data.date = parsedDate;
    }

    const communityId = req.user.communityId;

    try {
      const calendarEntry = await this.calendarService.create(data, communityId);
      resSend(res, calendarEntry);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    console.log('update');
    const data: UpdateCalendarEntry = req.body;
    if (!data.id) {
      resSend(res, null, ResStatus.ERROR, 'Invalid Data', 400);
      return;
    }

    if (typeof data.date === 'string') {
      const parsedDate = new Date(data.date);
      if (Number.isNaN(parsedDate.getTime())) {
        return resSend(res, 'Invalid Date Format');
      }
      data.date = parsedDate;
    }

    const communityId = req.user.communityId;

    try {
      const calendarEntry = await this.calendarService.update(data, communityId);
      resSend(res, calendarEntry);
    } catch (error) {
      next(error);
    }
  }

  async interval(
    req: TypedRequestQuery<{ startDate: string; endDate: string }>,
    res: Response,
    next: NextFunction,
  ) {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      resSend(res, null, ResStatus.ERROR, 'Invalid Data', 400);
      return;
    }

    const communityId = req.user.communityId;

    try {
      const calendarEntries = await this.calendarService.interval(startDate, endDate, communityId);
      resSend(res, calendarEntries);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    if (!req.params.id || Number.isNaN(id)) {
      resSend(res, null, ResStatus.ERROR, 'Empty Fields!');
      return;
    }
    try {
      await this.calendarService.deleteCalendarEntry(id);
      resSend(res, null);
    } catch (error) {
      next(error);
    }
  }

  async createRoutine(req: Request, res: Response, next: NextFunction) {
    const data: CreateRoutine = req.body;
    if (!data.name || !data.startDate || !data.interval) {
      resSend(res, 'Invalid Data');
      return;
    }
    if (typeof data.startDate === 'string') {
      const parsedDate = new Date(data.startDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return resSend(res, 'Invalid Date Format');
      }
      data.startDate = parsedDate;
    }

    const communityId = req.user.communityId;

    try {
      const routine = await this.calendarService.createRoutine(data, communityId);
      resSend(res, routine);
    } catch (error) {
      next(error);
    }
  }
}
