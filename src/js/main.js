const ticTacToeController = {
	playerScore: 0,
	computerScore: 0,
	settings: {
		cpMarkTimeDelay: 500,
		rowsNumber: 3,
		squaresNumber: 3,
		playerMark: 'p-mark',
		computerMark: 'c-mark'
	},
	winningCombinations: [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 4, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 4, 6],
		[2, 5, 8]
  ],
  lastCPUPosition: null,
	init() {
		this.renderGrid();
		this.markArea();
		this.renderPlayerScore();
		this.renderComputerScore();
	},
	renderPlayerScore() {
		this.getPlayerScoreElement().innerHTML = this.playerScore;
	},
	renderComputerScore() {
		this.getComputerScoreElement().innerHTML = this.computerScore;
	},
	renderGrid() {
		for(let i = 0; i < this.settings.rowsNumber; i++) {
			const gridRow = document.createElement('div');
			gridRow.classList.add('tic-tac-row');

			for(let j = 0 ; j < this.settings.squaresNumber; j++) {
				const gridSquare = document.createElement('div');

				gridSquare.classList.add('tic-tac-square');
				gridRow.appendChild(gridSquare);
		 }

		 this.getGameHolder().appendChild(gridRow);
		}
	},
	markArea() {
		const gridSquares = this.getSquaresElements(),
				_self = this;

		gridSquares.forEach((element, index) => {
			element.addEventListener('click', () => {
				const checkedElement = document.createElement('span');

				checkedElement.classList.add('sign-x');
				element.appendChild(checkedElement);
				element.classList.add('marked', _self.settings.playerMark);

				if(_self.checkCombnations(_self.settings.playerMark)) {
					_self.gameEndCallbacks('playerScore', true);
				} else {
					_self.checkComputerTurn();
				}
			});
		});
	},
	gameEndCallbacks(score, isPlayerWinning) {
    this[score]++;
    this.lastCPUPosition = null;
		isPlayerWinning ? this.renderPlayerScore() : this.renderComputerScore();
		this.startGameAgain();
	},
	checkComputerTurn() {
		this.getUnmarkedSquaresElements().length ? this.executeComputerMark() : this.startGameAgain()
	},
	executeComputerMark() {
		const _self = this;

		setTimeout(() => {
			_self.computerMark();

			if(_self.checkCombnations(_self.settings.computerMark)) {
				_self.gameEndCallbacks('computerScore', false);
			}
		}, _self.settings.cpMarkTimeDelay);
	},
	checkCombnations(mark) {
		let squares = this.getSquaresElements(),
				currentCombination = [],
				hasWinningCombination = false,
				_self = this;

		squares.forEach((el, index) => {
			if(el.classList.contains(mark)) currentCombination.push(index);
    });

		for(let i = 0 ; i < this.winningCombinations.length; i++) {
			if(_self.isWinningCombination(this.winningCombinations[i], currentCombination)) return hasWinningCombination = true;
		}
		
		return hasWinningCombination;
	},
	isWinningCombination(winningCombinations, currentCombination) {
		return winningCombinations.every(elem => currentCombination.indexOf(elem) > -1);
	},
	computerMark() {
		const _availableSquares = this.getUnmarkedSquaresElements(),
					computerCheck = document.createElement('span'),
          squares = this.getSquaresElements(),
          _self = this;

    let item = null;
    let playerMarkIndexes = [];

    squares.forEach((el, index) => {
      if(el.classList.contains('p-mark')) {
        playerMarkIndexes.push(index);
      }
    });
    
    let winningCombos = [];

    playerMarkIndexes.forEach((el) => {
      if(winningCombos.length && winningCombos.length > 1) {
        winningCombos = this.filterCombosBasedOnPlayerMarks(winningCombos, el);
      } else if(!winningCombos.length) {
        winningCombos = this.filterCombosBasedOnPlayerMarks(this.winningCombinations, el);
      }
    });

    if(winningCombos.length) {
      if(winningCombos.length === 1) {
        if(squares[winningCombos[0][0]].classList.contains('marked')) {
          const _wb = this.filterCombosBasedOnPlayerMarks(this.winningCombinations, this.lastCPUPosition);
          item = this.filterAvailableComputerMarks(squares, _wb, _availableSquares);

        } else {
          item = squares[winningCombos[0][0]];
          this.lastCPUPosition = winningCombos[0][0];
        }
      } else {
        item = this.filterAvailableComputerMarks(squares, winningCombos, _availableSquares);
      }
    } else {
      const _wb = this.filterCombosBasedOnPlayerMarks(this.winningCombinations, this.lastCPUPosition);
      item = this.filterAvailableComputerMarks(squares, _wb, _availableSquares);
    }
    
    computerCheck.classList.add('sign-o');
		item.appendChild(computerCheck);
		item.classList.add('marked', _self.settings.computerMark);
  },
  filterAvailableComputerMarks(squares, arr, _availableSquares) {
    let elementFound = false,
        item = null;
          
    for(let i = 0; i < arr.length; i++) {
      for(let j = 0 ; j < arr[i].length; j++) {
        if(!elementFound) {
          if(!squares[arr[i][j]].classList.contains('marked')) {
            item = squares[arr[i][j]];
            this.lastCPUPosition = [...squares].indexOf(squares[arr[i][j]]);
            elementFound = true;
          }
        }
      }
    }

    if(!item) {
      let randomNum = Math.round(Math.random() * (_availableSquares.length - 1));
      item = _availableSquares[randomNum];
    }

    return item;
  },
  filterCombosBasedOnPlayerMarks(arr, el) {
    return arr.filter((comb) => comb.includes(el)).map((arr) => {
      const _arr = [...arr];
      const findIndex = _arr.findIndex((num) => num === el);
      _arr.splice(findIndex, 1);

      return _arr;
    });
  },
	startGameAgain() {
		this.getGameHolder().innerHTML = '';
		this.renderGrid();
		this.markArea();
	},
	getUnmarkedSquaresElements() {
		return document.querySelectorAll('.tic-tac-square:not(.marked)');	
	},
	getSquaresElements() {
		return document.querySelectorAll('.tic-tac-square');
	},
	getGameHolder() {
		return document.getElementById('game-holder');
	},
	getPlayerScoreElement() {
		return document.querySelector('.player-score');
	},
	getComputerScoreElement() {
		return document.querySelector('.computer-score');
	}
};

window.onload = () => ticTacToeController.init();