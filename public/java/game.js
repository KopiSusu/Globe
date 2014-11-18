var Game = (function() {

  var players = [];
  var turnLength = 5;
  var timer = '';
  var animation = new Sim.App();
  animation.init({container: $('#container')});
  animation.run();

  // add territories to the main animation
  var territories = new Sim.Object();
  territories.object3D = Animator.convertCountriesTo3D();
  animation.addObject(territories);


  animation.scene.children.push(sphere.init());



  var updateState = function(data) {
    players = data;
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