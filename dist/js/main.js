"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
  lastCPUPosition: null,
  init: function init() {
    console.log('init');
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
    this.lastCPUPosition = null;
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
    var _this = this;

    var _availableSquares = this.getUnmarkedSquaresElements(),
        computerCheck = document.createElement('span'),
        squares = this.getSquaresElements(),
        _self = this;

    var item = null;
    var playerMarkIndexes = [];
    squares.forEach(function (el, index) {
      if (el.classList.contains('p-mark')) {
        playerMarkIndexes.push(index);
      }
    });
    var winningCombos = [];
    playerMarkIndexes.forEach(function (el) {
      if (winningCombos.length && winningCombos.length > 1) {
        winningCombos = _this.filterCombosBasedOnPlayerMarks(winningCombos, el);
      } else if (!winningCombos.length) {
        winningCombos = _this.filterCombosBasedOnPlayerMarks(_this.winningCombinations, el);
      }
    });

    if (winningCombos.length) {
      if (winningCombos.length === 1) {
        if (squares[winningCombos[0][0]].classList.contains('marked')) {
          var _wb = this.filterCombosBasedOnPlayerMarks(this.winningCombinations, this.lastCPUPosition);

          item = this.filterAvailableComputerMarks(squares, _wb, _availableSquares);
        } else {
          item = squares[winningCombos[0][0]];
          this.lastCPUPosition = winningCombos[0][0];
        }
      } else {
        item = this.filterAvailableComputerMarks(squares, winningCombos, _availableSquares);
      }
    } else {
      var _wb2 = this.filterCombosBasedOnPlayerMarks(this.winningCombinations, this.lastCPUPosition);

      item = this.filterAvailableComputerMarks(squares, _wb2, _availableSquares);
    }

    computerCheck.classList.add('sign-o');
    item.appendChild(computerCheck);
    item.classList.add('marked', _self.settings.computerMark);
  },
  filterAvailableComputerMarks: function filterAvailableComputerMarks(squares, arr, _availableSquares) {
    var elementFound = false,
        item = null;

    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        if (!elementFound) {
          if (!squares[arr[i][j]].classList.contains('marked')) {
            item = squares[arr[i][j]];
            this.lastCPUPosition = _toConsumableArray(squares).indexOf(squares[arr[i][j]]);
            elementFound = true;
          }
        }
      }
    }

    if (!item) {
      var randomNum = Math.round(Math.random() * (_availableSquares.length - 1));
      item = _availableSquares[randomNum];
    }

    return item;
  },
  filterCombosBasedOnPlayerMarks: function filterCombosBasedOnPlayerMarks(arr, el) {
    return arr.filter(function (comb) {
      return comb.includes(el);
    }).map(function (arr) {
      var _arr = _toConsumableArray(arr);

      var findIndex = _arr.findIndex(function (num) {
        return num === el;
      });

      _arr.splice(findIndex, 1);

      return _arr;
    });
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