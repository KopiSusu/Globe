define(['./util', './data/continents', 'three'], function(convert, continents, THREE) {

  var particles = new THREE.Geometry(),
      system,
      material  = new THREE.PointCloudMaterial({
                        color:        0x111111,
                        size:         5,
                        map:          THREE.ImageUtils.loadTexture("../../../../images/dust.png"),
                        blending:     THREE.AdditiveBlending,
                        // transparent:  true
                      });

  return {

    init: function() {
      var getParticle = function(coordinates) {
          for (var i = 0; i < coordinates.length; i++) {
            var longitude = coordinates[i][0];
            var latitude = coordinates[i][1];
            var height = 1;
            var particle = convert.toParticle(convert.geoToCartesian([latitude, longitude, height]));
            return particle;
          }
      };

      var features = continents.features;
      for (var i = features.length - 1; i >= 0; i--) {
        particles.vertices.push(getParticle(features[i]['geometry']['coordinates']));
      }

      system = new THREE.PointCloud(particles, material);
      return system;
    }

  }

});