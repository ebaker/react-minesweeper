var Sweeper = require('./sweeper');
var React = require('react');

var App = React.createClass({
  getInitialState: function() {
    return {
      sweeper: new Sweeper(),
      isFlag: false
      };
  },
  componentDidMount: function(){
    console.log('sweeper', this.state.sweeper);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    return this.startNewGame();
  },
  componentWillUnmount: function(){
    window.removeEventListener('keydown');
    window.removeEventListener('keyup');
  },
  startNewGame: function(){
    var sweeper = this.state.sweeper;
    sweeper.createBoard(this.state.sweeper.height, this.state.sweeper.width);
    sweeper.addBombs(5);
    this.setState({sweeper: sweeper});
  },
  handleTileClick: function(y, x){
    var sweeper = this.state.sweeper;
    if (!this.state.isFlag){
      sweeper.uncover(y,x);
      console.log('tile click', y, x);
      this.setState({sweeper: sweeper});
    }
  },
  handleKeyUp: function(e){
    if (e.keyCode != 16) return;
    this.setState({isFlag: false});
    console.log('up', e);
  },
  handleKeyDown: function(e){
    if (e.keyCode != 16) return;
    e.preventDefault();
    this.setState({isFlag: true});
    console.log('down', e);
  },
  render: function() {
    return (
      <div>
        <h1>Minesweeper</h1>
        <div className='controls'>
          <div className='btn new' onClick={this.startNewGame}>New</div>
        </div>
        <Board 
          sweeper={this.state.sweeper} 
          squareCallback={this.handleTileClick} 
        />
      </div>
    );
  }
});

var Board = React.createClass({
  render: function() {
    var y, board = [];
    console.log('board', this.props.sweeper);
    for (y = 0; y < this.props.sweeper.board.length; y++){
      board.push(
        <Row 
          y={y} 
          row={this.props.sweeper.board[y]} 
          width={this.props.sweeper.width}
          uncovered={this.props.sweeper.uncovered} 
          squareCallback={this.props.squareCallback}
        />
      );
    }
    return <div className='board'>{board}</div>;
  }
});

var Row = React.createClass({
  render: function(){
    var x, row = [];
      for (x = 0; x < this.props.width; x++){
        row.push(
          <Square 
            x={x}
            y={this.props.y}
            value={this.props.row[x]} 
            uncovered={this.props.uncovered} 
            squareCallback={this.props.squareCallback}
          />
        );
      }
    return <div className='row'>{row}</div>;
  }
});

var Square = React.createClass({
  handleClick: function(e){
    console.log('click', e);
    this.props.squareCallback(this.props.y, this.props.x);
  },
  onMouseDown: function(e){
    console.log('mousedown', e);
    if (e.button !== 0) return;
    else console.log('button', e.button);
  },
  render: function(){
    var key = this.props.y+'_'+this.props.x;
    var square = (
      <div 
        key={key} 
        y={this.props.y}
        x={this.props.x}
        className='square empty' 
        onClick={this.handleClick}
      />
    );
    if (this.props.uncovered.length > this.props.y){
      if (this.props.uncovered[this.props.y]){
        if (this.props.uncovered[this.props.y].indexOf(this.props.x) > -1){
          square = <div key={key} className='square'>{this.props.value}</div>;
        }
      }
    }
    return square;
  }
});

React.render(<App />, document.body);
