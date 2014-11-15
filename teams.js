var teams = [
  { 
    id : 1,
    num_players: 0 
  },
  { id: 2,
    num_players: 0 
  }
];

// sort teams in ascending orders by number of players
teams.sortAscendingSize = function() {
  teams.sort(function(a, b) { 
    return a.num_players - b.num_players 
  });
}

module.exports = teams;


