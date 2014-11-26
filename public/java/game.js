var Game = (function() {

  var _territories = [];
  var _turnLength = 5;
  var _activeCountry = null;
  var _targetCountry = null;
  var vfx = new VFX();


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

  function moveTroops(from, to, num, plyr) {

    //vfx.moveUnits(from, to);

    var id = plyr.id;
    if (!getTerritory(from).troops[id]) {
      getTerritory(from).troops[id] = 0;
    }

    if ( !getTerritory(to).troops[id] ) {
      getTerritory(to).troops[id] = 0;
    }

    if (getTerritory(from).troops[id] < num) {
      return false;
    }

    else {
      getTerritory(from).troops[id] -= num;
      getTerritory(to).troops[id] += num;

      if (getTerritory(from).troops[id] <= 0) {
        delete getTerritory(from).troops[id]
      }
      if (getTerritory(to).troops[id] <= 0) {
        delete getTerritory(from).troops[id]
      }
    }

  }

  return {
    territories : territories,
    armies : armies,
    handleClick : handleClick,
    moveTroops : moveTroops
  };

})();