VFX = function() {

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.objects = [];


}

VFX.prototype.init = function () {
    var container = $('#container');

    // Create the Three.js renderer, add it to our div
    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor(new THREE.Color(0x111111));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.append( renderer.domElement );

    // Create a new Three.js scene
    var scene = new THREE.Scene();
    //scene.add( new THREE.AmbientLight( 0x505050 ) );
    scene.data = this;
    scene.add( new THREE.HemisphereLight( 0xffffff, 0x555555, 0.9 ) );


    // Put in a camera at a good default location
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.position.z = 650;

    scene.add(camera);
    
    // Create a root object to contain all other scene objects
    var root = new THREE.Object3D();
    root.scale.set(205,205,205);

    // countries is a collection {name: Mesh object}
    for (var name in Countries) {
        root.add(Countries[name]);
    }
    scene.add(root);

    
    // Create a projector to handle picking
    var projector = new THREE.Projector();

    // here we are fucking with the controls, if you want to change some aspect of controls take a quick peek at the ORbit controls file, it lays out pretty well what you can change.
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 250,
    controls.maxDistance = 650,
    controls.zoomSpeed = 0.3,
    controls.zoomDampingFactor = 0.3,
    controls.momentumDampingFactor = 0.5,
    controls.rotateSpeed = 0.6;

    
    // Save away a few things
    this.container = container;
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.projector = projector;
    this.root = root;
    this.controls = controls;

    this.initMouse();

    //starting animation
    this.renderer.render(this.scene, this.camera);
    for (var i = 0; i < Countries.arr.length; i++) {
        console.log('INSIDE FOR LOOP');
        var time = Math.random()+1+Math.random();
        TweenMax.to(Countries.arr[i].scale, time, { x : 1.0, y : 1.0, z : 1.0 });
    }
} // end init


VFX.prototype.run = function() {

    this.renderer.render(this.scene, this.camera);
    var that = this;

    requestAnimationFrame(function() { 
        that.run(); 
    });  
}

VFX.prototype.initMouse = function() {

    var dom = this.renderer.domElement; 
    var that = this;

    dom.addEventListener('mousemove', function(e) { 
                                        that.onDocumentMouseMove(e); 
                                    }, false);
    dom.addEventListener('mousedown', function(e) { 
                                        that.onDocumentMouseDown(e); 
                                    }, false);
    dom.addEventListener('mouseup', function(e) { 
                                        that.onDocumentMouseUp(e); 
                                    }, false );

    
    this.overObject = null;
    this.clickedObject = null;
    this.intersects = null;
    this.activeCountry = null;
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

VFX.prototype.onDocumentMouseMove = function(e) {

    // not using
    // var intersects = this.getIntersects(e, Countries.arr);
    // if (intersects[ 0 ]) {
    //     INTERSECTED = intersects[ 0 ];
    //     INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

    //     this.container.style.cursor = 'pointer';
    // }  else  {
    //     INTERSECTED = null;

    //     this.container.style.cursor = 'auto';
    // }

}


VFX.prototype.onDocumentMouseDown = function(e) {
    event.preventDefault();

    var intersects = this.getIntersects(e, Countries.arr);

    // this is for the animation, not sure if we are going to use it
    if (intersects[ 0 ]) {
        if (this.activeCountry) {
            TweenMax.to(this.activeCountry.material, 1, { opacity: 1 });
            // updateContinentScale(particles, 1.005);
        }

        var continent = intersects[ 0 ];
        // updateContinentScale(continent, 1.02);
        TweenMax.to(continent.material, 1, { opacity: 0.6 });

        this.activeCountry = continent; 


        if (!SELECTED == []) {
            // for (var i = 0; i < SELECTED.length; i++) {
                console.log(SELECTED)
                TweenMax.to(SELECTED.object.geometry.vertices[0],1 , { x: intersects[ 0 ].point.x, y: intersects[ 0 ].point.y , z: intersects[ 0 ].point.z, yoyo:true, ease:Linear.easeNone});

                SELECTED = null
            // }
        }
    }

}   

VFX.prototype.onDocumentMouseUp = function(e) {

}


VFX.prototype.addObj = function(obj3d) {
    this.root.add(obj3d);
}

VFX.prototype.renderState = function(data) {
    Countries.clearTroops();
    var i = data.length;
    while (i--) {
        var player = data[i];
        var troops = player.troops;
        for (var country in troops) {
            var n = troops[country]; // number of troops
            country = Countries[country]; // Mesh object for the country
            country.addTroops(player.id, n);
        }
    }
}
