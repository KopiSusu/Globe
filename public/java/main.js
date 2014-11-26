// starts the animation
var vfx = new VFX();
vfx.init();
vfx.run();


var socket = io.connect(window.SOCKET);

socket.on('connect', function() {
  console.log('connected');
});


// receive unique player from server when first connected
socket.on('welcome', function(data) {

  json = JSON.parse(data);

  // set socket player
  socket.player = json.player;
  domhandler.player(socket.player);

});

// receive game state from server
socket.on('game state', function(state) {

  var state = JSON.parse(state);

  Game.territories(state.territories);
  domhandler.timer(state.turnLength);
  domhandler.standingArmies(Game.armies(socket.player));

});

// receive other players' moves from server
socket.on('move', function(data) {
  var move = JSON.parse(data);

  Game.moveTroops(move.from, move.to, move.num, move.player);

  var data = {
    type: 'move',
    msg: move
  }

  domhandler.standingArmies(Game.armies(socket.player));
  domhandler.update(data);
});

// receive updates (except for moves)
socket.on('game update', function(data) {
    var data = JSON.parse(data);
    domhandler.update(data);
});