define(function (require) {

    // Load any app-specific modules
    // with a relative require call,
    // like:
    var animation = require('./animation').create();
        //layers = require('./layers/config');


    // Load library/vendor modules using
    // full IDs, like:
    var $     = require('jquery');
    var THREE = require('three');
    var io = require('socketio');

    // Main application code goes here:
    animation.run();

    io.socket = io.connect(window.SOCKET);


});
