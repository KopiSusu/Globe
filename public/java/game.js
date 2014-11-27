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
      activate();
      target();
    }
    return _territories;
  }

  // returns an array of armies belonging to the player
  // e.g. [ {Canada: 10}, {Russia: 12} ]
  function armies(player) {
    var results = [];
    var i = _territories.length;
    while (i--) {
      var t = _territories[i];

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

  // takes name, returns territory object with associated armies
  function getTerritory(name) {
    var i = _territories.length;
    while (i--) {
      if (_territories[i].name == name) {
        return _territories[i];
      }
    }
  }

  // public function
  function handleClick(name) {

    if (_activeCountry == name || !name) {
      deactivate();
    }

    else if (!_activeCountry && name) {
      activate(name);
    }

    else if (_activeCountry && _activeCountry != name) {
      target(name);
    }
  }

  function activate(name) {
    if (name) {
      _activeCountry = name;
    }

    if (_activeCountry) {

      var t = getTerritory(_activeCountry);
      domhandler.activate(t);

      vfx.activate(_activeCountry);
    }
  }

  function deactivate() {
    domhandler.deactivate();
    vfx.deactivate(_activeCountry);
    _activeCountry = null;
  }

  function target(name) {

    if (name) {
      _targetCountry = name;
    }
    if (_targetCountry) {
      var t = getTerritory(_targetCountry);
      domhandler.target(t);
      vfx.target(_targetCountry);
    }
  }

  function moveTroops(from, to, num, plyr) {

    // TODO
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