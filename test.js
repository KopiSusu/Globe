var Player = require('./player');

for (var i = 0; i < 10; i++) {
obj = new Player();
console.dir(obj);
};

var territories = [ 
  { 
    name: 'Canada',
    belongsTo: '1'
  },
  { 
    name: 'Australia',
    belongsTo: '1'
  },
  { 
    name: 'Korea',
    belongsTo: '2'
  },
  { 
    name: 'Germany',
    belongsTo: '2'
  },
];