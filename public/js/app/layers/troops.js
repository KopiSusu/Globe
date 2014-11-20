// describe particles that represent cities
define(['./util', './data/countries', 'three'], function(convert, countries, THREE) {
    
    var particles = new THREE.Geometry(),
        system,
        material  = new THREE.PointCloudMaterial({
                        color:        0xBE4C39,
                        size:         10,
                        map:          THREE.ImageUtils.loadTexture("images/dust.png"),
                        blending:     THREE.AdditiveBlending,
                        transparent:  true
                      });


    
  return {


      init: function() {
        var coords, particle;
        for ( var country in countries ) {
          var troops = countries[country].troops;
          for (var playerid in troops) {
            var number = troops[playerid];

            while (number--) {

              // particle = "";
              // particles.vertices.push(particle);
              // add a particle to `country` belonging to `playerid`
            }

          }
        }
        
        system = new THREE.PointCloud(particles, material);
        return system;
      }, 
      // createParticle: function createParticle() {

      // }

  }

});