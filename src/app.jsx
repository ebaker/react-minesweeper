var Sweeper = require('./sweeper');

var App = React.createClass({
  getInitialState: function() {
    return {
      sweeper: new Sweeper()
      };
  },
  componentDidMount: function(){
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
        <h1>App</h1>
        <button onClick={this.startNewGame}>New</button>
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
      board.push(<Row y={y} row={this.props.sweeper.board[y]} />);
    }
    return <div className='board'>{board}</div>;
  }
});

var Row = React.createClass({
  render: function(){
    var x, row = [];
      for (x = 0; x < this.props.row.length; x++){
        row.push(<Square x={x} y={this.props.y} value={this.props.row[x]} />);
      }
    return <div className='row'>{row}</div>;
  }
});

var Square = React.createClass({
  render: function(){
    return <div className='square'>{this.props.value}</div>;
  }
});

React.render(<App />, document.body);
