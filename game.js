
var STARTING_TROOPS = 30;
var GAME_OVER = false;

var Player = require('./player');
var players = [];

// extract names from countries data
var tData = require('./public/java/lib/0_countries');
var territories = [];
for (var country in tData) {
  territories.push({id: String(country)});
}

function addNewPlayer() {
    newPlayer = new Player();
    initTroops(newPlayer);
    players.push(newPlayer);
    return newPlayer;
}

// call when making new player. gives new player troops in 2 empty territories
function initTroops(player) {
  var terrs = emptyTerritories(2);
  for (var i = 0; i < terrs.length; i++) {
    player.sendTroops(terrs[i], STARTING_TROOPS/terrs.length);
  }
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
      if (players[i].troopsIn(t) > 0) {
        empty = false;
      }
    }

    if (empty) {
      results.push(t);
    }
  }
  return results;
}


function evaluateState() {

  var i = territories.length;
  while (i--) {

    // each territory
    var territory = territories[i];

    var playersAtWar = playersIn(territory);

    if (playersAtWar.length > 1) {
     lastOneStanding(playersAtWar, territory); // destroys troops until only 1 player has troops
    }
  }// end each territory

  GAME_OVER = true;
  i = players.length;
  while (i-- && GAME_OVER) {
    if (players[i].totalTroops() > 0)
      GAME_OVER = false;
  }
}

function playersIn(territory) {
  var i = players.length;
  var warring = [];
  while (i--) {
    if (players[i].troopsIn(territory) > 0) {
      warring.push(players[i]);
    }
  }
  return warring;
}

// each player loses troops until only 1 player has troops left
function lastOneStanding(warriors, territory) {
  var i = warriors.length;

  while (warriors.length > 1) {
    var i = warriors.length;
    while (i--) {
      warriors[i].loseTroops(territory, 1);
    }

    warriors = playersIn(territory);
  }

}

function removePlayer(player) {
  id = player.id;

  var i = players.length;
  var found = false;
  while (i-- && !found) {
    if ( players[i].id == id ) {
      players.splice(i, 1);
      found = true;
    }
  }
}

function moveTroops(id, num, from, to) {
  var i = players.length;
  var done = false;
  while (i-- && !done) {
    if ( players[i].id == id ) {
      players[i].moveTroops(num, from, to);
      done = true;
    }
  }
}
// //test
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

// evaluateState();


module.exports = {
  removePlayer : removePlayer,
  addNewPlayer : addNewPlayer,
  evaluateState : evaluateState,
  state : players,

  // moveTroops(playerid, num, from, to)
  // moveTroops(1, 15, 'Canada', 'Australia')
  moveTroops : moveTroops,
  end : GAME_OVER
}

