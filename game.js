
var STARTING_TROOPS = 30;

var Player = require('./player');
var players = [];


var territories = [
  { id: 'Canada', belongsTo: '1' },
  { id: 'Australia', belongsTo: '1' },
  { id: 'Korea', belongsTo: '2' },
  { id: 'Germany', belongsTo: '2' }
];


var friendlyTerritories = function(player) {
  var friendly = [];
  var l = territories.length;
  while (l--) {
    var id = territories[l].id;
    if (territories[l].belongsTo == player.team_id)
    friendly.push(id);
  }
  return friendly;
}

function initTroops(player) {
  var ft = friendlyTerritories(player);
  for (var i = 0; i < ft.length; i++) {
    player.troops[String(ft[i])] = STARTING_TROOPS/ft.length;
  }
}


// grabs the index of the largest element in the array
function max_index(elements) {
    var i = 1;
    var mi = 0;
    while (i < elements.length) {
        if (!(elements[i] < elements[mi]))
            mi = i;
        i += 1;
    }
    return mi;
}

function getWinningTeams() {
  var winners = {};
  // looping through the territories
 for ( var i = 0; i < territories.length; i++) {
    var t = territories[i].id;
    var tally = [0,0,0]; // array should be initialized with number of teams + 1

    // looping through the players
    for (var n = 0; n < players.length; n++) {
      var p = players[n];
      var team = p.team_id;
      // if player has troops in that territory
      if ( p.troops[t] > 0 ) {
        tally[team] += p.troops[t]; // add troops to the tally
      }
    }

    winner = max_index(tally);
    winners[t] = winner
  }


  console.dir(winners);
}


for (var i = 0; i < 6; i++) {
  newPlayer = new Player();
  initTroops(newPlayer);
  players.push(newPlayer);
};

console.log('BEFORE MOVING');
console.dir(players);

p1 = players[0];
p2 = players[1];
p3 = players[2];
p4 = players[3];
p5 = players[4];
p6 = players[5];

p1.moveTroops(15, 'Canada', 'Germany');
p4.moveTroops(15, 'Canada', 'Germany');
p5.moveTroops(15, 'Canada', 'Germany');

console.log('SOME MOVES MADE (all Canadian troops to Germany)');

console.dir(players);


getWinningTeams();

