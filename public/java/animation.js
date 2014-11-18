var Animation = (function() {

  var app = new Sim.App();
  app.init({container: $('#container')});
  app.run();

  var createCountries = function() {

    var results = new Sim.Object();

    var layer = new THREE.Object3D();
    var factor = 205;
    
    layer.scale.set(factor, factor, factor);

    var polygons = Object.keys(countries).map(function(name) {
      var country = countries[name];
      var geometry = new Map3DGeometry(country, 0.99);
      geometry.name = name;
      var colour = Math.random() * 0xF3F2F2
      var material = new THREE.MeshPhongMaterial({ 
        // wireframe: true,
        transparent: true,
        wrapAround: true,
        color: colour, 
        specularity: 0x111111,
        opacity: 1
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.scale.x = 20
      mesh.scale.y = 20
      mesh.scale.z = 20 
      layer.add( mesh )
      return mesh;
    });

    results.object3D = layer;

    app.addObject(results);
  };


  return {
    init: function() {
        app.init({container: $('#container')});
        createCountries();
        app.run();
        debugger;
    }

  };

})();