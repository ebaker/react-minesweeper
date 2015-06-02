// Initialize sweeper, height width optional
// var sweeper = new Sweeper(height, width);

module.exports = Sweeper = (function(){

  function Sweeper(height, width, numOfBombs) {
    if (!(this instanceof Sweeper)) {
      return new Sweeper();
    }

    // initialize board values
    this.height = height || 10;
    this.width = width || 10;
    this.numOfBombs = numOfBombs || 5;
    this.numFlags = this.numOfBombs;
    this.bombs = [];

    // board is public, _board should be private
    this.board = [];
    this._board = [];
    this.uncoveredCount = 0;

    // state of game (started, ended, status - win/lose)
    this.game = {};
  };

  // Reset board, setup bombs in squares other than first clicked
  Sweeper.prototype.startGame = function(y, x){
    this.resetBoard();    
    var bombs = this.genRandSquares([y, x], this.numOfBombs)
    this.addBombsWithHints(bombs);
    this.game.started = new Date();
    this.uncover(y, x);
  };

  // generates a value 0 - height * width, ignoring a coordinate (as array)
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

  // toggle flag to public board, indicate with -1
  Sweeper.prototype.toggleFlag = function(y, x){
    if (this.board[y][x] === undefined){
      if (this.numFlags < 1) return;
      this.board[y][x] = -1;
      this.numFlags--;
    }
    else if (this.board[y][x] === -1){
      this.board[y][x] = undefined;
      this.numFlags++;
    }
  };

  // show square, return game if ended
  Sweeper.prototype.uncover = function(y, x){

    // first click starts game
    if (!this.game.started){
      this.startGame(y, x);
    }
    var that = this;
    
    // traverse is needed to bubble out zero squares
    var traverse = function(y, x){
      if (that.board[y][x] != undefined)
        return;
      that.board[y][x] = that._board[y][x];
      that.uncoveredCount++;

      // lose game
      if (that.board[y][x] == '*') {
        that.game.ended = new Date();
      }

      // if value is zero, check square around until finding values
      if (that.board[y][x] === 0){
        var l, checkX, checkY, hintCount = 0;
        var toCheck = [[1, 0], [0, 1],
                        [1, 1], [-1, 0], 
                        [0, -1], [-1, -1], 
                        [-1, 1], [1, -1]];
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

    // check if game has lost, return game
    if (that.game.ended){
      that.game.status = 'lost';
      return that.game;
    }

    // check if game has been won, return game
    var remaining = this.height * this.width - this.uncoveredCount;
    if (this.numOfBombs === remaining){
      that.game.ended = new Date();
      that.game.status = 'won';
      return that.game
    }
    return undefined;
  };
  
  // console print board
  Sweeper.prototype.printBoard = function (){
    var i, j;
    for (i = 0; i < this.board.length; i++){
      console.log(this.board[i].join(''));
    }
  };
  
  // with list of bombs, add to board along with hints
  Sweeper.prototype.addBombsWithHints = function (bombs){
    var i, j, counter = 0;
  
    // Add bombs and hints
    for (i = 0; i < this._board.length; i++){
      for(j = 0; j < this._board[i].length; j++){
        if (bombs.indexOf(counter) > -1){
          this._board[i][j] = '*';
          var l, checkX, checkY, hintCount = 0;
          var toCheck = [[1, 0], [0, 1],
                          [1, 1], [-1, 0], 
                          [0, -1], [-1, -1], 
                          [-1, 1], [1, -1]];
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

  // reset board to empty with optional new height, width, numOfBombs
  Sweeper.prototype.resetBoard = function(height, width, numOfBombs){
    var y, x;
    this.height = height || this.height;
    this.width = width || this.width;
    this.numOfBombs = numOfBombs || this.numOfBombs;
    this.numFlags = this.numOfBombs;
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

  // setup test with smoke test
  Sweeper.prototype.smokeTest = function(){
    return 'smoke test';
  };
  
  return Sweeper;
})();


