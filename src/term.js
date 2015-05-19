var Sweeper = require('./src/sweeper');
var s = new Sweeper();

var height = 10;
var width = 10;

console.log('sweeper', s);

s.createBoard(height, width);
s.addBombs(5);
// s.addHints();
s.printBoard();
