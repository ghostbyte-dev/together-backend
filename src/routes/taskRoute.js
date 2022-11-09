const express = require('express')
const router = express.Router()
const passport = require('passport')

const { PrismaClient } = require('@prisma/client')
const helper = require('../helper')
const prisma = new PrismaClient()

const createTask = async (req, res) => {
  if (!req.body.name || !req.body.date) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  console.log(req.user)
  const task = await prisma.task.create({
    data: {
      name: req.body.name,
      notes: req.body.notes ?? '',
      date: new Date(req.body.date),
      fk_community_id: req.user.fk_community_id
    }
  })
  helper.resSend(res, task)
}

const updateTask = async (req, res, taskId) => {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      name: req.body.name ?? undefined,
      notes: req.body.notes ?? undefined,
      date: req.body.date ? new Date(req.body.date) : undefined,
      done: req.body.done ?? undefined
    }
  })
  helper.resSend(res, task)
}

router.post('/create', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  const taskId = req.body.id
  if (!taskId) {
    createTask(req, res)
  } else {
    updateTask(req, res, taskId)
  }
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
        gte: new Date(req.body.startDate),
        lte: new Date(req.body.endDate)
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
    }
  })
  console.log(routines)
  for (const routine in routines) {
    const date = routines[routine].startDate
    console.log(routines[routine])
    while (date <= new Date(req.body.endDate)) {
      if (date >= new Date(req.body.startDate)) {
        const task = await prisma.task.findFirst({
          where: {
            fk_routine_id: routines[routine].id,
            date
          }
        })
        console.log(task)
        tasks.push({ name: routines[routine].name, notes: task ? task.notes : '', date: date.toISOString(), done: task ? task.done : false, fk_community_id: req.user.fk_community_id, fk_routine_id: routines[routine].id })
      }
      date.setDate(date.getDate() + routines[routine].interval)
    }
  }
  helper.resSend(res, tasks)
})

router.post('/routine/create', passport.authenticate('userAuth', { session: false }), async (req, res) => {
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
  helper.resSend(res, routine)
})

module.exports = router
