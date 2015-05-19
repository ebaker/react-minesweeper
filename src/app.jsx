var Sweeper = require('./sweeper');

var App = React.createClass({
  getInitialState: function() {
    return {
      sweeper: new Sweeper()
      };
  },
  componentDidMount: function(){
    console.log('sweeper', this.state.sweeper);
    return this.startNewGame();
  },
  startNewGame: function(){
    var sweeper = this.state.sweeper;
    sweeper.createBoard(this.state.sweeper.height, this.state.sweeper.width);
    sweeper.addBombs(5);
    this.setState({sweeper: sweeper});
  },
  render: function() {
    return (
      <div>
        <h1>Minesweeper</h1>
        <div className='controls'>
          <div className='btn new' onClick={this.startNewGame}>New</div>
        </div>
        <Board sweeper={this.state.sweeper}/>
      </div>
    );
  }
});

var Board = React.createClass({
  render: function() {
    var y, board = [];
    console.log('board', this.props.sweeper);
    for (y = 0; y < this.props.sweeper.board.length; y++){
      board.push(<Row y={y} row={this.props.sweeper.board[y]} uncovered={this.props.sweeper.uncovered} />);
    }
    return <div className='board'>{board}</div>;
  }
});

var Row = React.createClass({
  render: function(){
    var x, row = [];
      for (x = 0; x < this.props.row.length; x++){
        row.push(<Square x={x} y={this.props.y} value={this.props.row[x]} uncovered={this.props.uncovered} />);
      }
    return <div className='row'>{row}</div>;
  }
});

var Square = React.createClass({
  render: function(){
    var key = this.props.y+'_'+this.props.x;
    if (this.props.uncovered.length > this.props.y){
      if (this.props.uncovered[this.props.y]){
        if (this.props.uncovered[this.props.y].indexOf(this.props.x) > -1){
          return <div key={key} className='square'>{this.props.value}</div>;
        }
      }
    }
    return <div key={key} className='square empty'></div>;
  }
});

React.render(<App />, document.body);
