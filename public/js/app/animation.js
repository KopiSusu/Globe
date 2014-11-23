/* To add a new layer to the animation:
** 1. create a new file in app/layers
** 2. edit app/layers/config.js to include your new file
** New layer should be added automatically to the animation */

define(['three', 'jquery', 'TweenMax', './layers/config', 'orbitcontrols', './layers/continents', 'CSS3DRenderer'], function (THREE, $, TweenMax, layers, OrbitControls, continentControls, CSS3DRenderer) {

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
        cssScene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                  ASPECT,
                                  NEAR,
                                  FAR  );
    var rendererCSS = new THREE.CSS3DRenderer();
    document.body.appendChild( rendererCSS.domElement );
    // rendererCSS.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.zIndex = 1;


    // here we are fucking with the controls, if you want to change some aspect of controls take a quick peek at the ORbit controls file, it lays out pretty well what you can change.
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.minDistance = 250,
        controls.maxDistance = 650,
        controls.zoomSpeed = 0.3,
        controls.zoomDampingFactor = 0.3,
        controls.momentumDampingFactor = 0.5,
        controls.rotateSpeed = 0.6;

        scene.fog = new THREE.Fog( 0x111111, 40, 2000 );
        // scene.enableDomEvent();

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
        SELECTED = null;

///////////////////////////////////////////////////////////////////////////////////////
    // this is the new stuff for sprites

    // this is the function that creates the sprite
    function makeTextSprite( message, parameters )
    {
        if ( parameters === undefined ) parameters = {};
        
        var fontface = parameters.hasOwnProperty("fontface") ? 
            parameters["fontface"] : "Arial";
        
        var fontsize = parameters.hasOwnProperty("fontsize") ? 
            parameters["fontsize"] : 18;
        
        var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
            parameters["borderThickness"] : 1;
        
        var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
        
        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

        // var spriteAlignment = THREE.SpriteAlignment.topLeft;
            
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;
        
        // get size data (height depends only on font size)
        var metrics = context.measureText( message );
        var textWidth = metrics.width;
        
        // background color
        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                                      + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                                      + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q.
        
        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText( message, borderThickness, fontsize + borderThickness);
        
        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas) 
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial( 
            { map: texture, useScreenCoordinates: false } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(100,50,1.0);
        return sprite;  
    }

    // This draws the sprite
    function roundRect(ctx, x, y, w, h, r) 
    {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.lineTo(x+w-r, y);
        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r);
        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h);
        ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r);
        ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();   
    }

