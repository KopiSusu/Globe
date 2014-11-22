// returns an object {'Canada' : THREE.Mesh(), 'Afghanistan' : THREE.Mesh()}
var Countries = (function(THREE) {

  var results = {};

  for (var name in countriesData) {
      var countryData = countriesData[name];
      var geometry = new Map3DGeometry(countryData, 0.99);
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
      mesh.name = name;
      results[name] = mesh;
  };

  return results;

})(THREE);

Countries.clearTroops = function() {
  for (var name in Countries) {
    if (Countries[name].clear) {
      Countries[name].clear();
    }
  }
}

// each individual country Mesh object can addTroops to itself
THREE.Mesh.prototype.addTroops = function(playerid, num) {
  
  // create centroid in geometry and copy all vertices to it
  var geometry = this.geometry;
  geometry.centroid = new THREE.Vector3();
  for ( var i = 0, 
        l = geometry.vertices.length,
        centroid = geometry.centroid,
        vertices = geometry.vertices; 
    i < l; i++) {
    centroid.add(vertices[i]);
  }

  // convert centroid
  geometry.centroid.divideScalar(geometry.vertices.length);
  geometry.centroid.divideScalar(Math.sqrt(Math.pow(geometry.centroid.x, 2) +
                                            Math.pow(geometry.centroid.y, 2) +
                                            Math.pow(geometry.centroid.z, 2)));
  var position = geometry.centroid;
  position.applyMatrix4( this.matrixWorld );


  // this creates the new obj to represent a troop
  var tgeometry = new THREE.Geometry();
  var tvertices = new THREE.Vector3();
  var tsprite = THREE.ImageUtils.loadTexture('images/particle.png')

  tvertices.x = (position.x);
  tvertices.y = (position.y);
  tvertices.z = (position.z);

  tgeometry.vertices.push( tvertices );
      // geometry.vertices.push( tvertices.clone ().multiplyScalar (1.1))

  var tmaterial = new THREE.PointCloudMaterial( { 
            size: 50, 
            // sizeAttenuation: false, 
            color: Math.random() * 0x555555, 
        });

  var troop = new THREE.PointCloud( tgeometry, tmaterial );

  troop.position.x = Math.random() * 2 - 1;
  troop.position.y = Math.random() * 2 - 1;
  troop.position.z = Math.random() * 2 - 1;
  troop.position.normalize();

  troop.sortParticles = true;
  troop.name = playerid;
  this.updateScale(1.005);
  this.children.push(troop);
}

