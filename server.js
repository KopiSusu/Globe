var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var game = require('./game');



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile('index.html');
});


io.on('connection', function(socket) {
  console.log("a user connected");
  game.addNewPlayers(1);

  // var newPlayer = new Player();
  // players.push(newPlayer);

  // socket.player = client;

  // console.log(players);

  // socket.on('chat message', function(msg) {
  //   io.emit('chat message', msg);
  // });
  // socket.on('disconnect', function() {
  //   console.log('user disconnected');
  // });
});

var start = function() {
  http.listen(3000, function() {
    console.log('listening on *:3000');
  })
};

start();

exports.start = start;

