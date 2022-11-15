const express = require('express')
const router = express.Router()
const passport = require('passport')

const { PrismaClient } = require('@prisma/client')
const helper = require('../helper')
const prisma = new PrismaClient()

const getSingleTask = async (taskId) => {
  return await prisma.task.findUnique({
    where: {
      id: taskId
    },
    include: {
      task_user: {
        select: {
          user: {
            select: {
              firstname: true,
              color: true
            }
          }
        }
      }
    }
  })
}

const createTaskUserArray = (assignedUsers, taskRoutineId, taskOrRoutineString) => {
  const result = []
  assignedUsers.forEach(element => {
    result.push(
      {
        fk_user_id: element, [taskOrRoutineString]: taskRoutineId
      }
    )
  })
  return result
}

const createManyTaskUser = async (assignedUser, taskId) => {
  const tasksUser = await prisma.task_user.createMany({
    data: createTaskUserArray(assignedUser, taskId, 'fk_task_id')
  })
  console.log(tasksUser)
}

const createTask = async (req, res) => {
  if (!req.body.name || !req.body.date) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  const task = await prisma.task.create({
    data: {
      name: req.body.name,
      notes: req.body.notes ?? '',
      date: new Date(req.body.date),
      fk_community_id: req.user.fk_community_id,
      fk_routine_id: req.body.fk_routine_id ?? undefined
    }
  })
  if (req.body.assignedUser) {
    await createManyTaskUser(req.body.assignedUser, task.id)
  }
  helper.resSend(res, await getSingleTask(task.id))
}

const updateTask = async (req, res, taskId) => {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      name: req.body.name ?? undefined,
      notes: req.body.notes ?? undefined,
      date: req.body.date ? new Date(req.body.date) : undefined,
      done: req.body.done ?? undefined
    },
    include: {
      task_user: {
        where: {
          fk_user_id: { in: req.body.assignedUser }
        }
      }
    }
  })
  if (req.body.assignedUser) {
    if (task.task_user.length === 0) {
      await createManyTaskUser(req.body.assignedUser, task.id)
    }
  }
  helper.resSend(res, await getSingleTask(taskId))
}

router.post('/create', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  const taskId = req.body.id
  if (!taskId) {
    createTask(req, res)
  } else {
    updateTask(req, res, taskId)
  }
})

router.delete('/delete/:id', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  if (!req.params.id || isNaN(req.params.id)) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  await prisma.task_user.deleteMany({
    where: {
      fk_task_id: parseInt(req.params.id)
    }
  })
  await prisma.task.delete({
    where: {
      id: parseInt(req.params.id)
    }
  })
  helper.resSend(res, 'deleted Task ' + req.params.id)
})

router.post('/gettasksininterval', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  if (!req.body.startDate || !req.body.endDate) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  const tasks = await prisma.task.findMany({
    where: {
      fk_community_id: req.user.fk_community_id,
      date: {
        gte: new Date(req.body.startDate.split('T')[0]),
        lte: new Date(req.body.endDate)
      }
    },
    include: {
      task_user: {
        select: {
          user: {
            select: {
              id: true,
              firstname: true,
              color: true
            }
          }
        }
      }
    },
    orderBy: [
      {
        date: 'asc'
      }
    ]
  })
  const routines = await prisma.routine.findMany({
    where: {
      fk_community_id: req.user.fk_community_id
    },
    include: {
      routine_user: {
        select: {
          user: {
            select: {
              firstname: true,
              color: true
            }
          }
        }
      }
    }
  })
  for (const routine in routines) {
    const date = routines[routine].startDate
    while (date <= new Date(req.body.endDate)) {
      if (date >= new Date(req.body.startDate.split('T')[0])) {
        const task = await prisma.task.findFirst({
          where: {
            fk_routine_id: routines[routine].id
          }
        })
        if (!task) {
          tasks.push({ name: routines[routine].name, notes: task ? task.notes : '', date: date.toISOString(), done: task ? task.done : false, fk_community_id: req.user.fk_community_id, fk_routine_id: routines[routine].id, task_user: routines[routine].routine_user })
        }
      }
      date.setDate(date.getDate() + routines[routine].interval)
    }
  }
  helper.resSend(res, tasks)
})

const getSingleRoutine = async (routineId) => {
  return await prisma.routine.findUnique({
    where: {
      id: routineId
    },
    include: {
      routine_user: {
        select: {
          user: {
            select: {
              firstname: true,
              color: true
            }
          }
        }
      }
    }
  })
}

const createRoutine = async (req, res) => {
  if (!req.body.name || !req.body.startDate || !req.body.interval) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  const routine = await prisma.routine.create({
    data: {
      name: req.body.name,
      startDate: new Date(req.body.startDate),
      interval: req.body.interval,
      fk_community_id: req.user.fk_community_id
    }
  })
  if (req.body.assignedUser) {
    const assignedUser = req.body.assignedUser
    await prisma.routine_user.createMany({
      data: createTaskUserArray(assignedUser, routine.id, 'fk_routine_id')

    })
  }
  helper.resSend(res, await getSingleRoutine(routine.id))
}

router.post('/routine/create', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  const routineId = req.body.id
  if (!routineId) {
    createRoutine(req, res)
  } else {
    // updateTask(req, res, routineId)
  }
})

module.exports = router
