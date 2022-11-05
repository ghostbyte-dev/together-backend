const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const registrationRoute = require('./routes/registrationRoute')
app.use('/registration', registrationRoute)

const userRoute = require('./routes/userRoute')
app.use('/user', userRoute)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
