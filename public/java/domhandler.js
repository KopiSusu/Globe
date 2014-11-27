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

  // populate armies for current player
  function standingArmies(territories) {
    $('div.standingArmies').find('.army').remove();

    var i = territories.length;
    while (i--) {
      var t = territories[i];
      if (t.troops[_player.id]) {
          var name = t.name;
          var num = t.troops[_player.id];
          createArmy('div.standingArmies > .wrapper', name, num);
        }
    }
  }



  function activate(country) {
      // updating target/active status for other armies on page
      $('.army').removeClass('active');
      $('.army[country="'+country.name+'"]').addClass('active');

      // hide activeCountry section while making changes
      $('div.activeCountry > .wrapper').animate({height: '0%'}, function() {
          // removing existing enemy armies
          $('div.activeCountry').find('.army-enemy').remove();

          // updating country name
          $('div.activeCountry').attr('country', country.name);
          $('div.activeCountry .clickedCountry').text(country.name);

          // updating number of troops
          var num = country.troops[_player.id] || 0;
          $('div.activeCountry .myArmy').text(num);

          // add Deactivate button
          if ($('.deactivate').length < 1) {
            $('<div>').text('deactivate')
              .addClass('deactivate')
              .appendTo('div.activeCountry > .wrapper');
          }

          // fade in activeCountry section
          $('div.activeCountry > .wrapper').animate({height: '88%'}, function() {
              // update enemy troops in active country
              for (var id in country.troops) {
                  if (id != _player.id) {
                    var num = country.troops[id];
                    $('<p>').text('P' + id + ' (' + num + ')')
                          .appendTo('<div>')
                          .addClass('army-enemy')
                          .appendTo('div.activeCountry > .wrapper')
                          .fadeIn(1000);
                  }
              }
          });
      });
  }

  function deactivate() {

      $('.army').removeClass('active').removeClass('target');

      // hide section while making changes
      $('div.activeCountry > .wrapper').animate({height: '0%'}, function() {
          $('div.activeCountry .deactivate').remove();
          $('div.activeCountry').find('.army-enemy').remove();
          $('div.activeCountry .clickedCountry').empty();
          $('div.activeCountry .clickedCountry').text('click any country to start');
          $('div.activeCountry .myArmy').text('');
          $('div.activeCountry').attr('country', '');
          // show section
          $('div.activeCountry > .wrapper').animate({height: '88%'});
      });

      // fade out arrows
      $('.inc-arrow').animate({opacity: 0});
      $('.dec-arrow').animate({opacity: 0}, function() {

        // then hide section while making changes
        $('div.targetCountry > .wrapper').animate({height: '0%'}, function() {
          $('div.targetCountry').find('.army-enemy').remove();
          $('div.targetCountry .clickedCountry').empty();
          $('div.targetCountry .myArmy').text('');
          $('div.targetCountry').attr('country', '');
          // show section
          $('div.targetCountry > .wrapper').animate({height: '88%'});
        });
      });
  }

  function target(country) {

    // update active/target status for other armies on page
    $('.army').removeClass('target');
    $('.army[country="'+country.name+'"]').addClass('target');

    // fade out arrows first
    $('.inc-arrow').animate({opacity: '0'});
    $('.dec-arrow').animate({opacity: '0'}, function() {

      // hide target country section while making changes
      $('div.targetCountry > .wrapper').animate({height: '0%'}, function() {

          // remove existing enemy armies
          $('div.targetCountry').find('.army-enemy').remove();

          // updating country name
          $('div.targetCountry')
            .attr('country', country.name);
          $('div.targetCountry .clickedCountry')
            .text(country.name);

          // updating number of troops in country
          var num = country.troops[_player.id] || 0;
          $('div.targetCountry .myArmy')
            .attr('data-orig-value', num)
            .text(num);

          // show target country section
          $('div.targetCountry > .wrapper').animate({height: '88%'}, function() {

              // fade in arrows
              $('.inc-arrow').animate({opacity: '1'});
              $('.dec-arrow').animate({opacity: '1'});

              // update enemy troops in active country
              for (var id in country.troops) {
                if (id != _player.id) {
                  var num = country.troops[id];
                  $('<p>').text('P' + id + ' (' + num + ')')
                        .appendTo('<div>')
                        .addClass('army-enemy')
                        .appendTo('div.targetCountry > .wrapper')
                        .fadeIn(1000);
                  }
              }
          });
      });

    });

  }

  // public: handle game updates
  function update(data) {
    // TODO: implement infinite scroll in #systemBottom > .messages
    //$('#systemBottom > .messages').empty();
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

    //scroll to bottom of messages
    var divs = $('#systemBottom > .messages');
    divs.scrollTop(divs[0].scrollHeight);

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


  // deactivate button when there is active country
  $('.activeCountry').on('click', '.deactivate', function(e) {
    Game.handleClick();
  })

  $('.dec-arrow').on('click', function(){
    var targetNumber = parseInt($('div.targetCountry').find('.myArmy').text());
        targetNumber -= 1;
     if (targetNumber >= 0) {
      var activeNumber = parseInt($('div.activeCountry').find('.myArmy').text());
          activeNumber += 1;
      $('div.targetCountry .myArmy').text(targetNumber);
      $('div.activeCountry .myArmy').text(activeNumber);

      // send move to server
      var from = $('div.activeCountry').attr('country');
      var to = $('div.targetCountry').attr('country');
      var player = domhandler.player();
      socket.emit('move', JSON.stringify({ player : player,
                                            from : from,
                                            to : to,
                                            num : -1 }));
     }
  });

  $('.inc-arrow').on('click', function(){
    var targetNumber = parseInt($('div.targetCountry').find('.myArmy').text());
        targetNumber += 1;
    var activeNumber = parseInt($('div.activeCountry').find('.myArmy').text());
        activeNumber -= 1;
    if (activeNumber >= 0) {
      $('div.targetCountry .myArmy').text(targetNumber);
      $('div.activeCountry .myArmy').text(activeNumber);
      
      // send move to server
      var from = $('div.activeCountry').attr('country');
      var to = $('div.targetCountry').attr('country');
      var player = domhandler.player();
      socket.emit('move', JSON.stringify({ player : player,
                                            from : from,
                                            to : to,
                                            num : 1 }));
    }
  });

  $('div.targetCountry').find('.myArmy').blur(function(){
      var oldVal = parseInt($(this).attr('data-orig-value'));
      var val = parseInt($(this).html());
      var changeNumber = parseInt($('div.activeCountry').find('.myArmy').text());
      var newNum = val - oldVal;
          changeNumber -= newNum;
      if (changeNumber < 0) {
          $('div.targetCountry').find('.myArmy').html(oldVal);
      }
      if (changeNumber >= 0 ) {
          $('div.targetCountry').find('.myArmy').text(changeNumber);
          var oldVal = $(this).attr('data-orig-value', val);

          // send move to server
          var from = $('div.activeCountry').attr('country');
          var to = $('div.targetCountry').attr('country');
          var player = domhandler.player();
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