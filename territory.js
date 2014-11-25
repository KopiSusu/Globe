
function Territory(name) {

  this.name = name;

  // format: playerid : 5 (Int)
  this.troops = {}; 

  return this;
};

Territory.prototype.isEmpty = function() {
  var that = this;
  for (var player in that.troops) {
    if ( that.troops[player] > 0 ) {
      return false;
    }
  }
  return true;
}

Territory.prototype.name = function(newName) {
  if (newName) {
    this.name = newName;
  }

  return this.name;
}

Territory.prototype.lastOneStanding = function() {
  var armies = this.troops;
  var keys = Object.keys(armies);

  // base case
  if (keys.length <= 1) {
    return keys[0];
  }

  // recursive case 
  else {
    var min = keys.reduce(function(m, k){ return armies[k] < m ? armies[k] : m }, +Infinity);
    for (var id in armies) {
      armies[id] -= min;
      if (armies[id] <= 0) {
        delete armies[id];
      }
    }
    this.lastOneStanding();;
  }
}

Territory.prototype.removePlayer = function(id) {
  if ( this.troops[id] ) {
    delete this.troops[id];
  }
}
Territory.prototype.remTroops = function(id, num) {
  if (this.troops[id] < num){
    return false;
  }
  this.troops[id] -= num;
  if ( this.troops[id] == 0 ) {
    delete this.troops[id];
  }
  return true;
}

Territory.prototype.addTroops = function(id, num) {
  if (!this.troops[id]) {
    this.troops[id] = 0;
  }
  this.troops[id] += num;
}
module.exports = Territory;