///////////////////////////////////////////////////////////////////////////////////////


    // seperate the countinents, this is solely used for the introduction animation
    seperate();
    function seperate () {
        for (var i = 0; i < 242; i++) {
            continents.push(layers.continents.getGeometryByIndex(i))
        }
    }

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
                    TweenMax.to(SELECTED.object.geometry.vertices[0],1 , { x: intersects[ 0 ].point.x, y: intersects[ 0 ].point.y , z: intersects[ 0 ].point.z, yoyo:true, ease:Linear.easeNone});
                    // debugger
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

    function labelCountries() {
                var projector = new THREE.Projector();
                var pos = projector.projectVector(earth.position.clone(), camera);
                label.style.top = '' + (heightHalf - heightHalf * pos.y ) + 'px';
                label.style.left = '' + (widthHalf * pos.x + widthHalf) + 'px';    
            }

    var troopsAdded = false

    var renderTroopsInCountry = function(numTroops, country) {

        // this is creating the particle
        if (troopsAdded == false) {
            // var planeMaterial   = new THREE.MeshBasicMaterial({color: 0xfafafa, opacity: 0.1, side: THREE.DoubleSide, wireframe: true });
            // var planeWidth = 100;
            // var planeHeight = 100;
            // var planeGeometry = new THREE.PlaneGeometry( planeWidth, planeHeight );
            // var planeMesh= new THREE.Mesh( planeGeometry, planeMaterial );

            // add it to the standard (WebGL) scene

            ///////// 
            //   var label = document.createElement('div');
            //   label.textContent = 'Earth';
            //   label.style.backgroundColor = 'white';
            //   label.style.position = 'absolute';
            //   label.style.padding = '1px 4px';
            //   label.style.borderRadius = '2px';
              
            //   document.body.appendChild(label);

            // ////////
            geometry = new THREE.Geometry();

/////////////////////////////////////////////////////////////////
// more new stuff
             // this is making the custom sprite 
             //  so it works like makeTextSprite ( your text you want it to print, {parameters})
            sprite = makeTextSprite( ' Your troops in ' + country.geometry.name + ' :' + numTroops + ' ', { 
                fontsize: 10, 
                borderThickness: 1,
                // borderColor: Math.random() * 0x555555, 
                // backgroundColor: Math.random() * 0x555555
            } );
//////////////////////////////////////////////////////////////////

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
            // debugger

/////////////////////////////////////////////////////////
// setting up sprite position
            sprite.position.x = position.x
            sprite.position.y = position.y
            sprite.position.z = position.z
/////////////////////////////////////////////////////////

            // var projector = new THREE.Projector();
            // var pos = projector.projectVector(sprite.position.clone(), camera);

            // label.style.top = '' + ( position.y ) + 'px';
            // label.style.left = '' + ( position.x ) + 'px';  

            // planeMesh.position.y = position.y 
            // planeMesh.position.x = position.x
            // planeMesh.position.z = position.z

            material = new THREE.PointCloudMaterial( { 
                size: 1, 
                // program: function(context) {
                //     // context.font = "5pt Helvetica";
                //     context.fillText("Hello World", 0, 0);
                //   },
                // // sizeAttenuation: false, 
                transparent: true,
                opacity: 0
                // color: Math.random() * 0x555555, 
            });

            particles = new THREE.PointCloud( geometry, material );

//////////////////////////////////////////////////////////////////////////////////
            // adding sprite to the particle
            // you can also just add it directly to the scene im pretty sure
            particles.add(sprite);
/////////////////////////////////////////////////////////////////////////////////

            particles.position.x = Math.random() * 2 - 1;
            particles.position.y = Math.random() * 2 - 1;
            particles.position.z = Math.random() * 2 - 1;
            particles.position.normalize();

            particles.sortParticles = true;
            updateContinentScale(particles, 1.1);

            // another try for dom elements
            // var number = document.createElement( 'div' );
            // number.className = 'number';
            // number.textContent = "THREE.JS";
            // object = new THREE.CSS3DObject( number );
            // object.position.y = position.y 
            // object.position.x = position.x
            // object.position.z = position.z

            // more attmpts
            // var element = document.createElement( 'img' );
            // element.src = 'http://media.npr.org/images/picture-show-flickr-promo.jpg';
            // // create the object3d for this element
            // var cssObject = new THREE.CSS3DObject( element );
            // // we reference the same position and rotation 
            // cssObject.position.y = position.y;
            // cssObject.position.x = position.x;
            // cssObject.position.z = position.z;
            // // cssObject.rotation = planeMesh.rotation;
            // // add it to the css scene
            // cssScene.add(cssObject);

            // debugger;

            country.add( particles );
            // scene.add(planeMesh);
            // debugger;
            scene.add(country.children[0]); 
            // debugger;

            seperateParticles(); 
            // particles.parent = country;
            // country.update; 
            // debugger

            troopsAdded = true;
        }
        // if (troopsAdded == false) {
        //     // geometry = new THREE.Geometry();
        //     geometry = new THREE.PlaneGeometry();

        //     sprite = THREE.ImageUtils.loadTexture( "images/particle.png" );

        //     var vertex = new THREE.Vector3();

        //     var geom = country.geometry;
        //     geom.centroid = new THREE.Vector3();
        //     var A = 0;

        //     for (var i = 0, l = geom.vertices.length; i < l; i++) {
        //         geom.centroid.add(geom.vertices[i]);
        //     }

        //     geom.centroid.divideScalar(geom.vertices.length);
        //     geom.centroid.divideScalar(Math.sqrt(Math.pow(geom.centroid.x, 2) +
        //                                 Math.pow(geom.centroid.y, 2) +
        //                                 Math.pow(geom.centroid.z, 2)));
        //     var position = geom.centroid;
        //     position.applyMatrix4( country.matrixWorld );

        //     vertex.x = (position.x);
        //     vertex.y = (position.y);
        //     vertex.z = (position.z);

        //     geometry.vertices.push( vertex );

        //     // material = new THREE.PointCloudMaterial( { 
        //     //     size: 5, 
        //     //     // sizeAttenuation: false, 
        //     //     color: Math.random() * 0x555555, 
        //     // });

        //     var material = new THREE.MeshBasicMaterial({
        //         wireframe: true,
        //         color: Math.random() * 0x555555 
        //     });

        //     // particles = new THREE.PointCloud( geometry, material );
        //     particles = new THREE.Mesh( geometry, material );

        //     particles.position.x = Math.random() * 2 - 1;
        //     particles.position.y = Math.random() * 2 - 1;
        //     particles.position.z = Math.random() * 2 - 1;
        //     particles.position.normalize();

        //     particles.sortParticles = true;
        //     updateContinentScale(particles, 1.005);

        //     // country.add( particles );
        //     // debugger;
        //     // scene.add(country.children[0]); 
        //     // debugger;
        //     scene.add( particles );
        //     debugger

        //     seperateParticles(); 
        //     // particles.parent = country;
        //     // country.update; 
        //     // debugger
        //     troopsAdded = true;
        // }
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
                                  from: currentcountry, 
                                  to: move.to
                                }));

    }


    /** object definition **/
    /* everything inside return{} is available to outside 
        e.g. animation.scene, animation.create, etc */
    return {

        scene: scene,
        cssScene: cssScene,
        camera: camera,
        renderer: renderer,
        rendererCSS: rendererCSS,

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
                rendererCSS.render(cssScene, camera);
                requestAnimFrame( render ); // set up the next call
            }
            render();
        }
      
    }

});