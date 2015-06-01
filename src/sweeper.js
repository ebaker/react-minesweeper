// minesweeper goals
// - board with (height, width, numOfMines)
//   - [x] create board with no mines
//   - [x] create board with mine
//   - [x] randomly place mines
//   - [x] loop through each square without bomb and calculate value
//   - [x] handle squares on edges
// - insert #s surrounding block
//   - [x] insert 1 correct hint
// note: (0, 0) is top left
//
// Interview Followup Notes
// ------------------------------
// - *important* implement better number calculating algorithm:
//  0. have all empty squares be zero
//  1. place random bomb in square
//  3. increment all surrounding squares if they dont have bomb
// - clarify problem contraints
//  - how to represent empty sqaures?
// - edge cases 
//  - when 0 height or 0 width
//  - bombs < 0 or > num of squares
// - code clarity improvements
//  - move functions into sweeper object for api convention
//  - cleanup console log
//  - add tests for non random numbers

//var console = require('console-browserify');

module.exports = Sweeper = (function(){

  function Sweeper(height, width, numOfBombs) {
    if (!(this instanceof Sweeper)) {
      return new Sweeper();
    }
    this.height = height || 10;
    this.width = width || 10;
    this.numOfBombs = numOfBombs || 5;
    this.board = [];
    this.bombs = [];
    this.uncoveredCount = 0;
    this.clickCount = 0;
    this.game = {};
  };

  Sweeper.prototype.startGame = function(y, x){
    this.resetBoard();    
    var bombs = this.genRandSquares([y, x], this.numOfBombs)
    this.addBombsWithHints(bombs);
    this.game.started = new Date();
    this.uncover(y, x);
  };

  Sweeper.prototype.genRandSquares = function (excludeCoord, numSquaresOut){
    var numOfSquares = this.height * this.width
    if (numSquaresOut > numOfSquares - 1) return [];

    var i, j, counter = 0, bombs = [];
    var excludeSquare = excludeCoord[0] * this.height + excludeCoord[1];
    for (i = 0; i < numSquaresOut; i++){
      var passed = false;
      while (!passed){
        var bomb = Math.floor(Math.random() * (numOfSquares - 1) );
        if (bombs.indexOf(bomb) < 0  
            && (bomb != excludeSquare)) {
          bombs.push(bomb);
          break;
        }
      }
    }
    return bombs;
  };

  Sweeper.prototype.uncover = function(y, x){
    if (!this.game.started){
      this.startGame(y, x);
    }
    var that = this;
    var traverse = function(y, x){
      if (that.board[y][x] != undefined)
        return;
      that.board[y][x] = that._board[y][x];
      that.uncoveredCount++;
      if (that.board[y][x] == '*') {
        that.game.ended = new Date();
        return;
      } // lose game
      if (that.board[y][x] === 0){

        var l, checkX, checkY, hintCount = 0;
        var toCheck = [
                        [1, 0], [0, 1],
                        [1, 1], [-1, 0], 
                        [0, -1], [-1, -1], 
                        [-1, 1], [1, -1]
                       ];
        for (l = 0; l < toCheck.length; l++ ){
          checkY = y + toCheck[l][0];
          checkX = x + toCheck[l][1];
          if (checkY >= 0 && checkY <= that.height - 1 
              && checkX >= 0 && checkX <= that.width - 1){
              traverse(checkY, checkX);
          }
        }
      }     
     };
    traverse(y, x);
    var remaining = this.height * this.width - this.uncoveredCount;
    if (that.game.ended){
      return false;
    }
    if (this.numOfBombs === remaining){
      that.game.ended = new Date();
    }
    return true;
  };
  
  Sweeper.prototype.printBoard = function (){
    var i, j;
    for (i = 0; i < this.board.length; i++){
      console.log(this.board[i].join(''));
    }
  };
  
  Sweeper.prototype.addBombsWithHints = function (bombs){
    var i, j, counter = 0;
  
    // Add bombs and hints
    for (i = 0; i < this._board.length; i++){
      for(j = 0; j < this._board[i].length; j++){
        if (bombs.indexOf(counter) > -1){
          this._board[i][j] = '*';
          var l, checkX, checkY, hintCount = 0;
          var toCheck = [
                          [1, 0], [0, 1],
                          [1, 1], [-1, 0], 
                          [0, -1], [-1, -1], 
                          [-1, 1], [1, -1]
                         ];
          for (l = 0; l < toCheck.length; l++ ){
            checkY = i + toCheck[l][0];
            checkX = j + toCheck[l][1];
            if (checkY >= 0 && checkY <= this.height - 1 
                && checkX >= 0 && checkX <= this.width - 1){
              if (this._board[checkY][checkX] != '*'){
                var hint = this._board[checkY][checkX];
                hint++;
                this._board[checkY][checkX] = hint;
              }
            }
          }
        }
        counter++;
      }
    }
  };

  Sweeper.prototype.resetBoard = function(height, width, numOfBombs){
    var y, x;
    this.height = height || this.height;
    this.width = width || this.width;
    this.numOfBombs = numOfBombs || this.numOfBombs;
    this._board = [];
    this.board = [];
    this.game = {};
    this.uncoveredCount = 0;
    var that = this;
    for (y = 0; y < this.height; y++){
      var row = [], rowZero = [];
      for (x = 0; x < this.width; x++){
        row.push(undefined);
        rowZero.push(0);
      }
      that._board.push(rowZero);
      that.board.push(row);
    }
  };

  Sweeper.prototype.smokeTest = function(){
    return 'smoke test';
  };
  
  return Sweeper;
})();


