// generates unique id for players
var COUNTER = 0; 


function Player() {

  // set unique id
  COUNTER++;
  this.id = COUNTER;

  // format: 'Canada' : 5 (Int)
  this.troops = {}; 

  return this;
};

module.exports = Player;