// starts the animation
var vfx = new VFX();
vfx.init();
vfx.run();


var socket = io.connect(window.SOCKET);

socket.on('connect', function() {
  console.log('connected');
  //setTimeout(triggerMove, 6000);
});


// receive welcome info from server when first connected
socket.on('welcome', function(data) {

  console.log('received welcome');
  json = JSON.parse(data);

  // set socket player
  socket.player = json.player;
  domhandler.player(socket.player);

  console.log("joined the game with id " + socket.player.id);
});


socket.on('game update', function(data) {
    var data = JSON.parse(data);
    domhandler.update(data);
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
