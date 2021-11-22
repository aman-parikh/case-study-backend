const express = require('express')
const app = express()
var auth = require('./routes/auth.js')
require('dotenv').config()
let port = process.env.PORT_NUMBER || 8080
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
//LIST THE API'S here...
app.use('/user/', auth)
app.get('/health', async (req, res) => {
  res.status(200).json({
    status: '200 OK',
    message: 'your server is healthy'
  })
})
app.listen(port, () => {
  console.log("server started successfully at port #" + port);
})