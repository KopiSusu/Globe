

// //     // Load any app-specific modules
// //     // with a relative require call,
// //     // like:
// //     var animation = require('./animation').create();
// //     var game = require('./game');


// //     // Load library/vendor modules using
// //     // full IDs, like:
// //     var $     = require('jquery');
// //     var THREE = require('three');
// //     var io = require('socketio');
// //     var font = require('font');
// //     var OrbitControls = require('orbitcontrols');


// //     // Main application code goes here:

// //     animation.run();

// connect to server with socket
io.socket = io.connect(window.SOCKET);


// do stuff when connected
io.socket.on('connect', function() {
    console.log('Im connected');
    //setTimeout(triggerMove, 6000);
});


// receive welcome info from server when first connected
io.socket.on('welcome', function(data) {
    json = JSON.parse(data);

    // set socket playerid
    io.socket.playerid = json.playerid;

    console.log("i joined the game and my id is " + io.socket.playerid);
})


// receive game state from server
io.socket.on('game state', function(data) {

    var data = JSON.parse(data);
    Game.updateState(data);

    // ALSO MAKE THIS PLZ
    Game.startTimer();


    // MAKE THIS PLZZ! D:
    //animation.renderTroops(game.state);


});

// receive other players' moves from server
io.socket.on('move', function(data) {
   var json = JSON.parse(data);
   Game.moveTroops(json.playerid, json.num, json.from, json.to);

   /* at this point,`game.state` will be updated with the move, so
      we could use `animation.renderTroops(game.state)`. but I have a 
      feeling it will be better performance to just remove and add
      what is needed */
   // animation.removeTroops(json.playerid, json.num, json.from);
   // animation.addTroops(json.playerid, json.num, json.to); 

});


function triggerMove() {
    Game.makeMove(15, 'Zambia', 'Canada');
}
// use this function to move own troops
// e.g. makeMove(5, 'Canada', 'Korea')
Game.makeMove = function(num, from, to) {

    // check if I am assigned a player
    if (io.socket.playerid) {

        // update my local game with my move immediately
        Game.moveTroops(io.socket.playerid, num, from, to);
        
        // send my move to the server
        io.socket.emit('move', {
            playerid : io.socket.playerid, 
            num : num, 
            from : from, 
            to : to
        });
    }
}

// });
