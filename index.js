(function () {

  var SERVER_URL = 'https://staging.penchat.net/pen-server-simon';
  var BOT_PREFIX = '/challenge/bot/qJ1Yi';

  var board = [];
  var gameId = 0;
  var leftErr = false;
  var rightErr = false;
  var upErr = false;
  var downErr = false;
  var gameOver = false;

  $(document).ready(function () {
    render();
    $('#start-btn').click(start);
  });

  function render() {
    setTimeout(function () {
      $('#board-container').html('<table id="board"></table>');
      for (var i = 0; i < board.length; i++) {
        $('#board').append('<tr>');
        for (var j = 0; j < board[i].length; j++) {
          $('#board').append('<td>' + board[i][j] + '</td>');
        }
        $('#board').append('</tr>');
      }
    }, 4);
  }

  function start() {
    gameOver = false;
    $('#start-btn').attr('disabled', true);
    $.ajax({
        dataType: 'json',
        method: 'POST',
        async: false,
        url: SERVER_URL + BOT_PREFIX + '/start'
      })
      .done(function (response) {
        board = response.field;
        render();
        gameId = response.gameId;
        alg();
      })
      .fail(errorResponseCallback);
  }

  function right() {
    console.log('moving right →');
    $.ajax({
        dataType: 'json',
        method: 'POST',
        async: false,
        url: SERVER_URL + BOT_PREFIX + '/game/' + gameId +
          '/move?instruction=R'
      })
      .done(function (response) {
        doneResonseCallback(response);
        leftErr = false;
      })
      .fail(function (error) {
        errorResponseCallback(error);
        rightErr = true;
      });
  }

  function left() {
    console.log('moving left ←');
    $.ajax({
        dataType: 'json',
        method: 'POST',
        async: false,
        url: SERVER_URL + BOT_PREFIX + '/game/' + gameId +
          '/move?instruction=L'
      })
      .done(function (response) {
        doneResonseCallback(response);
        rightErr = false;
      })
      .fail(function (error) {
        errorResponseCallback(error);
        leftErr = true;
      });
  }

  function up() {
    console.log('moving up ↑');
    $.ajax({
        dataType: 'json',
        method: 'POST',
        async: false,
        url: SERVER_URL + BOT_PREFIX + '/game/' + gameId +
          '/move?instruction=U'
      })
      .done(function (response) {
        doneResonseCallback(response);
        downErr = false;
      })
      .fail(function (error) {
        errorResponseCallback(error);
        upErr = true;
      });
  }

  function down() {
    console.log('moving down ↓');
    $.ajax({
        dataType: 'json',
        method: 'POST',
        async: false,
        url: SERVER_URL + BOT_PREFIX + '/game/' + gameId +
          '/move?instruction=D'
      })
      .done(function (response) {
        doneResonseCallback(response);
        upErr = false;
      })
      .fail(function (error) {
        errorResponseCallback(error);
        downErr = true;
      });
  }

  function alg() {
    var gameInterval = setInterval(function algorythm() {
      if (gameOver) clearInterval(gameInterval);
      right();
      down();
      if (rightErr && downErr) left();
      else if (leftErr) {
        up();
        down();
      }
      if (rightErr && downErr && leftErr && upErr) gameOverFunc();
    }, 4);
  }

  function algOld() {
    var gameInterval = setInterval(function algorythm() {
      if (gameOver) clearInterval(gameInterval);
      right();
      down();
      if (!rightErr) right();
      else if (!downErr) down();
      else if (!leftErr) left();
      else {
        up();
        down();
      }
      if (rightErr && downErr && leftErr && upErr) gameOverFunc();
    }, 4);
  }

  function gameOverFunc() {
    alert('Game Over!');
    gameOver = true;
    $('#start-btn').removeAttr('disabled');
  }

  function doneResonseCallback(response) {
    board = response.field;
    render();
  }

  function errorResponseCallback(error) {
    console.log(error);
    if (error.status == 500) {
      console.log('Can\'t move');
    }
    if (error.status == 410) {
      gameOverFunc();
    }
  }

})();