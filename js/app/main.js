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
    var font = require('font');
    var OrbitControls = require('orbitcontrols');

    // Main application code goes here:
    animation.run();

    // some simple jquery timer
    // lets make it look like defcon

});
