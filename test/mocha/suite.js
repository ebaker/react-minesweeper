// mocha/suite.js

let Sweeper;
let boilerplate;

let assert;

if (typeof require == 'function') {

  // enable to re-use in a browser without require.js
  Sweeper = require('../../src/sweeper.js')
  assert =  require('assert');
}

let sweeper;

describe('sweeper', () => {

  before(() => {
    sweeper = new Sweeper();
  });

  it('smoke test should pass', () => {
    assert.equal(sweeper.smokeTest(), 'smoke test', 'failure message');
  });

  it('should reset board', () => {
    sweeper.resetBoard(2, 2);
    let empty2x2 = [[undefined, undefined], [undefined, undefined]];

    assert.deepEqual(sweeper.board, empty2x2, '2x2 board not reset');
    sweeper.resetBoard();
    assert.deepEqual(sweeper.board, empty2x2, '2x2 default board not reset');
  });

  it('should generates random bounded coords', () => {
    const generated = sweeper.genRandSquares([0,0], 2);
    const max = sweeper.height * sweeper.width;
 
    generated.map((square) => {
      assert.equal(square > -1, true, 'square less than 0');
      assert.equal(square != 0, true, 'excluded square selected');
      assert.equal(square < max, true, 'square greater than max');
    });
  });

  it('should add one bomb with hints to 2x2', () => {
    const bombs = [1];
    const check2x2Board = [
      [ 1, '*' ],
      [ 1,  1  ]
    ];

    assert.equal(bombs.length, 1);

    sweeper.resetBoard(2, 2);
    sweeper.addBombsWithHints(bombs);

    assert.deepEqual(sweeper._board, check2x2Board, '2x2 one bomb');
  });

  it('should add two bombs with hints to 3x3', () => {
    const bombs = [2, 8];
    const check3x3Board = [
      [0, 1, '*'],
      [0, 2,  2 ],
      [0, 1, '*']
    ];

    assert.equal(bombs.length, 2);

    sweeper.resetBoard(3, 3);
    sweeper.addBombsWithHints(bombs);

    assert.deepEqual(sweeper._board, check3x3Board, '3x3 two bombs');
  });

  it('should add eleven bombs with hints to 5x5', () => {
    const bombs = [1, 2, 3, 6, 8, 9, 11, 12, 13, 18, 19];
    const check3x3Board = [
      [2, '*', '*', '*',  3  ],
      [3, '*',  8 , '*', '*' ],
      [2, '*', '*', '*',  5  ],
      [1,  2 ,  4 , '*', '*' ],
      [0,  0 ,  1,   2 ,  2  ]
    ];

    assert.equal(bombs.length, 11);

    sweeper.resetBoard(5, 5);
    sweeper.addBombsWithHints(bombs);

    assert.deepEqual(sweeper._board, check3x3Board, '5x5 eleven bombs');
  });
});
