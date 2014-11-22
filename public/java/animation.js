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
    
    $(dom).mousewheel(
            function(e, delta) {
                that.onDocumentMouseScroll(e, delta);
            }
        );
    
    this.overObject = null;
    this.clickedObject = null;
}

VFX.prototype.onDocumentMouseMove = function(e) {

}

VFX.prototype.onDocumentMouseDown = function(e) {
    console.log('hi');
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


VFX.prototype.Events = function() {}

VFX.prototype.Events.init = function() {
     // Click event listener
    document.addEventListener( 'mousedown', onDocumentMouseDown, true );
    // the actual mousedown function
    function onDocumentMouseDown( event ) {
        console.log("hi");
        event.preventDefault();
        // this is for the starting animation, so the title and the continents coming together to form the planet
        if (show === false){
            //TweenMax.to(scene.children[6].children[0].position, 10, { y: 2000});
            // TweenMax.to(scene.children[6].children[1].position, 10, { y: -2000});
            for (var i = 0; i < continents.length; i++) {
                var time = Math.random()+1+Math.random();
                TweenMax.to(continents[i].scale, time, { x : 1.0, y : 1.0, z : 1.0 });
                show = true
            }
        }
    }
};
