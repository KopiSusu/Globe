// starts the animation
var vfx = new VFX();
vfx.init();
vfx.run();


var socket = io.connect(window.SOCKET);

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
  domhandler.standingArmies(state.territories);

});

// receive other players' moves from server
socket.on('move', function(data) {
  var move = JSON.parse(data);

  Game.moveTroops(move.from, move.to, move.num, move.player);

  var data = {
    type: 'move',
    msg: move
  }

  domhandler.standingArmies(Game.territories());
  domhandler.update(data);
});

// receive updates (except for moves)
socket.on('game update', function(data) {
    var data = JSON.parse(data);
    domhandler.update(data);
});
