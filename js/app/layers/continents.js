// describes particles that form the coastline layer
define(['./util', './data/continents', 'three'], function(convert, continents, THREE) {

  var particles = new THREE.Geometry(),
      system,
      material  = new THREE.PointCloudMaterial({
                        color:        0x2194CE,
                        size:         4,
                        map:          THREE.ImageUtils.loadTexture('images/particle.png'),
                        blending:     THREE.AdditiveBlending,
                        // debugger
                        // transparent:  true
                      });

  return {

    init: function() {
      var getParticle = function(coordinates) {
          for (var i = 0; i < coordinates.length; i++) {
            var longitude = coordinates[i][0];
            var latitude = coordinates[i][1];
            var height = 1.01;
            var particle = convert.toParticle(convert.geoToCartesian([latitude, longitude, height]));
            particles.vertices.push(particle);
          }
      };

      var features = continents.features;
      for (var i = features.length - 1; i >= 0; i--) {
        getParticle(features[i]['geometry']['coordinates']);
      }

      system = new THREE.PointCloud(particles, material);
      return system;
    }

  }

});
