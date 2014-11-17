define(function (require) {

    // Load any app-specific modules
    // with a relative require call,
    // like:
    var animation = require('./animation').create();
    var game = require('./game');


    // Load library/vendor modules using
    // full IDs, like:
    var $     = require('jquery');
    var THREE = require('three');
    var io = require('socketio');
    var font = require('font');


    // Main application code goes here:
    animation.run();

    io.socket = io.connect(window.SOCKET);

    io.socket.on('connect', function() {

        console.log("I'm connected");

    });

    io.socket.on('game state', function(data) {

        game.updateState(data);

        // MAKE THIS PLZZ! D:
        // animation.renderTroops(game.state);

            // game.state is an array of players with their troops
            // [
            //  {"id":1,"team_id":1,"troops":{"Germany":15,"Korea":15}},
            //  {"id":2,"team_id":2,"troops":{"Australia":15,"Canada":15}},
            //  {"id":3,"team_id":2,"troops":{}},
            //  {"id":4,"team_id":1,"troops":{}}
            // ] 

    });

    io.socket.on('move', function(data) {

    });


});
