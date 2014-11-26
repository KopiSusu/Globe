$(document).ready(function(){

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
    Game.player(socket.player);
    domhandler.player(socket.player);

    console.log("joined the game with id " + socket.player.id);
  });


  // receive game state from server
  socket.on('game state', function(state) {

    var state = JSON.parse(state);

    Game.territories(state.territories);
    domhandler.timer(state.turnLength);
    domhandler.standingArmies(Game.armies(socket.player));

  });

  // // receive other players' moves from server
  // socket.on('move', function(data) {
  //   var json = JSON.parse(data);
  //   Game.moveTroops(json.from, json.to, json.num, json.player);
  // });

  // // test code
  // var move1 = 'Russia'
  // var move2 = 'Brazil'

  // function triggerMove() {
  //   if (socket.player.id == 1) {
  //     Game.moveTroops(socket.player, move1, 'Greenland', 10);
  //   }
  //   else {
  //     Game.moveTroops(socket.player, move2, 'Greenland', 12);
  //   }
  // }

});