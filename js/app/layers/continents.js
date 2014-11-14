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
      var material = new THREE.MeshBasicMaterial({ 
        color: Math.random() * 0x333333, 
        opacity: 1 
      });
      var mesh;
      layer.add(mesh = new THREE.Mesh(geometry, material))
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
    }
  };
});