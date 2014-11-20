function Animator() {

  // array of Mesh objects
  this.polygons = Object.keys(countries).map(function(name) {
      var country = countries[name];

      var geometry = new THREE.Geometry();
      var geometry = new Map3DGeometry(country, 0.99);
      geometry.name = name;
      var colour = Math.random() * 0xF3F2F2;
      var material = new THREE.MeshPhongMaterial({ 
        // wireframe: true,
        transparent: true,
        wrapAround: true,
        color: colour, 
        specularity: 0x000000,
        opacity: 1
      });
      var mesh = new THREE.Mesh(geometry, material); 
      return mesh;
  });

};

Animator.prototype.convertCountriesTo3D = function() {
  var obj = new THREE.Object3D();
  var factor = 205;
  obj.scale.set(factor, factor, factor);

  var meshes = this.polygons;
  var l = meshes.length;
  while (l--) {
    obj.add.meshes[l];
  }
  return obj;
};

Animator.prototype.getGeometryByIndex = function(i) {
  return this.polygons[i];
}
Animator = new Animator();