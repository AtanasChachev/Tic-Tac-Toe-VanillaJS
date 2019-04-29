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
		var gridSquares = this.getSquaresElements(),
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
		isPlayerWinning ? this.renderPlayerScore() : this.renderComputerScore();
		this.startGameAgain();
	},
	checkComputerTurn() {
		this.getUnmarkedSquaresElements().length ? this.executeComputerMark() : this.startGameAgain()
	},
	executeComputerMark() {
		var _self = this;

		setTimeout(() => {
			_self.computerMark();

			if(_self.checkCombnations(_self.settings.computerMark)) {
				_self.gameEndCallbacks('computerScore', false);
			}
		}, _self.settings.cpMarkTimeDelay);
	},
	checkCombnations(mark) {
		var squares = this.getSquaresElements(),
				currentCombination = [],
				hasWinningCombination = false,
				_self = this;

		squares.forEach((el, index) => {
			if(el.classList.contains(mark)) currentCombination.push(index);
		});

		for(var i = 0 ; i < this.winningCombinations.length; i++) {
			if(_self.isWinningCombination(this.winningCombinations[i], currentCombination)) return hasWinningCombination = true;
		}
		
		return hasWinningCombination;
	},
	isWinningCombination(winningCombinations, currentCombination) {
		return winningCombinations.every(elem => currentCombination.indexOf(elem) > -1);
	},
	computerMark() {
		const _availableSquares = this.getUnmarkedSquaresElements(),
					item = _availableSquares[Math.floor(Math.random() * _availableSquares.length)],
					computerCheck = document.createElement('span'),
					_self = this;

		computerCheck.classList.add('sign-o');
		item.appendChild(computerCheck);
		item.classList.add('marked', _self.settings.computerMark);
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