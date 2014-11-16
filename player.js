var teams = require('./teams');

var COUNTER = 0; // generates unique id for players

function Player() {

  // set unique id
  COUNTER++;
  this.id = COUNTER;

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

Player.prototype.troopsIn = function(territory) {
  return this.troops[territory];
};

Player.prototype.sendTroops = function(territory, num) {
  if (!this.troops[territory]) {
    this.troops[territory] = 0;
  }
  this.troops[territory] += num;
}

Player.prototype.loseTroops = function(territory, num) {
  this.troops[territory] -= num;
}

Player.prototype.totalTroops = function() {
  result = 0;
  for (var i in this.troops) {
    result += this.troops[i];
  }
  return result;
}

module.exports = Player;