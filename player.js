var teams = require('./teams');

var COUNTER = 0; // generates unique id for players

function Player() {

  // set unique id
  this.id = COUNTER;
  COUNTER++;

  // assign player to team with fewest players
  teams.sortAscendingSize();
  this.team_id = teams[0].id;
  teams[0].num_players += 1;


  this.troops = {}; // 'Canada' : 5 (Int)

  return this;
};



Player.prototype.moveTroops = function(num, fromId, toId) {

  this.troops[fromId] -= num;

  if (!this.troops[toId]) { this.troops[toId] = 0 };
  this.troops[toId] += num;
};

module.exports = Player;