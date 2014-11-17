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

var myMove = {
  playerid : 1,
  num : 5,
  from: 'Canada',
  to: 'Korea'
}

io.on('connection', function(socket) {

  /* this adds the socket to a queue of new players.
   queue is added to the game at start of each turn.*/
  newPlayers.push(socket);

  setTimeout(function() {
    socket.emit('move', JSON.stringify(myMove));
  }, 7000)

  /* this removes the player instantly on disconnect.
     no further moves can be made.
     updated game state will be broadcast at start of next turn */
  socket.on('disconnect', function() {
    if (socket.player)
      game.removePlayer(socket.player);
  });

  // this watches for a 'move' message from the socket
  socket.on('move', function(move) {
    if (!PAUSE) {
      //evaluate move, emit to everyone else
    }

  });

});

function start() {
  http.listen(3000, function() {
    startTurn();
  })
};

function startTurn() {

  // this emits the game state to every connected socket
  io.emit('game state', JSON.stringify(game.state));

  // start accepting moves
  PAUSE = false;

  // this triggers end of turn
  setTimeout(endOfTurn, (TURN_LENGTH + 1)*1000);
}

function endOfTurn() {

  // stop accepting moves
  PAUSE = true;

  // evaluate state of the board, remove troops as needed
  game.evaluateState();

  /* add queue of new players.
    do this after evaluating state as there 
    will be new empty/occupied territories */
  while (newPlayers.length > 0) {
    var socket = newPlayers.pop();
    socket.player = game.addNewPlayer();
  }

  startTurn();
}

start();

// exports.start = start;

