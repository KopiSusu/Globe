
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

Territory.prototype.contains = function(id) {
  if (this.troops[id] && this.troops[id] > 0) {
    return true;
  }
  return false;
}


Territory.prototype.lastOneStanding = function() {

  var data = {};

  var armies = this.troops;
  var ids = Object.keys(armies);

  // base case
  if (ids.length <= 1) {

    // if there has been conflict, return a victorious player
    if ( Object.keys(data)[0] ) {
      data.victorious = ids[0];
      return data;
    }
    // else return null
    return null;
  }

  // recursive case 
  else {
    data.name = this.name;
    var min = ids.reduce(function(m, k){ return armies[k] < m ? armies[k] : m }, +Infinity);
    for (var id in armies) {
      armies[id] -= min;
      if (armies[id] <= 0) {
        delete armies[id];
      }
    }
    this.lastOneStanding();
  }

}

Territory.prototype.removePlayer = function(id) {
  if ( this.troops[id] ) {
    delete this.troops[id];
  }
}
Territory.prototype.remTroops = function(id, num) {

  if (!this.troops[id]) {
    this.troops[id] = 0;
  }
  
  if (this.troops[id] < num ){
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