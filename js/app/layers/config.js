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
    ['./sphere','./continents','./cities','./inner','./inneryellow'], 

    function(sphere, continents, cities, inner, inneryellow){
        return {
          sphere: sphere,
          continents: continents,
          cities: cities,
          //inner: inner,
          inneryellow: inneryellow
        }
    }

);