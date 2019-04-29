"use strict";

var ticTacToeController = {
  playerScore: 0,
  computerScore: 0,
  settings: {
    cpMarkTimeDelay: 500,
    rowsNumber: 3,
    squaresNumber: 3,
    playerMark: 'p-mark',
    computerMark: 'c-mark'
  },
  winningCombinations: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 4, 6], [2, 5, 8]],
  init: function init() {
    this.renderGrid();
    this.markArea();
    this.renderPlayerScore();
    this.renderComputerScore();
  },
  renderPlayerScore: function renderPlayerScore() {
    this.getPlayerScoreElement().innerHTML = this.playerScore;
  },
  renderComputerScore: function renderComputerScore() {
    this.getComputerScoreElement().innerHTML = this.computerScore;
  },
  renderGrid: function renderGrid() {
    for (var i = 0; i < this.settings.rowsNumber; i++) {
      var gridRow = document.createElement('div');
      gridRow.classList.add('tic-tac-row');

      for (var j = 0; j < this.settings.squaresNumber; j++) {
        var gridSquare = document.createElement('div');
        gridSquare.classList.add('tic-tac-square');
        gridRow.appendChild(gridSquare);
      }

      this.getGameHolder().appendChild(gridRow);
    }
  },
  markArea: function markArea() {
    var gridSquares = this.getSquaresElements(),
        _self = this;

    gridSquares.forEach(function (element, index) {
      element.addEventListener('click', function () {
        var checkedElement = document.createElement('span');
        checkedElement.classList.add('sign-x');
        element.appendChild(checkedElement);
        element.classList.add('marked', _self.settings.playerMark);

        if (_self.checkCombnations(_self.settings.playerMark)) {
          _self.gameEndCallbacks('playerScore', true);
        } else {
          _self.checkComputerTurn();
        }
      });
    });
  },
  gameEndCallbacks: function gameEndCallbacks(score, isPlayerWinning) {
    this[score]++;
    isPlayerWinning ? this.renderPlayerScore() : this.renderComputerScore();
    this.startGameAgain();
  },
  checkComputerTurn: function checkComputerTurn() {
    this.getUnmarkedSquaresElements().length ? this.executeComputerMark() : this.startGameAgain();
  },
  executeComputerMark: function executeComputerMark() {
    var _self = this;

    setTimeout(function () {
      _self.computerMark();

      if (_self.checkCombnations(_self.settings.computerMark)) {
        _self.gameEndCallbacks('computerScore', false);
      }
    }, _self.settings.cpMarkTimeDelay);
  },
  checkCombnations: function checkCombnations(mark) {
    var squares = this.getSquaresElements(),
        currentCombination = [],
        hasWinningCombination = false,
        _self = this;

    squares.forEach(function (el, index) {
      if (el.classList.contains(mark)) currentCombination.push(index);
    });

    for (var i = 0; i < this.winningCombinations.length; i++) {
      if (_self.isWinningCombination(this.winningCombinations[i], currentCombination)) return hasWinningCombination = true;
    }

    return hasWinningCombination;
  },
  isWinningCombination: function isWinningCombination(winningCombinations, currentCombination) {
    return winningCombinations.every(function (elem) {
      return currentCombination.indexOf(elem) > -1;
    });
  },
  computerMark: function computerMark() {
    var _availableSquares = this.getUnmarkedSquaresElements(),
        item = _availableSquares[Math.floor(Math.random() * _availableSquares.length)],
        computerCheck = document.createElement('span'),
        _self = this;

    computerCheck.classList.add('sign-o');
    item.appendChild(computerCheck);
    item.classList.add('marked', _self.settings.computerMark);
  },
  startGameAgain: function startGameAgain() {
    this.getGameHolder().innerHTML = '';
    this.renderGrid();
    this.markArea();
  },
  getUnmarkedSquaresElements: function getUnmarkedSquaresElements() {
    return document.querySelectorAll('.tic-tac-square:not(.marked)');
  },
  getSquaresElements: function getSquaresElements() {
    return document.querySelectorAll('.tic-tac-square');
  },
  getGameHolder: function getGameHolder() {
    return document.getElementById('game-holder');
  },
  getPlayerScoreElement: function getPlayerScoreElement() {
    return document.querySelector('.player-score');
  },
  getComputerScoreElement: function getComputerScoreElement() {
    return document.querySelector('.computer-score');
  }
};

window.onload = function () {
  return ticTacToeController.init();
};