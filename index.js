const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('./models/hospital')
var auth = require('./routes/auth.js')
var hospital = require('./routes/hospital.js')
var booking = require('./routes/booking.js')
require('dotenv').config()
let port = process.env.PORT_NUMBER || 8080
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
//LIST THE API'S here...
app.use('/booking/',booking)
app.use('/user/', auth)
app.use('/hospital/', hospital)
app.get('/health', async (req, res) => {
  res.status(200).json({
    status: '200 OK',
    message: 'your server is healthy'
  })
})
app.listen(port, () => {
  console.log("server started successfully at port #" + port);
})