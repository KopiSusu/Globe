var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  //res.sendFile('index.html');
  res.redirect('/main');
});

app.get('/main', function(req, res) {
  res.sendFile('main.html', {root: __dirname + '/public'});
})



var game = require('./game');

var PAUSE = true;
var newPlayers = [];


// socket connection starts
io.on('connection', function(socket) {

  /* this adds the socket to a queue of new players.
   queue is added to the game at start of each turn.*/
  newPlayers.push(socket);


  /* this removes the player instantly on disconnect.
     no further moves can be made.
     updated game state will be broadcast at start of next turn */
  socket.on('disconnect', function() {
    if (socket.player)

      // construct data object
      var data = {
        type: 'disconnect',
        msg: {
          player: socket.player,
          armies: game.armies(socket.player)
        }
      };
      
      game.removePlayer(socket.player);
      io.emit('game state', JSON.stringify(game.state()));
      io.emit('game update', JSON.stringify(data))
  });


  // this watches for a 'move' message from the socket
  socket.on('move', function(move) {
    if (!PAUSE) {

      var move = JSON.parse(move);
      //move troops in server copy of the game
      game.moveTroops(move.player, move.from, move.to, move.num);

      //send move to everyone except sender
      io.emit('move', JSON.stringify({
                                  player: move.player, 
                                  num: move.num, 
                                  from: move.from, 
                                  to: move.to
                                }));
    }

  });

// on.click, send msg ('move', JSON.stringify({playerid: socket.playerid, num: integer, from: 'Canada', to: 'Korea'}))
}); // socket connection ends

function start() {
  http.listen(2000, function() {

    // commence!
    startTurn();

  })
};

function startTurn() {

  var data = game.state();

  // this emits the game state to every connected socket
  io.emit('game state', JSON.stringify(data));

  // start accepting moves
  PAUSE = false;

  // this triggers end of turn
  setTimeout(endOfTurn, (game.turnLength + 2)*1000);

}


function endOfTurn() {

  // stop accepting moves
  PAUSE = true;

  var data = {
    type: 'messages',
    msg: game.evaluateState()
  }

  io.emit('game update', JSON.stringify(data));
  /* add queue of new players.
    do this after evaluating state as there 
    will be new empty/occupied territories */
  while (newPlayers.length > 0) {
    var socket = newPlayers.pop();
    socket.player = game.addNewPlayer();
    socket.emit('welcome', JSON.stringify({
                              player : socket.player 
                            }));

    // construct data object for new player update
    var data = {
      type: 'new player',
      msg: {
        player: socket.player,
        armies: game.armies(socket.player)
      }
    };

    io.emit('game update', JSON.stringify(data));
  }

  startTurn();
}

start();


