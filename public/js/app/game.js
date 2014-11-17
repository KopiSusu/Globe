define([], function() {

  /* instantiates empty game
      changes here are not reflected */
  var state = [];

  return {

    state : state,

    updateState : function(data) {
      this.state = data;
    },

    moveTroops : function(playerid, num, from, to) {
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
    }
    
  }

});