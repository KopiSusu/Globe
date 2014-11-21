/* To add a new layer to the animation:
** 1. create a new file in app/layers
** 2. edit app/layers/config.js to include your new file
** New layer should be added automatically to the animation */

define(['three', 'jquery', 'TweenMax', './layers/config', 'orbitcontrols', './layers/continents'], function (THREE, $, TweenMax, layers, OrbitControls, continentControls) {

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

    // here we are fucking with the controls, if you want to change some aspect of controls take a quick peek at the ORbit controls file, it lays out pretty well what you can change.
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.minDistance = 250,
        controls.maxDistance = 650,
        controls.zoomSpeed = 0.3,
        controls.zoomDampingFactor = 0.3,
        controls.momentumDampingFactor = 0.5,
        controls.rotateSpeed = 0.6;

        scene.fog = new THREE.Fog( 0x111111, 40, 2000 );

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
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );

    // generating required variables for the click function
    var projector = new THREE.Projector(),
        raycaster = new THREE.Raycaster(),
        continents = [],
        troops = [],
        SELECTED = null,
        troopsInCountry = [];

    // seperate the countinents, this is solely used for the introduction animation
    seperate();
    function seperate () {
        for (var i = 0; i < 242; i++) {
            continents.push(layers.continents.getGeometryByIndex(i))
        }
    }

    // addTroops();
    // function addTroops () {
    //     // if (!continents === []) {
    //         for (var l = 0; l < continents.length; l++ ) {
    //             continents[l].add(troopsInCountry);
    //             console.log(continents[l]);
    //         }
    //     // }
    // }

    function seperateParticles () {
        for (var i = 7; i < scene.children.length; i++) {
            troops.push(scene.children[i])
        }
    }

    function onDocumentMouseMove( event ) {

                var vector = new THREE.Vector3();
                vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
                vector.unproject( camera );

                raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );

                var intersects = raycaster.intersectObjects( troops );

                if (intersects[ 0 ]) {
                    INTERSECTED = intersects[ 0 ].object;
                    INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

                    container.style.cursor = 'pointer';
                }  else  {

                    if ( !intersects[ 0 ] ) {

                    INTERSECTED = null;

                    container.style.cursor = 'auto';
                    }

                }

            }


    // think of this as active user, active country changes depending on what country you are clicking on
    var activeCountry = null;


    // to be honest i forgot what this is doing specifically, but its essential...
    var clickedOnContinent = function(){
        return intersects.length > 0;
    }


    // this is the function for raising the countinent up when its selected
    var updateContinentScale = function(country, scale) {
        TweenMax.to(country.scale, 0.7, { x : scale, y : scale, z : scale });
    }

    var show = false

    // the actual mousedown function
    function onDocumentMouseDown( event ) {

        event.preventDefault();
        // this is for the starting animation, so the title and the continents coming together to form the planet
        if (show === false){
            TweenMax.to(scene.children[6].children[0].position, 10, { y: 2000});
            // TweenMax.to(scene.children[6].children[1].position, 10, { y: -2000});
            for (var i = 0; i < continents.length; i++) {
                var time = Math.random()+1+Math.random();
                TweenMax.to(continents[i].scale, time, { x : 1.0, y : 1.0, z : 1.0 });
                show = true
            }
        }

        // this is setting up the ray cast, so how this works is it sends a invisible beam out from the camera to where you are clicking, and stores any object it encounters in INTERSCECTS
        var vector = new THREE.Vector3();
        vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
        vector.unproject( camera );

        raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( continents );
        var intersectsParticles = raycaster.intersectObjects( troops );
        // console.log(intersectsParticles[0]);
   

        // this is for the animation, not sure if we are going to use it
        if (intersects[ 0 ]) {
            if (activeCountry) {
                TweenMax.to(activeCountry.material, 1, { opacity: 1 });
                // updateContinentScale(particles, 1.005);
            }

            var continent = intersects[ 0 ].object;
            // updateContinentScale(continent, 1.02);
            TweenMax.to(continent.material, 1, { opacity: 0.6 });

            activeCountry = continent; 


            if (!SELECTED == []) {
                // for (var i = 0; i < SELECTED.length; i++) {
                    console.log(SELECTED)
                    TweenMax.to(SELECTED.object.geometry.vertices[0],1 , { x: intersects[ 0 ].point.x, y: intersects[ 0 ].point.y , z: intersects[ 0 ].point.z, yoyo:true, ease:Linear.easeNone});

                    SELECTED = null
                // }
            }

            if (intersectsParticles[0]) {
                // controls.enabled = false;

                SELECTED = intersectsParticles[ 0 ];

                container.style.cursor = 'move';
            }
        }
         

    }

    function onDocumentMouseUp( event ) {

                event.preventDefault();

                controls.enabled = true;

                container.style.cursor = 'auto';

            }

    function renderTroops(players) {
        for (var i = 0; i < players.length; i++) {
            var armies = players[0].troops;

            for (var country in armies) {
                // armies['Canada'] = 15
                var numTroops = armies[country];
                // this looks like
                var country = continentControls.getGeometryByName(country);
                    country.children = [];
                // renderTroopsInCountry(15, 'Canada')
                renderTroopsInCountry(numTroops, country);
            }
        }
    }

    var troopsAdded = false

    var renderTroopsInCountry = function(numTroops, country) {

        // this is creating the particle
        if (troopsAdded == false) {
            geometry = new THREE.Geometry();

            sprite = THREE.ImageUtils.loadTexture( "images/particle.png" );

            var vertex = new THREE.Vector3();

            var geom = country.geometry;
            geom.centroid = new THREE.Vector3();
            var A = 0;

            for (var i = 0, l = geom.vertices.length; i < l; i++) {
                geom.centroid.add(geom.vertices[i]);
            }

            geom.centroid.divideScalar(geom.vertices.length);
            geom.centroid.divideScalar(Math.sqrt(Math.pow(geom.centroid.x, 2) +
                                        Math.pow(geom.centroid.y, 2) +
                                        Math.pow(geom.centroid.z, 2)));
            var position = geom.centroid;
            position.applyMatrix4( country.matrixWorld );

            vertex.x = (position.x);
            vertex.y = (position.y);
            vertex.z = (position.z);

            geometry.vertices.push( vertex );

            material = new THREE.PointCloudMaterial( { 
                size: 5, 
                // sizeAttenuation: false, 
                color: Math.random() * 0x555555, 
            });

            particles = new THREE.PointCloud( geometry, material );

            particles.position.x = Math.random() * 2 - 1;
            particles.position.y = Math.random() * 2 - 1;
            particles.position.z = Math.random() * 2 - 1;
            particles.position.normalize();

            particles.sortParticles = true;
            updateContinentScale(particles, 1.005);
            country.add( particles );
            // debugger;
            scene.add(country.children[0]); 

            seperateParticles();  
            troopsAdded = true;
        }
    }

    // timer
    var timer;

    function countDown(counter) {
        clearInterval(timer);
        $('#timer').text(counter);
        timer = setInterval(triggerCountDown, 1000)
    };

    function triggerCountDown() {
        var n = $('#timer').text();
        if (n > 0) {
            n--;
            $('#timer').text(n);
        }
    }

    var sendData = function () {
        ('move', JSON.stringify({
                                  playerid: socket.playerid, 
                                  num: 1, 
                                  from: move.from, 
                                  to: move.to
                                }));

    }


    /** object definition **/
    /* everything inside return{} is available to outside 
        e.g. animation.scene, animation.create, etc */
    return {

        scene: scene,
        camera: camera,
        renderer: renderer,

        startTimer: countDown,
        renderTroops: renderTroops,


        // attach renderer to DOM container 
        create: function() {

            // get the DOM element to attach to
            // - assume we've got jQuery to hand
            var container = $('#container');

            // the camera starts at 0,0,0 so pull it back
            camera.position.z = 650;

            // start the renderer - set the clear colour
            // to a full black
            renderer.setClearColor(new THREE.Color(0x111111));
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

                // adding some rotation 
                scene.children[0].rotation.y += 0.002;
                scene.children[1].rotation.y = 3.5;
                scene.children[4].rotation.y += 0.002;
                scene.children[3].rotation.y += 0.002;
                scene.children[6].rotation.y += 0.001;

                scene.updateMatrixWorld();
                // seperate();

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