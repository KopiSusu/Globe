VFX = function() {

    this.renderer = null;
    this.scene = null;
    this.camera = null;

}

$(document).ready(function(){
    $('div.targetCountry > .myArmy').blur(function(){
        var oldVal = parseInt($(this).attr('data-orig-value'));
        var val = parseInt($(this).html());
        var changeNumber = parseInt($('div.activeCountry > .myArmy').html());
        var newNum = val - oldVal;
            changeNumber -= newNum;
        if (changeNumber < 0) {
            console.log('You have run out of troops')
            $('div.targetCountry > .myArmy').html(oldVal);
        }
        if (changeNumber > 0 ) {
            $('div.activeCountry > .myArmy').text(changeNumber);
            var oldVal = $(this).attr('data-orig-value', val);

            var from = $('div.activeCountry').attr('data-name');
            var to = $('div.activeCountry').attr('data-name');
            Game.moveTroops(io.socket.playerid, from, to, newNum)
        }
    })

    // $('standingArmies .army').on('click', function() {

    // })
})

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

    var directionalLight = new THREE.DirectionalLight(0xfafafa,  0.6);
    directionalLight.position.set(20, 20, 5).normalize();

    scene.fog = new THREE.Fog( 0x111111, 40, 2000 );


    // Put in a camera at a good default location
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.position.z = 650;
    camera.add(directionalLight);
    scene.add(camera);
    


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

    // making star field
    var geometry  = new THREE.SphereGeometry(7000, 50, 50);
    // create the material, using a texture of startfield
    var material  = new THREE.MeshBasicMaterial({
        fog: false,
        opacity: 0.5,
         transparent : true,
        depthWrite  : false,
    });
    material.map   = THREE.ImageUtils.loadTexture('images/starfield.png');
    material.side  = THREE.BackSide;
    material.wrapS = material.wrapT = THREE.RepeatWrapping;
    // material.repeat.set( 2, 2 )
    // create the mesh based on geometry and material
    var mesh  = new THREE.Mesh(geometry, material);
    mesh.rotation.y += 1;
    scene.add(mesh);

    // making inner sphere layer
    var geometryInner   = new THREE.SphereGeometry(202, 32, 32)
    var materialInner  = new THREE.MeshBasicMaterial({
        // map     : THREE.ImageUtils.loadTexture('images/fairInners.jpg'),
        // wireframe: true,
        color: 0x00688B,
        transparent: true,
        // depthWrite: false,
    })
    var innerMesh = new THREE.Mesh(geometryInner, materialInner)
    scene.add(innerMesh)

    // Create a root object to contain all other scene objects
    var root = new THREE.Object3D();
    root.scale.set(205,205,205);

    // adding countries
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

    //starting animation when page is first loaded
    this.renderer.render(this.scene, this.camera);
    for (var i = 0; i < Countries.arr.length; i++) {
        var time = Math.random()+1+Math.random()+1;
        TweenMax.to(Countries.arr[i].scale, time, { x : 1.0, y : 1.0, z : 1.0 });
        TweenMax.to(Countries.arr[i].material, time, { opacity: 1 });
        var rightBar = document.getElementById("rside");
        // var showTroops = document.getElementById("showTroops");
        var about = document.getElementById("about");
        var timer = document.getElementById("timer");
        var top = document.getElementById("systemTop");
        var bottom = document.getElementById("systemBottom");
        rightBar.style.right = '0%';
        // showTroops.style.opacity = '0.8';
        about.style.opacity = '1';
        timer.style.opacity = '0.8';
        top.style.opacity = '1';
        bottom.style.opacity = '1';
    }

    // making inner sphere layer
    var geometryInner   = new THREE.SphereGeometry(202, 32, 32)
    var materialInner  = new THREE.MeshBasicMaterial({
        color: 0x00688B,
        transparent: true,
    })
    var innerMesh = new THREE.Mesh(geometryInner, materialInner)
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


      // debugger;

} // end init

// var rotation = -0.0001;
VFX.prototype.run = function() {

    this.renderer.render(this.scene, this.camera);

    var that = this;
    this.scene.children[2].rotation.y += 0.0005; // cloud layer
    this.scene.children[3].rotation.y += 0.0001; // star field
    this.scene.children[6].rotation.y += 0.0005; // moon


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
    this.activeCountry = null;
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
    e.preventDefault();

    var intersects = this.getIntersects(e, Countries.inPlay);

    // this is for the animation, not sure if we are going to use it
    if (intersects[ 0 ]) {
        var country = intersects[0].object;
        console.log('got click from vfx! handling click');
        Game.handleClick(country.name);
    }
} 

VFX.prototype.deactivate = function(name) {
    console.log('inside vfx activate');
    var country = Countries[name];
    TweenMax.to(country.material, 1, { opacity: 1 });
    TweenMax.to(country.scale, 1, { x : 1.0, y : 1.0, z : 1.0 });
}

VFX.prototype.activate = function(name) {
    console.log('inside vfx deactive');
    var country = Countries[name];
    TweenMax.to(country.material, 1, { opacity: 0.95 });
    TweenMax.to(country.scale, 1, { x : 1.1, y : 1.1, z : 1.1 });
}



VFX.prototype.moveUnits = function(previousCountry, newCountry) {
    var material = new THREE.LineBasicMaterial({
        color: 0xfafafa
    });
    var geometry = new THREE.Geometry();

    // note! line is drawn between each consecutive pair of verticies
    geometry.vertices.push(previousCountry);
    geometry.vertices.push(newCountry);

    // now we draw the line
    var line = new THREE.Line(geometry, material);
    scene.add(line);
}


VFX.prototype.addObj = function(obj3d) {
    this.root.add(obj3d);
}


// NEEDS WORK. still using old state.
VFX.prototype.renderState = function(data) {
    Countries.clearTroops();
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
