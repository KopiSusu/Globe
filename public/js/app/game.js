define([], function() {

  var state = [];

  return {

    state : state,

    updateState : function(data) {
      this.state = data;
    },

    renderState : function(data) {
      // pass data to animation somehow
    }
  }

});