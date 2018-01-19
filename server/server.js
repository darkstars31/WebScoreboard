var http = require('http');
var app = http.createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

var validator = require('validator');
var xssFilters = require('xss-filters');

var port = 6001;

app.listen(port);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });}


console.log('Scoreboard Server v-Alpha');
console.log('Listening for connections on port ' + port);

io.on('connection', (socket) => {
  socket.on('scoreboard', (data) => {
    var roomCode = getShortRoomCode();
    console.log("New Scoreboard Started: " + roomCode);
    socket.join(roomCode, () => {
      socket.emit("roomCode", {roomCode: roomCode})
    });
  });

  socket.on('controller', (data) => {
    console.log('Controller joining room: ', data.roomCode);
    if(io.sockets.adapter.rooms[data.roomCode]){
      socket.join(data.roomCode);
      socket.roomCode = data.roomCode;
      socket.isController = true;
      socket.to(data.roomCode).emit('controllerConnected', {});
    } else {
      console.log('Room not found: ' + data.roomCode);
    }
  });

  socket.on('changeScore', data => {
    socket.to(socket.roomCode).emit(data.team + "TeamScore", { points: data.change});
  });

	socket.on('disconnect', () => {
      	console.log('Client Disconnected ' + socket.id);
   });
  
});

function getShortRoomCode () {
  return Math.random().toString(26).substring(10).toUpperCase();
}

function log(message) {
	var file = 'log.txt';
	fs.appendFile('log.txt', 'ERROR: ' , message, function (err) {if(err) throw err;});
	fs.appendFile('log.txt', '\r\n', function (err) {if(err) throw err;});
}