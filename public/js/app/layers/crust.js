// describes particle cloud for base sphere
define(['./util', 'three'], function(convert, THREE) {

    var particles = new THREE.SphereGeometry(204, 32, 32),
        system,
        material  = new THREE.MeshPhongMaterial({ 
          color: 0x1C6BA0,
          // wireframe: true,
          // map         : THREE.ImageUtils.loadTexture("images/original.jpg"),
          wrapAround: true,
          side        : THREE.DoubleSide,
          opacity     : 0.1,
          specularity: 0x111111,
          transparent : true,
          depthWrite  : false,
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
              rho   = 1.01;
              
              // // Add randomness to make the globe fuzzy
              // theta += Math.random()/density;
              rho -= Math.random()/300;
              

              particle = convert.toParticle(convert.toCartesian([theta, phi, rho]));

              particles.vertices.push(particle);
            }
          }
          system = new THREE.Mesh();
          // system = new THREE.Mesh(particles, material);
          return system;
      } 

  }

});


// int pnpoly(int nvert, float *vertx, float *verty, float testx, float testy)
// {
//   int i, j, c = 0;
//   for (i = 0, j = nvert-1; i < nvert; j = i++) {
//     if ( ((verty[i]>testy) != (verty[j]>testy)) &&
//      (testx < (vertx[j]-vertx[i]) * (testy-verty[i]) / (verty[j]-verty[i]) + vertx[i]) )
//        c = !c;
//   }
//   return c;
// }








