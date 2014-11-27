VFX = function() {

    this.renderer = null;
    this.scene = null;
    this.camera = null;

}

VFX.prototype.init = function () {
    var container = $('#scene');

    // Create the Three.js renderer, add it to our div
    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor(new THREE.Color(0x111111));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.append( renderer.domElement );
    renderer.shadowMapEnabled = true;
    renderer.sortObjects = false;

    // Create a new Three.js scene
    var scene = new THREE.Scene();
    scene.data = this;
    scene.add( new THREE.HemisphereLight( 0xffffff, 0x555555, 0.9 ) );

    var directionalLight = new THREE.DirectionalLight(0xfafafa,  0.6);
    directionalLight.position.set(20, 20, 5).normalize();

    scene.fog = new THREE.Fog( 0x111111, 40, 2000 );


    // Put in a camera at a good default location
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.position.z = 750;
    camera.add(directionalLight);
    scene.add(camera);

    // here we are fucking with the controls, if you want to change some aspect of controls take a quick peek at the ORbit controls file, it lays out pretty well what you can change.
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 250,
    controls.maxDistance = 750,
    controls.zoomSpeed = 0.3,
    controls.zoomDampingFactor = 0.3,
    controls.momentumDampingFactor = 0.5,
    controls.rotateSpeed = 0.6;

    
    // making cloud layer
    var geometryCloud   = new THREE.SphereGeometry(207, 50, 50)
    var materialCloud  = new THREE.MeshPhongMaterial({
        map     : THREE.ImageUtils.loadTexture('images/fairclouds.jpg'),
      side        : THREE.DoubleSide,
        wrapAround: true,
        opacity     : 0.6,
        transparent : true,
        depthWrite  : false,

    })
    var cloudMesh = new THREE.Mesh(geometryCloud, materialCloud)
    cloudMesh.castShadow = true;
    scene.add(cloudMesh)

    // creating starfield
    var geometry  = new THREE.SphereGeometry(7000, 50, 50);
    var material  = new THREE.MeshBasicMaterial({
        fog: false,
        opacity: 0.5,
         transparent : true,
        depthWrite  : false,
    });
    material.map   = THREE.ImageUtils.loadTexture('images/starfield.png');
    material.side  = THREE.BackSide;
    material.wrapS = material.wrapT = THREE.RepeatWrapping;
    var mesh  = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // making inner sphere layer
    var geometryInner   = new THREE.SphereGeometry(202, 32, 32)
    var materialInner  = new THREE.MeshBasicMaterial({
        color: 0x00688B,
        transparent: true,
    })
    var innerMesh = new THREE.Mesh(geometryInner, materialInner)
    innerMesh.receiveShadow = false;
    innerMesh.castShadow = true;
    scene.add(innerMesh)

    // here we are making the moon
    // lets make the invisiable sphere first
    var invisSphere = new THREE.Mesh(new THREE.SphereGeometry(300, 10, 10), new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0x111111,
        opacity: 0.1,
        depthWrite  : false,
    }));
    var moonMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('images/moonmap4k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture('images/moonbump4k.jpg'),
        bumpScale: 0.05
    });
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 32), moonMaterial);
      sphere.overdraw = true;
      sphere.position.x = -300;
      invisSphere.add(sphere);
      scene.add(invisSphere);

    // Create a root object to contain all contry objects
    var root = new THREE.Object3D();
    root.scale.set(205,205,205);

    // adding countries
    // countries is a collection {name: Mesh object}
    for (var name in Countries) {
        if(Countries.hasOwnProperty(name) && Countries[name].geometry) {
            root.add(Countries[name]);
        }
    }

    scene.add(root);

    // Create a projector to handle picking
    var projector = new THREE.Projector();

    
    // Save away a few things
    this.container = container;
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.projector = projector;
    this.root = root;
    this.controls = controls;

    this.initMouse();

    this.renderer.render(this.scene, this.camera);

    //starting animation when page is first loaded

    Object.keys(Countries).forEach(function (key) { 
        if(Countries[key].scale && Countries[key].material)
        {
            var time = Math.random()+1+Math.random()+1;
            TweenMax.to(Countries[key].scale, time, { x : 1.0, y : 1.0, z : 1.0 });
            TweenMax.to(Countries[key].material, time, { opacity: 1 });    
        }
    });

    // starting animation for DOM elements
    var rightBar = document.getElementById("right");
    var timer = document.getElementById("timer");
    var top = document.getElementById("systemTop");
    var bottom = document.getElementById("systemBottom");
    rightBar.style.right = '50px';
    timer.style.opacity = '0.8';
    top.style.opacity = '1';
    bottom.style.opacity = '1';
    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(   window.innerWidth, window.innerHeight);

}

}



