const express = require('express');
const router = express.Router();
const auth = require('../middleware/userAuth');
const { PrismaClient } = require('@prisma/client');
import { resSend, ResStatus } from '../helper';
const prisma = new PrismaClient();

const getSingleCalendarEntry = async (calendarEntryId) => {
  return await prisma.calendar_entry.findUnique({
    where: {
      id: calendarEntryId,
    },
    include: {
      calendar_entry_user: {
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

const createCalendarEntryUserArray = (
  assignedUsers,
  calendarEntryRoutineId,
  calendarEntryOrRoutineString,
) => {
  const result = [];
  assignedUsers.forEach((element) => {
    result.push({
      fk_user_id: element,
      [calendarEntryOrRoutineString]: calendarEntryRoutineId,
    });
  });
  return result;
};

const createManyCalendarEntryUser = async (assignedUser, calendarEntryId) => {
  await prisma.calendar_entry_user.createMany({
    data: createCalendarEntryUserArray(assignedUser, calendarEntryId, 'fk_calendar_entry_id'),
  });
};

const createCalendarEntry = async (req, res) => {
  if (!req.body.name || !req.body.date) {
    resSend(res, null, ResStatus.ERROR, 'Empty Fields!');
    return;
  }
  const calendarEntry = await prisma.calendar_entry.create({
    data: {
      name: req.body.name,
      notes: req.body.notes ?? '',
      date: new Date(req.body.date),
      done: req.body.done ?? false,
      fk_community_id: req.user.communityId,
      fk_routine_id: req.body.fk_routine_id ?? undefined,
    },
  });
  if (req.body.assignedUser && req.body.assignedUser[0] !== null) {
    await createManyCalendarEntryUser(req.body.assignedUser, calendarEntry.id);
  }
  resSend(res, await getSingleCalendarEntry(calendarEntry.id));
};

const updateCalendarEntry = async (req, res, calendarEntryId) => {
  const calendarEntry = await prisma.calendar_entry.update({
    where: { id: calendarEntryId },
    data: {
      name: req.body.name ?? undefined,
      notes: req.body.notes ?? undefined,
      date: req.body.date ? new Date(req.body.date) : undefined,
      done: req.body.done ?? undefined,
    },
    include: {
      calendar_entry_user: {
        where: {
          fk_calendar_entry_id: calendarEntryId,
        },
      },
    },
  });
  if (req.body.assignedUser) {
    if (calendarEntry.calendar_entry_user.length === 0 && req.body.assignedUser.length !== 0) {
      await createManyCalendarEntryUser(req.body.assignedUser, calendarEntry.id);
    } else {
      await prisma.calendar_entry_user.deleteMany({
        where: { fk_calendar_entry_id: calendarEntry.id },
      });
      await createManyCalendarEntryUser(req.body.assignedUser, calendarEntry.id);
    }
  }
  resSend(res, await getSingleCalendarEntry(calendarEntryId));
};

router.post('/create', auth, async (req, res) => {
  // #swagger.tags = ['Calendar Entry']
  /* #swagger.security = [{"Bearer": []}] */
  const calendarEntryId = req.body.id;
  if (!calendarEntryId) {
    createCalendarEntry(req, res);
  } else {
    updateCalendarEntry(req, res, calendarEntryId);
  }
});

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

router.post('/interval', auth, async (req, res) => {
  // #swagger.tags = ['Calendar Entry']
  /* #swagger.security = [{"Bearer": []}] */
  if (!req.body.startDate || !req.body.endDate) {
    resSend(res, null, ResStatus.ERROR, 'Empty Fields!');
    return;
  }
  const calendarEntries = await prisma.calendar_entry.findMany({
    where: {
      fk_community_id: req.user.communityId,
      date: {
        gte: new Date(req.body.startDate.split('T')[0]),
        lte: new Date(req.body.endDate),
      },
    },
    include: {
      calendar_entry_user: {
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
    orderBy: [
      {
        date: 'asc',
      },
    ],
  });
  const routines = await prisma.routine.findMany({
    where: {
      fk_community_id: req.user.communityId,
      active: true,
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
  for (const routine in routines) {
    const date = routines[routine].startDate;
    while (date <= new Date(req.body.endDate)) {
      if (date >= new Date(req.body.startDate.split('T')[0])) {
        const calendarEntry = await prisma.calendar_entry.findFirst({
          where: {
            fk_routine_id: routines[routine].id,
            date,
          },
        });
        if (!calendarEntry) {
          calendarEntries.push({
            name: routines[routine].name,
            notes: calendarEntry ? calendarEntry.notes : '',
            date: date.toISOString(),
            done: calendarEntry ? calendarEntry.done : false,
            fk_community_id: req.user.communityId,
            fk_routine_id: routines[routine].id,
            calendar_entry_user: routines[routine].routine_user,
          });
        }
      }
      date.setDate(date.getDate() + routines[routine].interval);
    }
  }
  resSend(res, calendarEntries);
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
