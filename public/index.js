var player1press, player2press;

document.addEventListener('DOMContentLoaded', function() {

  var state = {
    stage: 'start',
    player1Button: document.getElementById('player-1-button'),
    player2Button: document.getElementById('player-2-button'),
    player1Alert: document.getElementById('player-1-alert'),
    player2Alert: document.getElementById('player-2-alert'),
    player1Score: document.getElementById('player-1-score'),
    player2Score: document.getElementById('player-2-score'),
    player1Points: 0,
    player2Points: 0,
    player1Ready: false,
    player2Ready: false,
    player1Blackjack: false,
    player2Blackjack: false,
    player1Busted: false,
    player2Busted: false,
    deliberationFlag: false
  };

  var deliberationTimeout;

  function pressHandler(player, stage) {
    switch (stage) {
      case 'start':
        startFunc(player);
        break;
      case 'ready':
        break;
      case 'playing':
        playingFunc(player);
        break;
      case 'gameover':
        break;
      default:
        console.log("switch case expression did not match any case");
    }
  }

  function newRound() {
    state.stage = 'start';
    state.player1Alert.innerHTML = 'Ready?';
    state.player2Alert.innerHTML = 'Ready?';
    state.player1Points = 0;
    state.player2Points = 0;
    state.player1Ready = false;
    state.player2Ready = false;
    state.player1Blackjack = false;
    state.player2Blackjack = false;
    state.player1Busted = false;
    state.player2Busted = false;
    state.deliberationFlag = false;
    applyAlertClass(state.player1Alert, 'alert-warning');
    applyAlertClass(state.player2Alert, 'alert-warning');
    applyButtonClass(state.player1Button, 'btn-primary');
    applyButtonClass(state.player2Button, 'btn-primary');
  }

  function startFunc(player) {
    if (!state['player' + player + 'Ready']) {
      state['player' + player + 'Ready'] = true;
      state['player' + player + 'Alert'].innerHTML = 'READY!';
      applyAlertClass(state['player' + player + 'Alert'], 'alert-success');
      applyButtonClass(state['player' + player + 'Button'], 'btn-secondary');
    }
    if (state.player1Ready && state.player2Ready) {
      state.stage = 'ready';
      readyFunc();
    }
  }

  function readyFunc(player) {
    var countTime = 5;
    applyAlertClass(state.player1Alert, 'alert-info');
    applyAlertClass(state.player2Alert, 'alert-info');
    state.player1Alert.innerHTML = countTime;
    state.player2Alert.innerHTML = countTime;
    countdown(countTime);
  }

  function countdown(count) {
    setTimeout(function() {
      if (count > 1) {
        count--;
        state.player1Alert.innerHTML = count;
        state.player2Alert.innerHTML = count;
        countdown(count);
      } else {
        state.player1Alert.innerHTML = 'GO!';
        state.player2Alert.innerHTML = 'GO!';
        applyAlertClass(state.player1Alert, 'alert-primary');
        applyAlertClass(state.player2Alert, 'alert-primary');
        applyButtonClass(state.player1Button, 'btn-primary');
        applyButtonClass(state.player2Button, 'btn-primary');
        state.stage = 'playing';
      }
    }, 1000);
  }

  function playingFunc(player) {
    if (state['player' + player + 'Points'] === 20) {
      state['player' + player + 'Blackjack'] = true;

      if (!state.deliberationFlag) {
        state.deliberationFlag = true;
        deliberationTime(player);
      }
    } else if (state['player' + player + 'Points'] > 20) {
      state['player' + player + 'Busted'] = true;

      clearTimeout(deliberationTimeout);
      gameoverFunc(player == 1 ? 2 : 1);
    }
    state['player' + player + 'Points']++;
    state['player' + player + 'Alert'].innerHTML = state['player' + player + 'Points'];
  }

  function deliberationTime(player) {
    deliberationTimeout = setTimeout(function deliberating() {
      gameoverFunc(player);
    }, 500);
  }

  function gameoverFunc(winner) {
    state.stage = 'gameover';
    var loser = winner == 1 ? 2 : 1;
    applyAlertClass(state['player' + winner + 'Alert'], 'alert-success');
    applyAlertClass(state['player' + winner + 'Button'], 'btn-success');

    applyAlertClass(state['player' + loser + 'Alert'], 'alert-danger');
    applyAlertClass(state['player' + loser + 'Button'], 'btn-danger');

    state['player' + winner + 'Score'].innerHTML++;
    setTimeout(function() {
      alert('Player ' + winner + ' Wins!!!');
      newRound();
    }, 200);
  }

  function applyAlertClass(elem, classToAdd) {
    elem.classList.remove('alert-warning', 'alert-success', 'alert-primary', 'alert-danger', 'alert-info');
    elem.classList.add(classToAdd);
  }

  function applyButtonClass(elem, classToAdd) {
    elem.classList.remove('btn-warning', 'btn-success', 'btn-primary', 'btn-danger', 'btn-secondary');
    elem.classList.add(classToAdd);
  }

  player1press = function player1press() {
    pressHandler(1, state.stage);
  };

  player2press = function player2press() {
    pressHandler(2, state.stage);
  };

  function keyupFunc(event) {
    if (event.key === 'd') {
      player1press();
    } else if (event.key === 'k') {
      player2press();
    }
  }

  document.addEventListener('keyup', keyupFunc);
});