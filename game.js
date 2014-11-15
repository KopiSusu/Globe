
var STARTING_TROOPS = 30;

var Player = require('./player');
var players = [];


var territories = [
  { id: 'Canada' },
  { id: 'Australia' },
  { id: 'Korea' },
  { id: 'Germany' }
];


function addNewPlayers(x) {
  while (x--) {
    newPlayer = new Player();
    initTroops(newPlayer);
    players.push(newPlayer);
  };
  console.dir(players);
}
 
// use if trying to implement teams
function friendlyTerritories(player) {
  var friendly = [];
  var l = territories.length;
  while (l--) {
    var id = territories[l].id;
    if (territories[l].belongsTo == player.team_id)
    friendly.push(id);
  }
  return friendly;
}

// returns x number of empty territories
function emptyTerritories(x) {
  var results = [];
  var l = territories.length;

  if (!x) {
    var x = l;
  }

  while (l-- && results.length < x) {
    var t = territories[l];
    var empty = true;

    var i = players.length;
    while (i-- && empty) {
      if (players[i].troops[t.id] > 0) {
        empty = false;
      }
    }

    if (empty) {
      results.push(t);
    }
  }
  return results;
}

function playersIn(territory) {
  var i = players.length;
  var warring = [];
  while (i--) {
    if (players[i].troops[territory] > 0) {
      warring.push(players[i])
    }
  }
  return warring
}


// call when making new player. gives new player troops in 2 empty territories
function initTroops(player) {
  var terrs = emptyTerritories(2);
  console.dir(emptyTerritories());
  for (var i = 0; i < terrs.length; i++) {
    player.troops[String(terrs[i].id)] = STARTING_TROOPS/terrs.length;
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
  return winners;
}

function evaluateTurn() {

  var i = territories.length;
  while (i--) {
    // each territory
    var territory = territories[i].id;

    var playersAtWar = playersIn(territory);

    if (playersAtWar.length > 1) {
     lastOneStanding(playersAtWar, territory); // destroys troops until only 1 player has troops
    }
  }// end each territory


}

// each player loses troops until only 1 player has troops left
function lastOneStanding(warriors, territory) {
  var i = warriors.length;

  while (warriors.length > 1) {
    var i = warriors.length;
    while (i--) {
      warriors[i].troops[territory]--;
    }

    warriors = playersIn(territory);
  }

}
////test
// for (var i = 0; i < 6; i++) {
//   newPlayer = new Player();
//   initTroops(newPlayer);
//   players.push(newPlayer);
// };

// console.log('BEFORE MOVING');
// console.dir(players);

// p1 = players[0];
// p2 = players[1];
// p3 = players[2];
// p4 = players[3];
// p5 = players[4];
// p6 = players[5];

// p1.moveTroops(15, 'Korea', 'Australia');
// p1.moveTroops(5, 'Germany', 'Australia');


module.exports = {
  addNewPlayers : addNewPlayers
}

