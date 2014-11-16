var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile('index.html');
});



var game = require('./game');

var TURN_LENGTH = 5; // turn length in seconds
var PAUSE = true;
var newPlayers = [];

io.on('connection', function(socket) {
  console.log("a user connected");
  newPlayers.push(socket);

  socket.on('disconnect', function() {
    if (socket.player)
      game.removePlayer(socket.player);
  });

  socket.on('move', function(move) {
    console.log(move);
  });


  // socket.on('chat message', function(msg) {
  //   io.emit('chat message', msg);
  // });
  // socket.on('disconnect', function() {
  //   console.log('user disconnected');
  // });
});

function start() {
  http.listen(3000, function() {
    console.log('listening on *:3000');
    startTurn();
  })


};

function startTurn() {
  console.log("starting turn");
  io.emit('game state', JSON.stringify(game.state));
  PAUSE = false;
  setTimeout(endOfTurn, (TURN_LENGTH + 1)*1000);
}

function endOfTurn() {
  console.log("ending turn");
  PAUSE = true;

  game.evaluateState();

  while (newPlayers.length > 0) {
    var socket = newPlayers.pop();
    socket.player = game.addNewPlayer();
  }

  startTurn();
}

start();

// exports.start = start;

