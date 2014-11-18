function Game() {

  this.state = [];
  this.turnLength = 5;
  this.timer = '';
  this.animation = Animation;

  return this;
};

Game.prototype.start = function() {
  this.animation.init();
}

Game.prototype.updateState = function(data) {
  this.state = data;
};

Game.prototype.moveTroops = function(playerid, num, from, to) {
  var l = this.state.length;
  var done = false;
  while (l-- && !done) {
    var p = this.state[l];
    if (p.id == playerid) {
      p.troops[from] -= num;
      p.troops[to] += num;
      done = true;
    }
  } 
};

Game.prototype.startTimer = function() {

    clearInterval(timer);
    $('#timer').text(this.turnLength);
    timer = setInterval(triggerCountDown, 1000);


    function triggerCountDown() {
      var n = $('#timer').text();
      if (n > 0) {
        n--;
        $('#timer').text(n);
      }
    }
};

var game = new Game();
game.start();
