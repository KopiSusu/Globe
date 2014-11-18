// describes particle cloud for base sphere
define(['./util', 'three'], function(convert, THREE) {

    var particles = new THREE.Geometry(),
        system,
        material  = new THREE.PointCloudMaterial({
                    // color:        0xF3F2F2,
                    size:         2,
                    map:          THREE.ImageUtils.loadTexture("images/dust.png"),
                    blending:     THREE.AdditiveBlending,
                    // fog: false,
                    transparent:  true
                  });
  return {

      init: function() {
          var p, q, limit, theta, phi, rho, particle,
              density = parseFloat(100);  // total number of particles in each 'ring'

          for (q = -density; q < density; q++ ) {
            limit = Math.sin( Math.abs(q/density) * Math.PI ) * density;

            for(var p = -limit; p < limit; p++) {
              theta = q/density * Math.PI;
              phi   = p/limit * Math.PI;
              rho   = 0.1875;
              
              // // Add randomness to make the globe fuzzy
              theta += Math.random()/density;
              rho -= Math.random()-0.3;
              
              particle = convert.toParticle(convert.toCartesian([theta, phi, rho]));
              particles.vertices.push(particle);
            }
          }
          system = new THREE.PointCloud(particles, material);
                    // system = new THREE.Mesh();
          return system;

      } 

  }

});