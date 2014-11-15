var DataStore = require('nedb');
var Player = require('./player');
var Troop = require('./troop');
var Territory = require('./territory');


var troops = new DataStore();
var players = new DataStore();
var territories = new DataStore();


var player1 = {

}
players.insert({
      "id" : "1", //Int
      "team_id" : "1", //Int

      "troops" : [
        {
          "territory_id" : "", //Int
        },

      ] // end array of troops
    });

module.exports = {
  troops: troops,
  players: players,
  territories: territories
}