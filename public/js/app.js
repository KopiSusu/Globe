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
        socketio: '//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min',
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