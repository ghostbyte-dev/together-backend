const express = require('express')
const cors = require('cors')
const app = express()
const passport = require('passport')

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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
