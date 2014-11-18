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

    // 

    // Click event listener
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    // generating required variables for the click function
    var projector = new THREE.Projector(),
        raycaster = new THREE.Raycaster(),
        continents = []

    // seperate the countinents, this is solely used for the introduction animation
    seperate();
    function seperate () {
        for (var i = 0; i < 242; i++) {
            continents.push(layers.continents.getGeometryByIndex(i))
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

        // this is for the animation, not sure if we are going to use it
        if (intersects[ 0 ]) {
            if (activeCountry) {
                // reset country scale
                // updateContinentScale(activeCountry, 1.0);
                TweenMax.to(activeCountry.material, 1, { opacity: 1 });
                // debugger
                updateContinentScale(particles, 1.005);
            }
        }

        // this is performing some operations on the actual clicked object, so we are changing the activeCountry to the currently selected country, and we are also adding a particle to the country
        if (intersects[ 0 ]) {
            var continent = intersects[ 0 ].object;
            // updateContinentScale(continent, 1.02);
            TweenMax.to(continent.material, 1, { opacity: 0.8 });

            activeCountry = continent; 

            // this is creating the particle
            geometry = new THREE.Geometry();

            sprite = THREE.ImageUtils.loadTexture( "images/particle.png" );

            for ( i = 0; i < 1; i ++ ) {

                var vertex = new THREE.Vector3();
                vertex.x = intersects[ 0 ].point.x;
                vertex.y = intersects[ 0 ].point.y;
                vertex.z = (intersects[ 0 ].point.z);

                geometry.vertices.push( vertex );

            }

            material = new THREE.PointCloudMaterial( { 
                size: 5, 
                sizeAttenuation: false, 
                color: Math.random() * 0x555555, 
                // transparent: true 
            });

            particles = new THREE.PointCloud( geometry, material );
            particles.sortParticles = true;
            activeCountry.children.push( particles);
            // activeCountry.add( particles );
            scene.add(activeCountry.children[0])
            // updateContinentScale(particles, 1.005);
            updateContinentScale(particles, 1.025);
        }         
    }

    function renderTroops(players) {

        var i = players.length - 1;
        while (i--) {
            var armies = players[i].troops;

            for (var country in armies) {

                // armies['Canada'] = 15
                var numTroops = armies[country];
                // debugger
                // TODO
                // this looks like
                // renderTroopsInCountry(15, 'Canada')
                renderTroopsInCountry(numTroops, country);
            }
        }
    }

    // debugger

    var renderTroopsInCountry = function(int, country) {
        var country = continentControls.getGeometryByName(country)
        // debugger
        // console.log(country.name)
            // this is creating the particle
            // geometry = new THREE.Geometry();

            // sprite = THREE.ImageUtils.loadTexture( "images/particle.png" );

            // debugger


            // for ( i = 0; i < 1; i ++ ) {
            //                 // debugger
            //     var vertex = new THREE.Vector3();
            //     // console.log(country.geometry.vertices[0].x)
            //     vertex.x = (country.geometry.vertices[0].x);
            //     vertex.y = (country.geometry.vertices[0].y);
            //     vertex.z = (country.geometry.vertices[0].z);

            //     geometry.vertices.push( vertex );


            // }

            // material = new THREE.PointCloudMaterial( { 
            //     size: 5, 
            //     sizeAttenuation: false, 
            //     color: Math.random() * 0x555555, 
            //     // transparent: true 
            // });

            // particles = new THREE.PointCloud( geometry, material );

            // for ( i = 0; i < 1; i ++ ) {

            //     particles.position.x = (country.geometry.vertices[0].x)+1;
            //     particles.position.y = (country.geometry.vertices[0].y)+1;
            //     particles.position.z = (country.geometry.vertices[0].z)+1;
            // }

            // particles.sortParticles = true;
            // country.children.push( particles);
            // // debugger
            // // activeCountry.add( particles );
            // scene.add(country.children[0])
            
    }

    // timer
    // var resetCounter = function () {
    //     counter = 5;
    // }
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