// "use strict" 
var express = require('express')
var app = express()
var port = process.env.PORT || 8000

//Logging IP Address
var ip = require('ip') 
console.log("CURRENT MACHINE IP ADDRESS: ",ip.address())

app.use(express.static('public'))

//Websocket
var http = require('http').Server(app)
var io = require('socket.io')(http)

//Johnny Five Part
var five = require("johnny-five")
var board = new five.Board() //Initialize Board
var led = null //Led
var servo = null //Servo
var controller = process.argv[2] || "GP2Y0A02YK0F" //Proximity Sensor

//Proximity variables
prox1 = 0
prox2 = 1

//Websocket Part
console.log('[System]: Establishing Websocket Connection...')
io.on('connection', function(socket){

  //Send message and log when a new user connected
  console.log('[System]: A new user established websocket connection...')
  io.emit('chat message', {waktu: Date.now(),psn: 'A new user connected'}) //We're sending JSON Object, so we use emit instead of Send

  //Send message and log when user disconnected
  socket.on('disconnect', function(){
    console.log('[System]: A user just disconnected')
    io.emit('chat message', {waktu: Date.now(),psn: 'A user just disconnected'})
  }) 
}) 
//Websocket Part End (Websocket established)

//Board functions
console.log('[System]: Checking for Board...')
board.on('ready', function() {
  io.emit('chat message', 'Board Connected') //Show board connected message via websocket

  console.log('[System]: Board Found...')
  console.log('[System]: Board Ready...')
  //Websocket Part
  console.log('[System]: Establishing Websocket Connection...')
  io.on('connection', function(socket){

    //Send message and log when a new user connected
    console.log('[System]: A new user established websocket connection...')
    io.emit('chat message', {waktu: Date.now(),psn: 'A new user connected'}) //We're sending JSON Object, so we use emit instead of Send

    //Send message and log when user disconnected
    socket.on('disconnect', function(){
      console.log('[System]: A user just disconnected')
      io.emit('chat message', {waktu: Date.now(),psn: 'A user just disconnected'})
    }) 
  }) 
  //Websocket Part End (Websocket established)

  led = new five.Led(13)  //Declare Led object at pin 13
  servo = new five.Servo(10)  //Declare Servo object at pin 10

  var proximity = new five.Proximity({
    controller: controller,
    pin: "A0"
  })  //Declare Proximity Sensor object at pin A0 (Analog 0)

  proximity.on("data", function() { //When Proximity picks data, run this function
    prox2 = this.cm
    if(prox2!=prox1)
    {
      io.emit('chat message', {waktu: Date.now(),psn: this.cm}) //Emit the value to websocket
      prox1 = this.cm
    }
    
    // console.log("Proximity in cm: ", this.cm) 
  }) 
}) 


//Get route
app.get('/led/:mode', function (req, res) { //When receiving path from /led with led param, run this method
  if(led) {
    var status = "" 
    switch(req.params.mode) {
      case "on":
        status = "ON"
        led.on() //Turn on Led
        break
      case "off":
        status = "OFF" 
        led.off()  //Turn off led
        break
      case "blink":
        status = "BLINK"
        led.blink()  //Blink the led
        break
      case "stop":
        status = "STOP"
        led.stop()  //Stop led blinking
        break
      default:
        status = "Unknown: " + req.params.mode
        break
      }
      res.send(status) 
   }
  //  else { 
  //    res.send('Board NOT Ready!')
  //  }
}) 

app.get('/servo/:mode', function (req, res) {
  if(led) {
    var status = "" 
    switch(req.params.mode) {
      case "open":
        servo.to(180) //Move servo to 180 degree
        break 
      case "close":
        servo.to(0) //Move servo to 0 degree
        break 
      default:
        status = "Unknown: " + req.params.mode 
        break 
     }
     console.log(status) 
     res.send(status) 
   }
  //  else { //Send Board NOT Ready as Error
  //    res.send('Board NOT ready!')
  //  }
}) 

// app.listen(port, function () {
//  console.log('Listening on port ' + port) 
// }) 
http.listen(port, function(){
  console.log('listening on *:' + port) 
}) 