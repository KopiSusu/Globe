// describes particles that form the coastline layer
define(['./util', './data/continents', 'three'], function(convert, continents, THREE) {

    var material = new THREE.PointCloudMaterial({
            color:        0x2194CE,
            size:         3,
            map:          THREE.ImageUtils.loadTexture('images/particle.png'),
            blending:     THREE.AdditiveBlending,
            // debugger
            // transparent:  true
          }),
        lineMaterial = new THREE.LineBasicMaterial({
          color: 0x333333,
          linewidth: 1,
          fog: true
        }),
        layer = new THREE.Object3D();
    
    var addVertice = function(coordinates, geometry) {
          var longitude = coordinates[0];
          var latitude = coordinates[1];
          var height = 1.01;
          var particle = convert.toParticle(convert.geoToCartesian([latitude, longitude, height]));
          geometry.vertices.push(particle);
    }

    var buildLine = function(coordsArray) {
      var geometry = new THREE.Geometry(),
          line;

      for (var i = (coordsArray.length - 1); i >= 0; i--) {
        addVertice(coordsArray[i], geometry);
      }

      line = new THREE.Line(geometry, lineMaterial);
      return line;

    }

  return {

    init: function() {


      var features = continents.features;

      for (var i = features.length - 1; i >= 0; i--) {
        layer.add(buildLine(features[i]['geometry']['coordinates']));
      }
      return layer;
    },

  }

});
