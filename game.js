var STARTING_TROOPS = 50;
var STARTING_TERRITORIES = 4;
var Territory = require('./territory');
var Player = require('./player');

var territoriesInPlay = require('./public/java/lib/0_countriesdata');

var state = [];
for (var i in territoriesInPlay) {
  var name = territoriesInPlay[i]
  var t = new Territory(name);
  state.push(t);
}

function addNewPlayer() {
  newPlayer = new Player();
  initTroops(newPlayer);
  return newPlayer;
}

function initTroops(player) {
  var terrs = emptyTerritories(STARTING_TERRITORIES);
  for (var i in terrs) {
    terrs[i].troops[player.id] = Math.floor(STARTING_TROOPS/STARTING_TERRITORIES);
  }
}

// if x is undefined, returns all empty territories
function emptyTerritories(x) {
  x = x || state.length;
  var terrs = [];
  var i = 0;
  while ( i < state.length && x > 0) {
    if ( state[i].isEmpty() ) {
      terrs.push(state[i]);
      x--;
    }
    i++;
  }
  return terrs;
}

function moveTroops(player, from, to, num) {
    var i = state.length;

    // grabbing territory objects from names
    while (i--) {
        if (state[i].name == from) {
          from = state[i];
        };
        if (state[i].name == to) {
          to = state[i];
        };
    }

    // moving the troops
    if ( from.remTroops(player.id, num) ) {
      to.addTroops(player.id, num)
    }
};

function evaluateState() {
  var i = state.length;
  while (i--) {
    var terr = state[i];
    terr.lastOneStanding();
  }
}

function removePlayer(id) {
  var i = state.length;
  while (i--) {
    state[i].removePlayer(id);
  }
}


module.exports = {
  removePlayer : removePlayer,
  addNewPlayer : addNewPlayer,
  evaluateState : evaluateState,
  state : state,
  moveTroops : moveTroops,
}

