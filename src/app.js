const express = require('express')
const cors = require('cors')
const app = express()
const passport = require('passport')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger-output.json')

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

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(3000, () => {
  console.log('App listening on Port 3000')
})
