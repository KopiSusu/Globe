var Game = (function() {

  var players = [];
  var turnLength = 5;
  var timer = '';
  
  // see our animation.js file for details
  var vfx = new VFX();
  vfx.init(); // creates scenes, adds countries
  vfx.run(); // sets up update loop

  var updateState = function(data) {
    players = data;
    vfx.renderState(data);
  };

  var moveTroops = function(playerid, num, from, to) {
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
    state : players,
    updateState : updateState,
    moveTroops : moveTroops,
    startTimer : startTimer
  };

})();