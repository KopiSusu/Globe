var Game = (function() {

  var territories = [];
  var turnLength = 5;
  var timer = '';
  
  // see our animation.js file for details
  var vfx = new VFX();
  vfx.init(); // creates scenes, adds countries
  vfx.run(); // sets up update loop

  var updateState = function(data) {
    territories = data;
    //vfx.renderState(territories);

    $('div.standingArmies').empty();
    
    var id = io.socket.playerid;
    var i = territories.length;
    while (i--) {
      var territory = territories[i];
      if (territory.troops[id]) {
        console.log('i have troops in ' + territory.name);
        var name = territory.name;
        var num = territory.troops[id];
        $('<div>').text(name + ': ' + num + ' troops')
                  .addClass('army')
                  .appendTo('div.standingArmies')

      }
    }
    
  };

  var terrsFind = function(name) {
    var i = territories.length;
    while (i--) {
      if ( territories[i].name == name ) {
        return territories[i];
      }
    }
  }

  var updateActiveCountry = function(name) {
    $('div.activeCountry > .army').remove();
    var id = io.socket.playerid;
    var terr = terrsFind(name);

    // find own troops in territory
    var num = 0;
    if (terr.troops[id]) {
      num += terr.troops[id];
    }

    $('div.activeCountry > .header').text(terr.name);
    $('div.activeCountry > .myArmy').text(num);

    for (var id in terr.troops) {
      var num = terr.troops[id];
      $('<p>').text('Player ' + id + ': ' + num + 'troops')
            .appendTo('<div>')
            .addClass('army')
            .appendTo('div.activeCountry');
    }

  }
  var moveTroops = function(playerid, from, to, num) {
    var l = players.length;
    var done = false;
    while (l-- && !done) {
      var p = players[l];
      if (p.id == playerid) {
        p.troops[from] -= num;
        p.troops[to] += num;
        done = true;
      }
    } 
  };

  var findTroops = function(playerid, country) {
    var i = players.length;
    while (i--) {
      if (playerid = players[i].id) {
        return players[i].troops[country] || 0;
      }
    }
  }

  var startTimer = function() {

      clearInterval(timer);
      $('#timer').text(turnLength);
      timer = setInterval(triggerCountDown, 1000);


      function triggerCountDown() {
        var n = $('#timer').text();
        if (n > 0) {
          n--;
          $('#timer').text(n);
        }
      }
  };



  return {
    state : territories,
    updateState : updateState,
    updateActiveCountry : updateActiveCountry,
    moveTroops : moveTroops,
    startTimer : startTimer,
    findTroops : findTroops
  };

})();