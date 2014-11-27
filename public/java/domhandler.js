var domhandler = (function() {

 var _timer = '';
 var _player = '';

  // set or read current player
  function player(player) {
    if (player) {
      _player = player;
    }
    $('div#title').text('Player ' + _player.id);
    return _player;
  }

  function timer(n) {
    var turnLength = n || 0;

    clearInterval(_timer);
    $('#timer').text(turnLength);
    _timer = setInterval(triggerCountDown, 1000);

  }
  
  function triggerCountDown() {
    var current = $('#timer').text();
    if (current > 0) {
      current--;
      $('#timer').text(current);
    }
  }

  // populate armies belonging to current player
  function standingArmies(armies) {

    $('div.standingArmies > .army').remove();

    var i = armies.length;
    while (i--) {
      army = armies[i]
      createArmy('div.standingArmies', army.name, army.num);
    } 
  }



  function activate(country) {
    $('div.activeCountry > .army').remove();

    $('.army').removeClass('active');
    $('.army[country="'+country.name+'"]').addClass('active');

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

    $('.army').removeClass('active').removeClass('target');

    $('div.activeCountry').animate({
        height: '0%',
      }, function() {
        $(this).animate({height: '30%'});
        $('div.activeCountry > h1').text('Active').toggleClass('deactivate');

        $('div.activeCountry > .army-enemy').remove();
        $('div.activeCountry > .clickedCountry').empty().text('click any country to start');
        $('div.activeCountry > .myArmy').text('');
        $('div.activeCountry').attr('country', '');

        $('div.targetCountry > .army-enemy').remove();
        $('div.targetCountry > .clickedCountry').empty();
        $('div.targetCountry > .myArmy').text('');
        $('div.targetCountry').attr('country', '');
    });
    var empty = $('div.targetCountry > .myArmy').text();
    if (empty) {
      $('div.targetCountry').animate({
          height: '0%',
        }, function() {
        $(this).animate({height: '30%'});
      });
    }
  }

  function target(country) {
    $('div.targetCountry > .army').remove();
    $('#arrow-left').animate({opacity: '0'});
    $('#arrow-right').animate({opacity: '0'});

    $('.army').removeClass('target');
    $('.army[country="'+country.name+'"]').addClass('target');

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

  // public: handle game updates
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
      default:
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

    if (msg.num < 0) {
      var from = msg.to;
      var to = msg.from;
    }
    else {
      var from = msg.from;
      var to = msg.to;
    }

    var num = Math.abs(Number(msg.num));

    $('<p>').text('P' + id + ' just moved ' + num + ' troops from: ').appendTo('#systemBottom > .messages');
    createArmy('#systemBottom > .messages', from);
    $('<p>').text('TO').appendTo('#systemBottom > .messages');
    createArmy('#systemBottom > .messages', to);
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
    $('<div class="armyButton">').appendTo(result);
    $('<div class="insideButton">').appendTo(result);
    result.addClass('army').attr('country', name).appendTo(selector).fadeIn(1000);
  }

  return {
    timer : timer,
    player : player,
    standingArmies : standingArmies,
    activate : activate,
    deactivate : deactivate,
    target : target,
    update: update,
  }


})();

$(function(){
  // button to deactivate active army

  $('#arrow-left').on('click', function(){
    console.log('inside arrow');
    var targetNumber = parseInt($('div.targetCountry > .myArmy').text());
        targetNumber -= 1;
    var activeNumber = parseInt($('div.activeCountry > .myArmy').text());
        activeNumber += 1;
    $('div.targetCountry > .myArmy').text(targetNumber);
    $('div.activeCountry > .myArmy').text(activeNumber);
  });

  $('#arrow-right').on('click', function(){
    console.log('inside arrow');
    var targetNumber = parseInt($('div.targetCountry > .myArmy').text());
        targetNumber += 1;
    var activeNumber = parseInt($('div.activeCountry > .myArmy').text());
        activeNumber -= 1;
    $('div.targetCountry > .myArmy').text(targetNumber);
    $('div.activeCountry > .myArmy').text(activeNumber);
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

  // prevent enter key on content editable
  $('.myArmy').on( 'keydown', function( e ) {
    if( e.which == 13 && e.shiftKey == false ) {
        $(this).blur();
        return false;
    }
  } );

  // makes army divs click-able
  $('#scene').on('click', '.army', function(e) {
    var name = $(e.target).attr('country');
    Game.handleClick(name);
  })

});