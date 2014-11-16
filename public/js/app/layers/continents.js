// describes particles that form the coastline layer
define(['./util', './data/countries', 'three', './data/Map3DGeometry'],
function(convert, countries, THREE, Map3DGeometry) {
    
    var layer = new THREE.Object3D();
    var factor = 205;
    
    layer.scale.set(factor, factor, factor);

    var polygons = Object.keys(countries).map(function(name)
    {
      var country = countries[name];
      var geometry = new Map3DGeometry(country, 0.99);
      geometry.name = name;
      var colour = Math.random() * 0xffffff
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

  return {
    init: function()
    {
      return layer;
    },
    getGeometryByName: function getGeometryByName(name)
    {
      return polygons[Object.keys(countries).indexOf(name)];
    },
    getGeometryByIndex: function getGeometryByIndex(index)
    {
      return polygons[index]
    }
  };
});

