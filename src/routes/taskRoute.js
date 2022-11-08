const express = require('express')
const router = express.Router()
const passport = require('passport')

const { PrismaClient } = require('@prisma/client')
const helper = require('../helper')
const prisma = new PrismaClient()

router.post('/create', passport.authenticate('userAuth', { session: false }), async (req, res) => {
  if (!req.body.name || !req.body.notes || !req.body.date) {
    helper.resSend(res, null, helper.resStatuses.error, 'Empty Fields!')
    return
  }
  console.log(req.user)
  const task = await prisma.task.create({
    data: {
      name: req.body.name,
      notes: req.body.notes,
      date: new Date(req.body.date),
      fk_community_id: req.user.fk_community_id
    }
  })
  helper.resSend(res, task)
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
  console.log(tasks)
  const routines = await prisma.routine.findMany({
    where: {
      fk_community_id: req.user.fk_community_id
    }
  })
  console.log(routines)
  routines.forEach(routine => {
    const date = routine.startDate

    while (date <= new Date(req.body.endDate)) {
      console.log(date)
      if (date >= new Date(req.body.startDate)) {
        tasks.push({ name: routine.name, date: date.toISOString() })
      }
      date.setDate(date.getDate() + routine.interval)
      console.log(date)
    }
  })
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
