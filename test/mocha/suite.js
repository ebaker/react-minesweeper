// mocha/suite.js

var Sweeper;
var boilerplate;

var assert;

if (typeof require == 'function') {

  // enable to re-use in a browser without require.js
  Sweeper = require('../../src/sweeper.js')
  assert =  require('assert');
}

var sweeper;

describe('sweeper', function() {
  before(function(){
    sweeper = new Sweeper();
  });
  it('smoke test should pass', function () {
    assert.equal(sweeper.smokeTest(), 'smoke test', 'failure message');
  });
  it('reset board', function() {
    sweeper.resetBoard(2, 2);
    var empty2x2 = [[undefined, undefined], [undefined, undefined]];
    assert.deepEqual(sweeper.board, empty2x2, '2x2 board not reset');
    sweeper.resetBoard();
    assert.deepEqual(sweeper.board, empty2x2, '2x2 default board not reset');
  });
  it('generates random coords', function(){
    var generated = sweeper.genRandSquares([0,0], 2);
    var max = sweeper.height * sweeper.width;
    generated.map(function(square){
      assert.equal(square > -1, true, 'square less than 0');
      assert.equal(square != 0, true, 'excluded square selected');
      assert.equal(square < max, true, 'square greater than max');
    });
  });
});
