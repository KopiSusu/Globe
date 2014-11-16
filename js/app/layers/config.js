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
    ['./continents','./cities','./inner','./inneryellow','./crust','./text'], 

    function(continents, cities, inner, inneryellow, crust, text){
        return {
          continents: continents,
          cities: cities,
          inner: inner,
          inneryellow: inneryellow,
          crust: crust,
          text: text
        }
    }

);