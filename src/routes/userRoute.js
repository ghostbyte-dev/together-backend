const express = require('express')
const router = express.Router()
const database = require('../database')

router.get('/databyuserid/:userid', async (req, res) => {
  const dbRwp = await database.dbGetSingleRow(
    'SELECT * from user u Where u.id = ?',
    [req.params.userid]
  )
  database.resSend(res, dbRwp)
})

module.exports = router
