const express = require('express')
const cors = require('cors')
const app = express()
const passport = require('passport')
require('dotenv').config()

console.log(process.env.DATABASE_URL)

app.use(cors())
app.use(express.json())

const userAuth = require('./middleware/userAuth')
passport.use('userAuth', userAuth)

const registrationRoute = require('./routes/registrationRoute')
app.use('/registration', registrationRoute)

const userRoute = require('./routes/userRoute')
app.use('/user', userRoute)

const communityRoute = require('./routes/communityRoute')
app.use('/community', communityRoute)

const taskRoute = require('./routes/taskRoute')
app.use('/task', taskRoute)

const shoppinglistRoute = require('./routes/shoppinglistRoute')
app.use('/shoppinglist', shoppinglistRoute)

const debtRoute = require('./routes/debtRoute')
app.use('/debt', debtRoute)

app.get('/test', (req, res) => {
  console.log('test')
  res.send('test')
})

app.listen(3000, () => {
  console.log('App listening on Port 3000')
})
