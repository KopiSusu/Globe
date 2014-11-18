/* Syntax for adding new layer is as follows: 
    define(
        ['./sphere','./continents','./cities', './example'], 

        // THE ORDER MATTERS
        function(sphere, continents, cities, example){
            return {
              sphere: sphere,
              continents: continents,
              cities: cities,
              example: example
            }
        }
    );
*/

define(
    ['./continents','./inner','./inneryellow','./crust','./text', './troops'], 

    function(continents, inner, inneryellow, crust, text, troops){
        return {
          continents: continents,
          inner: inner,
          inneryellow: inneryellow,
          crust: crust,
          text: text,
          troops: troops
        }
    }

);