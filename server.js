var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/proximity.html');
});

io.on('connection', function(socket){
  console.log("a New user connected")
  io.emit('chat message', 'A new user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('chat message', 'Disconnected User');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

