// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        jquery: 'jquery',
        three: 'three',
        orbitcontrols: 'threejs/orbitcontrols',
        socketio: 'socketio',
        font: 'threejs/helvetiker_regular.typeface'
    },
    shim: {
      'socketio' : {
        exports: 'io'
      }        
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['../app/main']);

test! hi!