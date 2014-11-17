/* To add a new layer to the animation:
** 1. create a new file in app/layers
** 2. edit app/layers/config.js to include your new file
** New layer should be added automatically to the animation */

define(['three', 'jquery', 'TweenMax', './layers/config', 'orbitcontrols'], function (THREE, $, TweenMax, layers, OrbitControls) {

    // set the scene size
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight,


    // set some camera attributes
        VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000,

    // set basic attributes
        layers = layers,
        renderer = new THREE.WebGLRenderer({antialias:true}),
        scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                  ASPECT,
                                  NEAR,
                                  FAR  ),
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.minDistance = 250,
        controls.maxDistance = 650,
        controls.zoomSpeed = 0.3,
        controls.zoomDampingFactor = 0.3,
        controls.momentumDampingFactor = 0.5,
        controls.rotateSpeed = 0.6;



        scene.fog = new THREE.Fog( 0xfafafa, 40, 2000 );

        var light   = new THREE.HemisphereLight( 0xffffff, 0x555555, 0.9 ); 
        scene.add( light )

    // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    function( callback ){
                      window.seTimeout(callback, 1000 / 60);
                    };
          })();




    // add all layers to scene
    for (var i in layers) {
      layer = layers[i].init();  // returns a THREE.Object3D object
      scene.add(layer);  // add the layer to the main Scene object
    }



    // Click event listener
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    var projector = new THREE.Projector(),
        raycaster = new THREE.Raycaster(),
        continents = []

    seperate();
    function seperate () {
        for (var i = 0; i < 242; i++) {
            continents.push(layers.continents.getGeometryByIndex(i))
        }
    }

    var activeCountry = null;

    var clickedOnContinent = function(){
        return intersects.length > 0;
    }

    var updateContinentScale = function(country, scale) {
        TweenMax.to(country.scale, 0.7, { x : scale, y : scale, z : scale });
    }

    var PI2 = Math.PI * 2;

    var particleMaterial = new THREE.SpriteMaterial( {

                    transparent: false,
                    color: 0x111111,
                    program: function ( context ) {

                        context.beginPath();
                        context.arc( 0, 0, 0.5, 0, PI2, true );
                        context.fill();

                    }

                } );

    var show = false

    function onDocumentMouseDown( event ) {

        event.preventDefault();
        // debugger
        if (show === false){
            TweenMax.to(scene.children[6].children[0].position, 10, { y: 2000});
            TweenMax.to(scene.children[6].children[1].position, 10, { y: -2000});
            for (var i = 0; i < continents.length; i++) {
                // TweenMax.to(continents[i].material, 1, { opacity: 1});
                // TweenMax.to(continents[i].scale, time, { x : 1.0, y : 1.0, z : 1.0 });
                var time = Math.random()+1+Math.random();
                TweenMax.to(continents[i].scale, time, { x : 1.0, y : 1.0, z : 1.0 });
                show = true
            }
        }

        var vector = new THREE.Vector3();
        vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
        vector.unproject( camera );

        raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( continents );

        if (intersects[ 0 ]) {
            if (activeCountry) {
                // reset country scale
                updateContinentScale(activeCountry, 1.0);
            }
        }

        if (intersects[ 0 ]) {
            var continent = intersects[ 0 ].object;
            updateContinentScale(continent, 1.05);
            activeCountry = continent; 
            var particle = new THREE.Particle( particleMaterial );
            particle.position = intersects[ 0 ].point;
            particle.scale.x = particle.scale.y = 8;
            scene.add( particle );
            debugger
            // var wrapper = new THREE.PointCloudMaterial({
            //     color: 0x111111,
            //     size: 200,
            //     transparent: false
            // });
            // var particle = new THREE.Particle(wrapper);
            // particle.position.set(intersects[ 0 ].point.x ,intersects[ 0 ].point.y ,intersects[ 0 ].point.z);
            // scene.add(particle);
        }         
    }

    debugger
    // timer
    var counter = 60;
    function countDown() {
        if (counter >= 0){
            setTimeout(function(){
                $('#timer').text(counter);
                counter--;
                countDown();
            }, 1000);
        } else {
            //request new game state 
            // on succesful request run countDown again!
            counter = 60;
            countDown();
        }
    }

    // start the damn timer
    countDown();

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
            camera.position.z = 650;

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
                  // system.rotation.y = 3.5;
                  // system.rotation.x = ;

                  /* flag to the particle system that we've
                      changed its vertices. This is the
                      dirty little secret. */
                    if (system.geometry) {
                        system.geometry.__dirtyVertices = true;
                    }
                    // else if ... 
                    /* FIX: system.continents has no geometry; it has child
                        THREE.Line that has geometry*/

                }

                scene.children[0].rotation.y += 0.002;
                scene.children[1].rotation.y = 3.5;
                scene.children[4].rotation.y += 0.002;
                scene.children[3].rotation.y += 0.002;
                scene.children[6].rotation.y += 0.001;


                controls.update();
                // TWEEN.update();

                // render updated scene
                renderer.clear();
                renderer.render( scene, camera );
                requestAnimFrame( render ); // set up the next call
            }
            render();
        }
      
    }

});