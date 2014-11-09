// describe particles that represent cities
define(['./util', './data/cities', 'three'], function(convert, cities, THREE) {
    
    var particles = new THREE.Geometry(),
        system,
        material  = new THREE.PointCloudMaterial({
                        color:        0xff0000,
                        size:         40,
                        //map:          THREE.ImageUtils.loadTexture("../../../../images/dust.png"),
                        blending:     THREE.AdditiveBlending,
                        //transparent:  true
                      });

  return {

      init: function() {
        var coords, particle;
        for ( var i in cities ) {
          coords = cities[i];
          particle = convert.toParticle(convert.geoToCartesian(coords));
          particle.color = new THREE.Color(0xff0000);
          particles.vertices.push(particle);
         }
        system = new THREE.PointCloud(particles, material);
        return system;
      }

  }

});