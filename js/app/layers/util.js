// common utilities for converting coordinates into vertices
define(['three'], function(THREE) {

    return {

        // takes spherical coordinates[theta, phi, rho] and converts to Cartesian[x,y,z]
        toCartesian: function(coords) {
          var x, y, z, 
              theta = coords[0],
              phi   = coords[1],
              rho   = coords[2];

          x = rho * Math.sin(theta) * Math.cos(phi); 
          y = rho * Math.sin(theta) * Math.sin(phi); 
          z = rho * Math.cos(theta);                
          return [x, y, z];
        },

        // takes geodesic coordinates[latitude, longitude, height] and converts to spherical[theta, phi, rho]
        toSpherical: function(coords) {
          var theta, phi, rho,
              latitude  = coords[0],
              longitude = coords[1],
              height    = coords[2],

          theta = Math.PI * (0.5 - latitude / 180.0);
          phi   = Math.PI * (0.5 - longitude / 180.0);
          rho   = height;
          return [theta, phi, rho];
        },

        // takes geodesic coordinates[latitude, longitude, height] and converts to Cartesian[x,y,z]
        geoToCartesian: function(coords) {
          return this.toCartesian(this.toSpherical(coords));
        },

        toParticle: function(coords) {
          var size      = 200,
              particle  = new THREE.Vector3(
                            coords[0] * size, 
                            coords[1] * size,
                            coords[2] * size
                          );
          return particle;
        }
    }

});