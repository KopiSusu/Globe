// define(function (require) {

    debugger;

    var TURN_LENGTH = 5;

//     // Load any app-specific modules
//     // with a relative require call,
//     // like:
//     var animation = require('./animation').create();
//     var game = require('./game');


//     // Load library/vendor modules using
//     // full IDs, like:
//     var $     = require('jquery');
//     var THREE = require('three');
//     var io = require('socketio');
//     var font = require('font');
//     var OrbitControls = require('orbitcontrols');


//     // Main application code goes here:

//     animation.run();


    // connect to server with socket
    io.socket = io.connect(window.SOCKET);


    // do stuff when connected
    io.socket.on('connect', function() {
        console.log("i still work");
    });


    // receive welcome info from server when first connected
    io.socket.on('welcome', function(data) {
        json = JSON.parse(data);

        // set socket playerid
        io.socket.playerid = json.playerid;
    })


    // receive game state from server
    io.socket.on('game state', function(data) {
        var data = JSON.parse(data);
        game.updateState(data);
        console.log(data)

        // ALSO MAKE THIS PLZ
        animation.startTimer(3);


        // MAKE THIS PLZZ! D:
        animation.renderTroops(game.state);

        //     game.state is an array of players with their troops
            // [
            //  {"id":1, troops":{"Germany":15,"Korea":15}},
            //  {"id":2, "troops":{"Australia":15,"Canada":15}},
            //  {"id":3, "troops":{}},
            //  {"id":4, "troops":{}}
            // ] 

    });

    // receive other players' moves from server
    io.socket.on('move', function(data) {
       var json = JSON.parse(data);
       game.moveTroops(json.playerid, json.num, json.from, json.to);

       /* at this point,`game.state` will be updated with the move, so
          we could use `animation.renderTroops(game.state)`. but I have a 
          feeling it will be better performance to just remove and add
          what is needed */
       // animation.removeTroops(json.playerid, json.num, json.from);
       // animation.addTroops(json.playerid, json.num, json.to); 

    });


    // use this function to move own troops
    // e.g. makeMove(5, 'Canada', 'Korea')
    function makeMove(num, from, to) {

        // check if I am assigned a player
        if (io.socket.playerid) {

            // update my local game with my move immediately
            game.moveTroops(io.socket.playerid, num, from, to);
            
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
