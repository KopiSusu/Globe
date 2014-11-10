// describes particle cloud for base sphere
define(['./util', 'three'], function(convert, THREE) {

    var particles = new THREE.Geometry(),
        system,
        material  = new THREE.PointCloudMaterial({
                    color:        0x333333,
                    size:         1,
                    map:          THREE.ImageUtils.loadTexture("images/dust.png"),
                    blending:     THREE.AdditiveBlending,
                    // transparent:  false
                  });
  return {

      init: function() {
          var p, q, limit, theta, phi, rho, particle,
              density = parseFloat(160);  // total number of particles in each 'ring'

          for (q = -density; q < density; q++ ) {
            limit = Math.sin( Math.abs(q/density) * Math.PI ) * density;

            for(var p = -limit; p < limit; p++) {
              theta = q/density * Math.PI;
              phi   = p/limit * Math.PI;
              rho   = 1;
              
              // // Add randomness to make the globe fuzzy
              // theta += Math.random()/density;
              rho -= Math.random()/300;
              
              particle = convert.toParticle(convert.toCartesian([theta, phi, rho]));
              particles.vertices.push(particle);
            }
          }
          system = new THREE.PointCloud(particles, material);
          return system;
      } 

  }

});