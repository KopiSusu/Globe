Sim = {};

// Sim.Publisher - base class for event publishers
Sim.Publisher = function() {
    this.messageTypes = {};
}

Sim.Publisher.prototype.subscribe = function(message, subscriber, callback) {
    var subscribers = this.messageTypes[message];
    if (subscribers)
    {
        if (this.findSubscriber(subscribers, subscriber) != -1)
        {
            return;
        }
    }
    else
    {
        subscribers = [];
        this.messageTypes[message] = subscribers;
    }

    subscribers.push({ subscriber : subscriber, callback : callback });
}

Sim.Publisher.prototype.unsubscribe =  function(message, subscriber, callback) {
    if (subscriber)
    {
        var subscribers = this.messageTypes[message];

        if (subscribers)
        {
            var i = this.findSubscriber(subscribers, subscriber, callback);
            if (i != -1)
            {
                this.messageTypes[message].splice(i, 1);
            }
        }
    }
    else
    {
        delete this.messageTypes[message];
    }
}

Sim.Publisher.prototype.publish = function(message) {
    var subscribers = this.messageTypes[message];

    if (subscribers)
    {
        for (var i = 0; i < subscribers.length; i++)
        {
            var args = [];
            for (var j = 0; j < arguments.length - 1; j++)
            {
                args.push(arguments[j + 1]);
            }
            subscribers[i].callback.apply(subscribers[i].subscriber, args);
        }
    }
}

Sim.Publisher.prototype.findSubscriber = function (subscribers, subscriber) {
    for (var i = 0; i < subscribers.length; i++)
    {
        if (subscribers[i] == subscriber)
        {
            return i;
        }
    }
    
    return -1;
}


// Sim.App - application class (singleton)
Sim.App = function()
{
  Sim.Publisher.call(this);
  
  this.renderer = null;
  this.scene = null;
  this.camera = null;
  this.objects = [];
}

Sim.App.prototype = new Sim.Publisher;

Sim.App.prototype.init = function(param)
{
  param = param || {};  
  var container = param.container;
  var canvas = param.canvas;

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


    // // Set up event handlers
    // this.initMouse();
    // this.initKeyboard();
    // this.addDomHandlers();

}

//Core run loop
Sim.App.prototype.run = function()
{
  this.update();
  this.renderer.render( this.scene, this.camera );
  var that = this;
  requestAnimationFrame(function() { that.run(); });  
}

// Update method - called once per tick
Sim.App.prototype.update = function()
{
  var i, len;
  len = this.objects.length;
  for (i = 0; i < len; i++)
  {
    this.objects[i].update();
  }
}

// Add/remove objects
Sim.App.prototype.addObject = function(obj)
{
  this.objects.push(obj);

  // If this is a renderable object, add it to the root scene
  if (obj.object3D)
  {
    this.root.add(obj.object3D);
  }
}

Sim.App.prototype.removeObject = function(obj)
{
  var index = this.objects.indexOf(obj);
  if (index != -1)
  {
    this.objects.splice(index, 1);
    // If this is a renderable object, remove it from the root scene
    if (obj.object3D)
    {
      this.root.remove(obj.object3D);
    }
  }
}

// Sim.Object - base class for all objects in our simulation
Sim.Object = function()
{
  Sim.Publisher.call(this);
  
  this.object3D = null;
  this.children = [];
}

Sim.Object.prototype = new Sim.Publisher;

Sim.Object.prototype.init = function()
{
}

Sim.Object.prototype.update = function()
{
  this.updateChildren();
}

// setPosition - move the object to a new position
Sim.Object.prototype.setPosition = function(x, y, z)
{
  if (this.object3D)
  {
    this.object3D.position.set(x, y, z);
  }
}

//setScale - scale the object
Sim.Object.prototype.setScale = function(x, y, z)
{
  if (this.object3D)
  {
    this.object3D.scale.set(x, y, z);
  }
}

//setScale - scale the object
Sim.Object.prototype.setVisible = function(visible)
{
  function setVisible(obj, visible)
  {
    obj.visible = visible;
    var i, len = obj.children.length;
    for (i = 0; i < len; i++)
    {
      setVisible(obj.children[i], visible);
    }
  }
  
  if (this.object3D)
  {
    setVisible(this.object3D, visible);
  }
}

// updateChildren - update all child objects
Sim.Object.prototype.update = function()
{
  var i, len;
  len = this.children.length;
  for (i = 0; i < len; i++)
  {
    this.children[i].update();
  }
}

Sim.Object.prototype.setObject3D = function(object3D)
{
  object3D.data = this;
  this.object3D = object3D;
}

//Add/remove children
Sim.Object.prototype.addChild = function(child)
{
  this.children.push(child);
  
  // If this is a renderable object, add its object3D as a child of mine
  if (child.object3D)
  {
    this.object3D.add(child.object3D);
  }
}

Sim.Object.prototype.removeChild = function(child)
{
  var index = this.children.indexOf(child);
  if (index != -1)
  {
    this.children.splice(index, 1);
    // If this is a renderable object, remove its object3D as a child of mine
    if (child.object3D)
    {
      this.object3D.remove(child.object3D);
    }
  }
}

// Some utility methods
Sim.Object.prototype.getScene = function()
{
  var scene = null;
  if (this.object3D)
  {
    var obj = this.object3D;
    while (obj.parent)
    {
      obj = obj.parent;
    }
    
    scene = obj;
  }
  
  return scene;
}

Sim.Object.prototype.getApp = function()
{
  var scene = this.getScene();
  return scene ? scene.data : null;
}