VFX.prototype.run = function() {

    this.renderer.render(this.scene, this.camera);

    var that = this;
    this.scene.children[2].rotation.y += 0.0005; // cloud layer
    this.scene.children[3].rotation.y += 0.0002; // star field
    this.scene.children[5].rotation.y += 0.0003; // moon
    // debugger


    ////// this is some camera rotation, id like to add this if the user hasnt moveed in awhile, 
    ////// kinda like a screen saver. 
    // this.scene.children[1].rotation.y += rotation;

    // if (this.scene.children[1].rotation.y < -0.2) {
    //     rotation = 0.0001;
    // }

    // if (this.scene.children[1].rotation.y > 0.2) {
    //     rotation = -0.0001;
    // }

    // console.log('this is rotation = ' + rotation)
    // console.log('this is this.scene.children[1].rotation.y = ' + this.scene.children[1].rotation.y)


    requestAnimationFrame(function() { 
        that.run(); 
    });  
}


VFX.prototype.initMouse = function() {

    var dom = this.renderer.domElement; 
    var that = this;

    dom.addEventListener('mousedown', function(e) { 
                                        that.onDocumentMouseDown(e); 
                                    }, false);

    
    this.overObject = null;
    this.clickedObject = null;
    this.targetCountry = null;
}

VFX.prototype.getIntersects = function(e, objs) {
// this is setting up the ray cast, so how this works is it sends a invisible beam out from the camera to where you are clicking, and stores any object it encounters in INTERSCECTS
    var vector = new THREE.Vector3();
    vector.set( ( e.clientX / window.innerWidth ) * 2 - 1, - ( e.clientY / window.innerHeight ) * 2 + 1, 0.5 );
    vector.unproject( camera );

    var raycaster = new THREE.Raycaster();
    raycaster.ray.set( this.camera.position, vector.sub( this.camera.position ).normalize() );

    return raycaster.intersectObjects(objs);
}



VFX.prototype.onDocumentMouseDown = function(e) {

    var intersects = this.getIntersects(e, Countries.inPlay);

    if (intersects[ 0 ]) {
        var country = intersects[0].object;
        Game.handleClick(country.name);
    }
} 

VFX.prototype.deactivate = function(name) {

    if (name) {
        var country = Countries[name];
        TweenMax.to(country.material, 1, { opacity: 1 });
        TweenMax.to(country.scale, 1, { x : 1.0, y : 1.0, z : 1.0 });
    }
    
    if (this.targetCountry != name) {
        name = this.targetCountry;
        this.targetCountry = null;
        this.deactivate(name);
    }
}

VFX.prototype.activate = function(name) {
    var country = Countries[name];
    TweenMax.to(country.material, 1, { opacity: 0.95 });
    TweenMax.to(country.scale, 1, { x : 1.05, y : 1.05, z : 1.05 });
}

VFX.prototype.target = function(name) {
    if (this.targetCountry) {
        this.deactivate(this.targetCountry);
    }

    this.activate(name);
    this.targetCountry = name;
}

VFX.prototype.moveUnits = function(previousCountry, newCountry) {

    var material = new THREE.LineBasicMaterial({
        color: 0xfafafa
    });
    var geometry = new THREE.Geometry();

    // note! line is drawn between each consecutive pair of verticies
    geometry.vertices.push(Countries[previousCountry].geometry.getCentroid(Countries[previousCountry]));
    geometry.vertices.push(Countries[newCountry].geometry.getCentroid(Countries[newCountry]));
    geometry.verticesNeedUpdate = true;

    // now we draw the line
    var line = new THREE.Line(geometry, material);
    this.scene.add(line);
    console.log("Line: ", line);
}


VFX.prototype.addObj = function(obj3d) {
    this.root.add(obj3d);
}


// NEEDS WORK. still using old state.
VFX.prototype.renderState = function(data) {
//    Countries.clearTroops();
    var i = data.length;
    while (i--) {
        var player = data[i];
        var troops = player.troops;
        for (var country in troops) {
            var n = troops[country]; // number of troops
            country = Countries[country]; // Mesh object for the country
            if (io.socket.player.id == player.id) {
                country.material.setHex(0xff0000);
            }
            country.addTroops(player.id, n);
        }
    }
}
