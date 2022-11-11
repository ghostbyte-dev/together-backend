const express = require('express')
const cors = require('cors')
const app = express()
const passport = require('passport')
const https = require('https')
const fs = require('fs')

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

const options = {
  key: fs.readFileSync('../key.pem'),
  cert: fs.readFileSync('../cert.pem')
}

https.createServer(options, function (req, res) {
  res.writeHead(200)
  res.end('hello world\n')
}).listen(8000)
