/* To add a new layer to the animation:
** 1. create a new file in app/layers
** 2. edit app/layers/config.js to include your new file
** New layer should be added automatically to the animation */

define(['three', 'jquery', './layers/config'], function (THREE, $, layers) {

    // set the scene size
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight,

    // set some camera attributes
        VIEW_ANGLE = 35,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000,

    // set basic attributes
        layers = layers,
        renderer = new THREE.WebGLRenderer(),
        scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                  ASPECT,
                                  NEAR,
                                  FAR  );

    // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    function( callback ){
                      window.setTimeout(callback, 1000 / 60);
                    };
          })();

    // add all layers to scene
    for (var i in layers) {
      layer = layers[i].init();  // returns a THREE.PointCloud object
      scene.add(layer);  // add the layer to the main Scene object
    }

    /** object definition **/
    /* everything inside return{} is available to outside 
        e.g. animation.scene, animation.create, etc */
    return {

        scene: scene,
        camera: camera,
        renderer: renderer,

        // attach renderer to DOM container 
        create: function() {

            // get the DOM element to attach to
            // - assume we've got jQuery to hand
            var container = $('#container');

            // the camera starts at 0,0,0 so pull it back
            camera.position.z = 850;

            // start the renderer - set the clear colour
            // to a full black
            renderer.setClearColor(new THREE.Color(0xfafafa));
            renderer.setSize(WIDTH, HEIGHT);

            // attach the render-supplied DOM element
            container.append(renderer.domElement);

            return this;
        },

        // start rendering loop
        run: function() {
            function render() {
                // to change how every layer is rendered, edit inside the for-loop
                for (var i in scene.children) {
                  var system = scene.children[i];

                  // add some rotation to the system
                  system.rotation.y += 0.003;
                  system.rotation.x = 0.2;

                  /* flag to the particle system that we've
                      changed its vertices. This is the
                      dirty little secret. */
                  system.geometry.__dirtyVertices = true;
                }

                // render updated scene
                renderer.render( scene, camera );
                requestAnimFrame( render ); // set up the next call
            }
            render();
        }
      
    }

});