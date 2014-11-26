var Game = (function() {

  var _territories = [];
  var _turnLength = 5;
  var _activeCountry = null;
  var _targetCountry = null;
  var _player = null;
  var vfx = new VFX();

  function player(player) {
    if (name) {
      _player = player;
    }
    return _player;
  }

  function targetCountry(country) {
    if (country) {
      _targetCountry = country.name;
    }
    return _targetCountry;
  }

  function activeCountry(country) {
    if (country) {
      _activeCountry = country.name;
    }
    return _activeCountry;
  }

  function turnLength(n) {
    if (n) {
      _turnLength = n;
    }
    return _turnLength;
  }

  function territories(data) {
    if (data) {
      _territories = data;
    }
    return _territories;
  }

  function armies(player) {
    var results = [];
    var i = _territories.length;
    while (i--) {
      var t = _territories[i];

      // if there are troops belonging to the player
      if (t.troops[player.id]) {
        var army = {
          name : t.name,
          num : t.troops[player.id]
        };
        results.push(army);
      }
    }
    return results;
  }

  function getTerritory(name) {
    var i = _territories.length;
    while (i--) {
      if (_territories[i].name == name) {
        return _territories[i];
      }
    }
  }

  // public
  function handleClick(name) {

    if (_activeCountry == name || !name) {
      deactivate(name);
    }

    else if (!_activeCountry && name) {
      activate(name);
    }

    else if (_activeCountry && _activeCountry != name) {
      target(name);
    }
  }

  function activate(name) {
    console.log('inside activate');
    _activeCountry = name;

    var t = getTerritory(name);
    domhandler.activate(t);

    vfx.activate(name);
  }

  function deactivate(name) {
    console.log('inside game deactive');
    var name = name || _activeCountry;
    _activeCountry = null;
    vfx.deactivate(name);
    domhandler.deactivate();
  }

  function target(name) {
    console.log('inside game target');
    _targetCountry = name;

    var t = getTerritory(name);
    domhandler.target(t);
  }


  // var updateState = function(player, data) {
  //   territories = data;
  //   //vfx.renderState(territories);

  //   // remove existing standing armies
  //   $('div.standingArmies > .army').remove();
    
  //   // add own armies to standing armies
  //   var i = territories.length;
  //   while (i--) {
  //     var territory = territories[i];
  //     if (territory.troops[player.id]) {
  //       console.log('i have troops in ' + territory.name);
  //       var name = territory.name;
  //       var num = territory.troops[player.id];
  //       $('<div>').text(name + ': ' + num + ' troops')
  //                 .addClass('army')
  //                 .appendTo('div.standingArmies')
  //     }
  //   }
  // };

  // // takes a name and returns a territory object
  // var terrsFind = function(name) {
  //   var i = territories.length;
  //   while (i--) {
  //     if ( territories[i].name == name ) {
  //       return territories[i];
  //     }
  //   }
  // }

//   // this is called when a country is clicked (made active)
//   var activeCountry = function(country) {

//     if (country) {
//       $('div.activeCountry > .army').remove();

//       var name = country.name;
//       var pId = socket.player.id;
//       var terr = terrsFind(name);

//       // find own troops in territory
//       var num = 0;
//       if (terr.troops[pId]) {
//         num += terr.troops[pId];
//       }

//       // update active country info
//       $('div.activeCountry > .header').text(terr.name);
//       $('div.activeCountry > .myArmy').text('Your Troops: ' + num);
//       $('div.activeCountry').attr('data-name', terr.name);

//       // update enemy troops in active country
//       for (var id in terr.troops) {
//         if (id != pId) {
//           var num = terr.troops[id];
//           $('<p>').text('Player ' + id + ': ' + num + ' troops')
//                 .appendTo('<div>')
//                 .addClass('army')
//                 .appendTo('div.activeCountry');
//         }
//       }
//       this._activeCountry = country;
//     }

//     return this._activeCountry;
//   }


//   var moveTroops = function(player, from, to, num) {
//     var id = player.id;
//     from = terrsFind(from);
//     to = terrsFind(to);

//     // remove troops from active territory
//     if (from.troops[id] < num){
//       return false;
//     }
//     from.troops[id] -= num;
//     if ( from.troops[id] == 0 ) {
//       delete from.troops[id];
//     }

//     // add troops to target territory
//     if (!to.troops[id]) {
//       to.troops[id] = 0;
//     }
//     to.troops[id] += num;

//     updateState(territories);
// }



  return {
    // state : territories,
    // updateState : updateState,
    // moveTroops : moveTroops,
    territories : territories,
    armies : armies,
    handleClick : handleClick
    // activeCountry : activeCountry,
    // targetCountry : targetCountry
  };

})();