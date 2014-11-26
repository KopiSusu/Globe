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
      createArmy('div.standingArmies', army.name, army.num);
    } 
  }



  function activate(country) {
    $('div.activeCountry > .army').remove();

    $('div.activeCountry').animate({height: '0%'}, function() {
        var num = country.troops[_player.id] || 0;
        $(this).animate({height: '30%'});
        $('div.activeCountry').attr('country', country.name);
        $('div.activeCountry > .clickedCountry').text(country.name);
        $('div.activeCountry > .myArmy').text(num);
  
        // dynamic deactivate button
        $('div.activeCountry > h1').text('deactivate').toggleClass('deactivate').fadeIn(500);

        // update enemy troops in active country
        for (var id in country.troops) {
          if (id != _player.id) {
            var num = country.troops[id];
            $('<p>').text('P' + id + ' (' + num + ')')
                  .appendTo('<div>')
                  .addClass('army-enemy')
                  .appendTo('div.activeCountry');
          }
        }
    });
  }

  function deactivate() {
    $('#arrow-left').animate({opacity: '0'});
    $('#arrow-right').animate({opacity: '0'});
    $('div.activeCountry').animate({
        height: '0%',
      }, function() {
        $(this).animate({height: '30%'});
        $('div.activeCountry > h1').text('Active').toggleClass('deactivate');

    // $('div.activeCountry > h1').text('Active').toggleClass('deactivate');
        $('div.activeCountry > .army-enemy').remove();
        $('div.activeCountry > .clickedCountry').empty();
        $('div.activeCountry > .myArmy').text('');
        $('div.activeCountry').attr('country', '');

        $('div.targetCountry > .army-enemy').remove();
        $('div.targetCountry > .clickedCountry').empty();
        $('div.targetCountry > .myArmy').text('');
        $('div.targetCountry').attr('country', '');
    });
    $('div.targetCountry').animate({
        height: '0%',
      }, function() {
      $(this).animate({height: '30%'});
    });
  }

  function target(country) {
    $('div.targetCountry > .army').remove();
    $('#arrow-left').animate({opacity: '0'});
    $('#arrow-right').animate({opacity: '0'});

    $('div.targetCountry').animate({ height: '0%'}, function() {
        $(this).animate({height: '30%'});
        var num = country.troops[_player.id] || 0;
        $('#arrow-left').animate({opacity: '1'});
        $('#arrow-right').animate({opacity: '1'});
        $('div.targetCountry').attr('country', country.name);
        $('div.targetCountry > .clickedCountry').text(country.name);
        $('div.targetCountry > .myArmy').attr('data-orig-value', num).text(num);

        // update enemy troops in active country
        for (var id in country.troops) {
            if (id != _player.id) {
              var num = country.troops[id];
              $('<p>').text('P' + id + ' (' + num + ')')
                    .appendTo('<div>')
                    .addClass('army-enemy')
                    .appendTo('div.targetCountry');
            }
        }
    });
  }

  function update(data) {
    // TODO: implement infinite scroll in #systemBottom > .messages
    $('#systemBottom > .messages').empty();
    switch (data.type) {
      case 'disconnect':
        updateDisconnect(data.msg);
        break;
      case 'new player':
        updateNewPlayer(data.msg);
        break;
      case 'move':
        updateMove(data.msg);
        break;
    }
  }

  function updateDisconnect(msg) {
    var playerid = msg.player.id;
    var armies = msg.armies;
    $('<p>').text('P' + playerid + ' disconnected. Territories left empty: ')
      .appendTo('#systemBottom > .messages');
    for (var country in armies) {
      createArmy('#systemBottom > .messages', country, armies[country])
    }
  }

  function updateNewPlayer(msg) {
    var playerid = msg.player.id;
    var armies = msg.armies;
    $('<p>').text('P' + playerid + ' connected. Armies: ')
      .appendTo('#systemBottom > .messages');
    for (var country in armies) {
      createArmy('#systemBottom > .messages', country, armies[country])
    }
  }

  function updateMove(msg) {
    var id = msg.player.id;
    $('<p>').text('P' + id + ' just moved ' + msg.num + ' troops from: ').appendTo('#systemBottom > .messages');
    createArmy('#systemBottom > .messages', msg.from);
    $('<p>').text('TO').appendTo('#systemBottom > .messages');
    createArmy('#systemBottom > .messages', msg.to);
  }
  
  // use to append army object to any parent class in #scene
  function createArmy(selector, name, num) {
    var result = '';
    if (num) {
      result = $('<div>').text(name + ' (' + num + ')');
    }
    else if (!num) {
      result = $('<div>').text(name);
    }

    result.addClass('army').attr('country', name).appendTo(selector).fadeIn(1000);
  }

  return {
    timer : timer,
    player : player,
    standingArmies : standingArmies,
    activate : activate,
    deactivate : deactivate,
    target : target,
    update: update
  }


})();

$(function(){

  // button to deactivate active army
  $('.activeCountry').on('click', '.deactivate', function() {
    Game.handleClick();
  });

  $('#arrow-left').on('click', function(){
    console.log('inside arrow');
    var number = parseInt($('div.targetCountry > .myArmy').text());
        number -= 1;
    $('div.activeCountry > .myArmy').text(number);
  });

  $('div.targetCountry > .myArmy').blur(function(){
      var oldVal = parseInt($(this).attr('data-orig-value'));
      var val = parseInt($(this).html());
      var changeNumber = parseInt($('div.activeCountry > .myArmy').text());
      var newNum = val - oldVal;
          changeNumber -= newNum;
      if (changeNumber < 0) {
          $('div.targetCountry > .myArmy').html(oldVal);
      }
      if (changeNumber >= 0 ) {
          $('div.activeCountry > .myArmy').text(changeNumber);
          var oldVal = $(this).attr('data-orig-value', val);

          var from = $('div.activeCountry').attr('country');
          var to = $('div.targetCountry').attr('country');
          var player = domhandler.player();
          // send move to server
          socket.emit('move', JSON.stringify({ player : player,
                                                from : from,
                                                to : to,
                                                num : newNum }));

      }
  });

  // makes army divs click-able
  $('#scene').on('click', '.army', function(e) {
    var name = $(e.target).attr('country');
    Game.handleClick(name);
  })

});