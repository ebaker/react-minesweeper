var Sweeper = require('./sweeper');
var React = require('react');

var App = React.createClass({
  getInitialState: function() {
    var sweeper = new Sweeper();
    sweeper.resetBoard();
    return {
      sweeper: sweeper,
      isFlag: false
      };
  },
  componentDidMount: function(){
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  },
  componentWillUnmount: function(){
    window.removeEventListener('keydown');
    window.removeEventListener('keyup');
  },
  resetBoard: function(y, x){
    var sweeper = this.state.sweeper;
    sweeper.resetBoard();
    this.setState({sweeper: sweeper});
  },
  handleTileClick: function(y, x){
    var sweeper = this.state.sweeper;
    if (!this.state.isFlag){
      if (!this.state.sweeper.game.started || this.state.sweeper.game.ended){
        sweeper.startGame(y, x);
        this.setState({sweeper: sweeper});
      }
      else {
        var uncovered = sweeper.uncover(y,x);
        this.setState({sweeper: sweeper});
        if (sweeper.game.ended){
          if (uncovered === false){
            alert('game lost');
          } 
          else{
            alert('game won');
          }
        }
      }
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
    console.log('sweeper', this.state.sweeper);
    return (
      <div>
        <h1>Minesweeper</h1>
        <div className='controls'>
          <div className='bombs'>{this.state.sweeper.numOfBombs}</div>
          <div className='btn new' onClick={this.resetBoard}>GO</div>
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
    for (y = 0; y < this.props.sweeper.board.length; y++){
      board.push(
        <Row 
          y={y} 
          row={this.props.sweeper.board[y]} 
          width={this.props.sweeper.width}
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
            squareCallback={this.props.squareCallback}
          />
        );
      }
    return <div className='row'>{row}</div>;
  }
});

var Square = React.createClass({
  handleClick: function(e){
    this.props.squareCallback(this.props.y, this.props.x);
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
    if (this.props.value != undefined){
      square = <div key={key} className='square'>{this.props.value}</div>;
    }
    return square;
  }
});

React.render(<App />, document.body);
