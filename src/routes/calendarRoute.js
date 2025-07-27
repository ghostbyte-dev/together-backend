import { container } from 'tsyringe';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const { PrismaClient } = require('@prisma/client');
import { resSend, ResStatus } from '../helper';
import { CalendarController } from '../controllers/calendar.controller';
const prisma = new PrismaClient();

const calendarController = container.resolve(CalendarController);

router.post('/', auth, async (req, res, next) => calendarController.create(req, res, next));
router.patch('/', auth, async (req, res, next) => calendarController.update(req, res, next));

router.get('/interval', auth, async (req, res, next) =>
  calendarController.interval(req, res, next),
);

router.delete('/delete/:id', auth, async (req, res) => {
  // #swagger.tags = ['Calendar Entry']
  /* #swagger.security = [{"Bearer": []}] */
  if (!req.params.id || isNaN(req.params.id)) {
    resSend(res, null, ResStatus.ERROR, 'Empty Fields!');
    return;
  }
  await prisma.calendar_entry_user.deleteMany({
    where: {
      fk_calendar_entry_id: parseInt(req.params.id),
    },
  });
  await prisma.calendar_entry.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  resSend(res, 'deleted Calendar Entry ' + req.params.id);
});

const getSingleRoutine = async (routineId) => {
  return await prisma.routine.findUnique({
    where: {
      id: routineId,
    },
    include: {
      routine_user: {
        select: {
          user: {
            select: {
              name: true,
              color: true,
            },
          },
        },
      },
    },
  });
};

const createRoutine = async (req, res) => {
  if (!req.body.name || !req.body.startDate || !req.body.interval) {
    resSend(res, null, ResStatus.ERROR, 'Empty Fields!');
    return;
  }
  const routine = await prisma.routine.create({
    data: {
      name: req.body.name,
      startDate: new Date(req.body.startDate),
      interval: req.body.interval,
      fk_community_id: req.user.communityId,
    },
  });
  if (req.body.assignedUser) {
    const assignedUser = req.body.assignedUser;
    await prisma.routine_user.createMany({
      data: createCalendarEntryUserArray(assignedUser, routine.id, 'fk_routine_id'),
    });
  }
  resSend(res, await getSingleRoutine(routine.id));
};

const updateRoutine = async (req, res, routineId) => {
  if (req.body.name || req.body.startDate || req.body.interval || req.body.active !== undefined) {
    await prisma.routine.update({
      where: {
        id: routineId,
      },
      data: {
        name: req.body.name ?? undefined,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        interval: req.body.interval ?? undefined,
        active: req.body.active ?? undefined,
        fk_community_id: req.user.communityId,
      },
    });
  }
  if (req.body.assignedUser) {
    const assignedUsers = req.body.assignedUser;
    await prisma.routine_user.deleteMany({
      where: {
        fk_routine_id: routineId,
      },
    });
    await prisma.routine_user.createMany({
      data: createCalendarEntryUserArray(assignedUsers, routineId, 'fk_routine_id'),
    });
  }
  resSend(res, await getSingleRoutine(routineId));
};

router.post('/routine/modify', auth, async (req, res) => {
  // #swagger.tags = ['Calendar Entry']
  /* #swagger.security = [{"Bearer": []}] */
  const routineId = req.body.id;
  if (!routineId) {
    createRoutine(req, res);
  } else {
    updateRoutine(req, res, routineId);
  }
});

router.get('/routine/all', auth, async (req, res) => {
  // #swagger.tags = ['Calendar Entry']
  /* #swagger.security = [{"Bearer": []}] */
  const routines = await prisma.routine.findMany({
    where: {
      fk_community_id: req.user.communityId,
    },
    include: {
      routine_user: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              color: true,
              profile_image: true,
            },
          },
        },
      },
    },
  });
  resSend(res, routines);
});

module.exports = router;
