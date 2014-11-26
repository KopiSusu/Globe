var STARTING_TROOPS = 50;
var STARTING_TERRITORIES = 4;
var TURN_LENGTH = 5;
var Territory = require('./territory');
var Player = require('./player');

var territoriesInPlay = require('./public/java/lib/0_countriesdata');

var territories = [];
for (var i in territoriesInPlay) {
  var name = territoriesInPlay[i]
  var t = new Territory(name);
  territories.push(t);
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
  x = x || territories.length;
  var terrs = [];
  var i = 0;
  while ( i < territories.length && x > 0) {
    if ( territories[i].isEmpty() ) {
      terrs.push(territories[i]);
      x--;
    }
    i++;
  }
  return terrs;
}

function moveTroops(player, from, to, num) {
    var i = territories.length;

    // grabbing territory objects from names
    while (i--) {
        if (territories[i].name == from) {
          from = territories[i];
        };
        if (territories[i].name == to) {
          to = territories[i];
        };
    }
    // moving the troops
    if ( from.remTroops(player.id, num) ) {
      to.addTroops(player.id, num)
    }
};

function evaluateState() {
  var i = territories.length;
  while (i--) {
    var terr = territories[i];
    terr.lastOneStanding(terr.troops);
  }
}

function removePlayer(id) {
  var i = territories.length;
  while (i--) {
    territories[i].removePlayer(id);
  }
}


// summarises all game info
function state() {
  var _state = {};
  _state.territories = territories;
  _state.turnLength = TURN_LENGTH;
  return _state;
}

module.exports = {
  removePlayer : removePlayer,
  addNewPlayer : addNewPlayer,
  evaluateState : evaluateState,
  state : state,
  moveTroops : moveTroops,
}

