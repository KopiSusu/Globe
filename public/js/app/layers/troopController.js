define (['./data/countries'], 

  function(countries){ 

    var addTroops = function(playerid, num, country) {

      var troops = countries[country].troops.playerid || 0;
      troops += num;
      countries[country].troops.playerid = num;

    }

    var setTroops = function(playerid, num, country) {
      countries[country].troops.playerid = num;
    }

  }, 

  return {
    addTroops : addTroops,
  };
);