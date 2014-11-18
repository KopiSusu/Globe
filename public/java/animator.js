var Animator = (function() {

  var convertCountriesTo3D = function() {
    var obj = new THREE.Object3D();

    var factor = 205;
    
    obj.scale.set(factor, factor, factor);

    var polygons = Object.keys(countries).map(function(name) {
      var country = countries[name];

      var geometry = new THREE.Geometry();
      var geometry = new Map3DGeometry(country, 0.99);
      geometry.name = name;
      var colour = Math.random() * 0xF3F2F2
      var material = new THREE.MeshPhongMaterial({ 
        // wireframe: true,
        transparent: true,
        wrapAround: true,
        color: colour, 
        specularity: 0x000000,
        opacity: 1
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.scale.x = 20
      mesh.scale.y = 20
      mesh.scale.z = 20 
      obj.add( mesh )
      return mesh;
    });
    return obj
  };


  return {
    convertCountriesTo3D : convertCountriesTo3D
  }


})();