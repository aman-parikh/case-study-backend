const express = require('express')

var socket = require('socket.io');
const bodyParser = require('body-parser')
var fs = require("fs");
const EventEmitter = require("events");
const emitter = new EventEmitter();
require('./models/hospital')
var auth = require('./routes/auth.js')
var hospital = require('./routes/hospital.js')
var booking = require('./routes/booking.js')
var cors = require('cors')
var queue = []
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

let port = process.env.PORT_NUMBER || 8080

//token handling functions
emitter.on("give token",()=>{
    
  fs.writeFileSync("token.txt", "0");
  token = fs.readFileSync("token.txt", "utf-8");
  // console.log("value changed to", token);
})

emitter.on("token received",()=>{
  fs.writeFileSync("token.txt", "1");
  token = fs.readFileSync("token.txt", "utf-8");
  // console.log("value changed to", token);

})

const getToken =()=>{
  return parseInt(fs.readFileSync("token.txt", "utf-8"));
}

// Static files


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
// app.listen(port, () => {
//   console.log("server started successfully at port #" + port);
// })
var server = app.listen(process.env.PORT_NUMBER, function(){
  console.log(`http://localhost:${process.env.PORT_NUMBER}`);
});

//Socket setup & pass server
var io = socket(server,{
  cors: {
    origin: "*",
    methods: ["PUT","POST","GET"]
  }});

io.on('connection', (socket) => {
  //console.log('made socket connection', socket.id);
  console.log("Client connected");

  socket.on("TOKEN_REQUEST",function(data){
      var x = getToken();
      if(x !== 1)
      {
          console.log("Token not available");
          console.log("Client Pushed to queue");
          queue.push(socket.id);
          io.to(socket.id).emit("wait");
      }
      else
      {
          emitter.emit("give token");
          console.log("Token given to Client");
          io.to(socket.id).emit("GIVE_TOKEN");
      }
  });

  socket.on("RETURN_TOKEN",function(data){
    emitter.emit("token received");
    console.log("Token returned by Client");
    if(queue.length != 0)
    {
        const s = queue.shift();
        io.to(s).emit("GIVE_TOKEN");
    }
 });
})