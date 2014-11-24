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
    renderer.shadowMapEnabled = true;
    renderer.sortObjects = false;

    // Create a new Three.js scene
    var scene = new THREE.Scene();
    //scene.add( new THREE.AmbientLight( 0x505050 ) );
    scene.data = this;
    scene.add( new THREE.HemisphereLight( 0xffffff, 0x555555, 0.9 ) );
    scene.fog = new THREE.Fog( 0x111111, 40, 2000 );


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
    this.initCSS();
    this.runCSS();

    //starting animation
    this.renderer.render(this.scene, this.camera);
    for (var i = 0; i < Countries.arr.length; i++) {
        var time = Math.random()+1+Math.random()+1;
        TweenMax.to(Countries.arr[i].scale, time, { x : 1.0, y : 1.0, z : 1.0 });
        TweenMax.to(Countries.arr[i].material, time, { opacity: 1 });
        var rightBar = document.getElementById("rside");
        // var showTroops = document.getElementById("showTroops");
        var about = document.getElementById("about");
        var timer = document.getElementById("timer");
        rightBar.style.right = '0%';
        // showTroops.style.opacity = '0.8';
        about.style.opacity = '1';
        timer.style.opacity = '0.8';
    }

    var geometry  = new THREE.SphereGeometry(7000, 50, 50);
    // create the material, using a texture of startfield
    var material  = new THREE.MeshBasicMaterial({
        fog: false,
        opacity: 1,
         // transparent : true,
        // depthWrite  : false,
    });
    material.map   = THREE.ImageUtils.loadTexture('images/starfield.png');
    material.side  = THREE.BackSide;
    material.wrapS = material.wrapT = THREE.RepeatWrapping;
    // material.repeat.set( 2, 2 )
    // create the mesh based on geometry and material
    var mesh  = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // making cloud layer
    var geometryCloud   = new THREE.SphereGeometry(210, 50, 50)
    var materialCloud  = new THREE.MeshPhongMaterial({
        map     : THREE.ImageUtils.loadTexture('images/fairclouds.jpg'),
      // side        : THREE.DoubleSide,
        wrapAround: true,
        opacity     : 0.8,
        transparent : true,
        depthWrite  : false,

    })
    var cloudMesh = new THREE.Mesh(geometryCloud, materialCloud)
    cloudMesh.castShadow = true;
    scene.add(cloudMesh)

    // making inner sphere layer
    var geometryInner   = new THREE.SphereGeometry(200, 32, 32)
    var materialInner  = new THREE.MeshBasicMaterial({
        // map     : THREE.ImageUtils.loadTexture('images/fairInners.jpg'),
        // wireframe: true,
        color: 0x2194CE,
        transparent: true,
        // depthWrite: false,
    })
    var innerMesh = new THREE.Mesh(geometryInner, materialInner)
    scene.add(innerMesh)


} // end init


VFX.prototype.run = function() {

    this.renderer.render(this.scene, this.camera);
    var that = this;
    // debugger
    // this.scene.children[2].children.rotation.y += 0.001;
    for (var i in this.scene.children[2].children) {
        this.scene.children[2].children[i].rotation.y += 0.001;
    }

    this.scene.children[3].rotation.y += 0.0001;
    this.scene.children[4].rotation.y += 0.0011;
    this.scene.children[5].rotation.y += 0.001;
    // debugger
    // this.scene.children[5].rotation.y += 0.0001;
    // this.scene.children[3].rotation.x += 0.0001;
    // this.scene.children[4].rotation.y += 0.0013;


    requestAnimationFrame(function() { 
        that.run(); 
    });  
}

VFX.prototype.initCSS = function() {
    this.cssScene = new THREE.Scene();
    this.cssRenderer = new THREE.CSS3DRenderer();
    this.container.append(this.cssRenderer.domElement);
    this.renderer.domElement.style.zIndex = 1;
}

VFX.prototype.runCSS = function() {
    this.cssRenderer.render(this.cssScene, camera);
    var that = this;
    requestAnimationFrame(function() {
        that.runCSS();
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
    e.preventDefault();
    var that = this;

    var intersects = this.getIntersects(e, Countries.arr);

    // this is for the animation, not sure if we are going to use it
    if (intersects[ 0 ]) {
        var country = intersects[0].object;
        if (that.activeCountry) {
            TweenMax.to(that.activeCountry.material, 1, { opacity: 1 });
            TweenMax.to(that.activeCountry.scale, 1, { x : 1.0, y : 1.0, z : 1.0 });

            // updateContinentScale(particles, 1.005);
        }

        // updateContinentScale(continent, 1.02);
        TweenMax.to(country.material, 1, { opacity: 0.95 });
        TweenMax.to(country.scale, 1, { x : 1.05, y : 1.05, z : 1.05 });



        that.activeCountry = country; 
        $("#currentcountry").text(country.name + ' GDP: ' + country.gdp);
        $("#troopsInCountry").text('There are ' + country.children.length + ' Troops in ' + country.name);
        // console.log('active: ' + this.activeCountry.name);

        // if (!SELECTED == []) {
        //     // for (var i = 0; i < SELECTED.length; i++) {
        //         console.log(SELECTED)
        //         TweenMax.to(SELECTED.object.geometry.vertices[0],1 , { x: intersects[ 0 ].point.x, y: intersects[ 0 ].point.y , z: intersects[ 0 ].point.z, yoyo:true, ease:Linear.easeNone});

        //         SELECTED = null
        //     // }
        // }
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
