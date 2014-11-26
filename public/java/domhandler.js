var domhandler = (function() {

 var _timer = '';
 var _player = '';

  function player(player) {
    if (player) {
      _player = player;
    }
    $('div#title').text('Player ' + _player.id);
    return _player;
  }

  function timer(n) {
    if (n) {
      var _turnLength = n;
    }

    clearInterval(_timer);
    $('#timer').text(_turnLength);
    _timer = setInterval(triggerCountDown, 1000);

  }
  
  function triggerCountDown() {
    var current = $('#timer').text();
    if (current > 0) {
      current--;
      $('#timer').text(current);
    }
  }

  function standingArmies(armies) {
    // remove existing standing armies
    $('div.standingArmies > .army').remove();

    var i = armies.length;
    while (i--) {
      army = armies[i]
      $('<div>').text(army.name + ': ' + army.num + ' troops')
                .addClass('army')
                .attr('country', army.name)
                .appendTo('div.standingArmies');
    }
  }

  function activate(country) {
    console.log('inside dom activate');
    $('div.activeCountry > .army').remove();

    var num = country.troops[_player.id] || 0;

    $('div.activeCountry').attr('data-name', country.name);
    $('div.activeCountry > .header').text(country.name);
    $('div.activeCountry > .myArmy').text(num);


    // update enemy troops in active country
    for (var id in country.troops) {
      if (id != _player.id) {
        var num = country.troops[id];
        $('<p>').text('Player ' + id + ': ' + num + ' troops')
              .appendTo('<div>')
              .addClass('army')
              .appendTo('div.activeCountry');
      }
    }
  }

  function deactivate() {
    console.log('inside dom deactive');
    $('div.activeCountry > .army').remove();
    $('div.activeCountry > .header').empty();
    $('div.activeCountry > .myArmy').text('');
    $('div.activeCountry').attr('data-name', '');
  }

  function target(country) {
    console.log('inside dom target');

    $('div.targetCountry > .army').remove();
    var num = country.troops[_player.id] || 0;

    $('div.targetCountry').attr('data-name', country.name);
    $('div.targetCountry > .header').text(country.name);
    $('div.targetCountry > .myArmy').attr('data-orig-value', num).text(num);

    // update enemy troops in active country
    for (var id in country.troops) {
      if (id != _player.id) {
        var num = country.troops[id];
        $('<p>').text('Player ' + id + ': ' + num + ' troops')
              .appendTo('<div>')
              .addClass('army')
              .appendTo('div.targetCountry');
      }
    }
  }


  return {
    timer : timer,
    player : player,
    standingArmies : standingArmies,
    activate : activate,
    deactivate : deactivate,
    target : target
  }


})();

$(document).ready(function(){

  $('.deactivate').on('click', function() {
    Game.handleClick();
  });

  $('div.targetCountry > .myArmy').blur(function(){
      var oldVal = parseInt($(this).attr('data-orig-value'));
      var val = parseInt($(this).html());
      var changeNumber = parseInt($('div.activeCountry > .myArmy').html());
      var newNum = val - oldVal;
          changeNumber -= newNum;
      if (changeNumber < 0) {
          console.log('You have run out of troops')
          $('div.targetCountry > .myArmy').html(oldVal);
      }
      if (changeNumber > 0 ) {
          $('div.activeCountry > .myArmy').text(changeNumber);
          var oldVal = $(this).attr('data-orig-value', val);

          var from = $('div.activeCountry').attr('data-name');
          var to = $('div.activeCountry').attr('data-name');
          Game.moveTroops(from, to, newNum)
      }
  });

});