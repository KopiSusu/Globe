// starts the animation
var vfx = new VFX();
vfx.init();
vfx.run();


var socket = io.connect(window.SOCKET);

socket.on('connect', function() {

});


// receive unique player from server when first connected
socket.on('welcome', function(data) {

  json = JSON.parse(data);

  // set socket player
  socket.player = json.player;
  domhandler.player(socket.player);

  // test code
  //setTimeout(triggerMove, 2000);

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


// test code
function triggerMove() {
  if (socket.player.id == 1) {
    socket.emit('move', JSON.stringify({ player : socket.player,
                                          from : 'Russia',
                                          to : 'Australia',
                                          num : 10 }));
  }
  else {
    socket.emit('move', JSON.stringify({
      player: socket.player,
      from: 'Brazil',
      to: 'Australia',
      num: 12
    }));
  }
}