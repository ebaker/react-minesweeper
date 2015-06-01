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

module.exports = Sweeper = (function(){

  function Sweeper() {
    if (!(this instanceof Sweeper)) {
      return new Sweeper();
    }
    this.height = 10;
    this.width = 10;
    this.board = [];
    this.bombs = [];
    this.uncovered = [];
    this.clickCount = 0;
    this.game = {};
    console.log('sweeper init');
  };

  Sweeper.prototype.createBoard = function(height, width){
    var i, j;
    var columns = [];
    var that = this;
    this.uncovered = [];
    for (i = 0; i < height; i++){
      that.uncovered.push([]);
      var row = [];
      for(j = 0; j < width; j++){
        row[j] = '0';
      }
      columns.push(row);
    }
    this.height = height;
    this.width = width;
    this.board = columns;
  };

  Sweeper.prototype.uncover = function(y, x){
    var that = this;
    var traverse = function(y, x){
      if (that.uncovered[y].indexOf(x) > -1)
        return;
      that.uncovered[y].push(x);
      if (that.board[y][x] == '*') {
        that.game.ended = new Date();
        return;
      } // lose game
      if (parseInt(that.board[y][x]) === 0){

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
  };
  
  Sweeper.prototype.printBoard = function (){
    var i, j;
    for (i = 0; i < this.board.length; i++){
      console.log(this.board[i].join(''));
    }
  };
  
  Sweeper.prototype.addBombs = function (numOfBombs){
    var numOfSquares = this.height * this.width;
    if (numOfBombs > numOfSquares) return false;
    var height = this.height;
    var width = this.width;
    var bombs = [];
    var i, j, counter = 0;
    for (i = 0; i < numOfBombs; i++){
      var passed = false;
      while (!passed){
        var bomb = Math.floor(Math.random() * (numOfSquares - 1) );
        if (bombs.indexOf(bomb) < 0) {
          bombs.push(bomb);
          break;
        }
      }
    }
    //console.log('bombs', bombs);
  
    for (i = 0; i < this.board.length; i++){
      for(j = 0; j < this.board[i].length; j++){
        if (bombs.indexOf(counter) > -1){
          this.board[i][j] = '*';
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
              if (checkY >= 0 && checkY <= height - 1 
                  && checkX >= 0 && checkX <= width - 1){
                  if (this.board[checkY][checkX] != '*'){
                    var hint = parseInt(this.board[checkY][checkX]);
                    hint++;
                    this.board[checkY][checkX] = hint.toString();
                  }
              }
            }
       }
        counter++;
      }
    }
    this.game.started = new Date();
  };
  
  Sweeper.prototype.addHints = function(){
    var i, j;
    for (i = 0; i < this.board.length; i++){
      var row = [];
      for(j = 0; j < this.board[i].length; j++){
        if (this.board[i][j] != '*'){
          var findHintValue = function (y, x){
            var l, checkX, checkY, hintCount = 0;
            var toCheck = [[1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [-1, -1], [-1, 1], [1, -1]];
            for (l = 0; l < toCheck.length; l++ ){
              checkY = y + toCheck[l][0];
              checkX = x + toCheck[l][1];
  
              // bounds check
              if (checkY >= 0 && checkY <= this.board.length - 1 && checkX >= 0 && checkX <= this.board[0].length - 1){
                // console.log('where i am now', y, x)
                // console.log('before', checkY, checkX);
                // console.log('checking', this.board[checkY][checkX]);
                if (this.board[checkY][checkX] === '*'){
                  hintCount++;
                }
              }
            }
            return hintCount;
          }
          this.board[i][j] = findHintValue(i, j);
        }
      }
    }
  };

  return Sweeper;
})();


