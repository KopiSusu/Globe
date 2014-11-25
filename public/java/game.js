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

    // remove existing standing armies
    $('div.standingArmies > .army').remove();
    
    // add own armies to standing armies
    var id = io.socket.player.id;
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

  // takes a name and returns a territory object
  var terrsFind = function(name) {
    var i = territories.length;
    while (i--) {
      if ( territories[i].name == name ) {
        return territories[i];
      }
    }
  }

  // this is called when a country is clicked (made active)
  var updateActiveCountry = function(name) {
    $('div.activeCountry > .army').remove();
    var pId = io.socket.player.id;
    var terr = terrsFind(name);

    // find own troops in territory
    var num = 0;
    if (terr.troops[pId]) {
      num += terr.troops[pId];
    }

    // update active country info
    $('div.activeCountry > .header').text(terr.name);
    $('div.activeCountry > .myArmy').text('Your Troops: ' + num);
    $('div.activeCountry').attr('data-name', terr.name);

    // update enemy troops in active country
    for (var id in terr.troops) {
      if (id != pId) {
        var num = terr.troops[id];
        $('<p>').text('Player ' + id + ': ' + num + ' troops')
              .appendTo('<div>')
              .addClass('army')
              .appendTo('div.activeCountry');
      }
    }
  }


  var moveTroops = function(player, from, to, num) {
    var id = player.id;
    from = terrsFind(from);
    to = terrsFind(to);

    // remove troops from active territory
    if (from.troops[id] < num){
      return false;
    }
    from.troops[id] -= num;
    if ( from.troops[id] == 0 ) {
      delete from.troops[id];
    }

    // add troops to target territory
    if (!to.troops[id]) {
      to.troops[id] = 0;
    }
    to.troops[id] += num;

    updateState(territories);
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
  };

})();