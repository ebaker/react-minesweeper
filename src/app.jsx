var Sweeper = require('./sweeper');
var React = require('react');

var App = React.createClass({
  getInitialState: function() {
    var sweeper = new Sweeper();
    sweeper.resetBoard();
    return {
      sweeper: sweeper,
      isFlag: false,
      timer: 0
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
    if (this.state.timeoutId){
      clearTimeout(this.state.timeoutId);
      this.setState({timeoutId: undefined});
    }
    var sweeper = this.state.sweeper;
    sweeper.resetBoard();
    this.setState({sweeper: sweeper, timer: 0});
  },
  startTimer: function() {
    var that = this;
    var tick = function() {
      if (!that.state.sweeper.game.ended){
        that.setState({timer: that.state.timer + 1});
        var timeoutId = setTimeout(tick, 1000);
        that.setState({timeoutId: timeoutId});
      }
    };
    tick();
  },
  handleTileClick: function(y, x){
    var sweeper = this.state.sweeper;
    if (!this.state.isFlag){
      if (!this.state.sweeper.game.started || this.state.sweeper.game.ended){
        sweeper.startGame(y, x);
        this.startTimer();    
        this.setState({sweeper: sweeper});
      }
      else {
        var game = sweeper.uncover(y,x);
        this.setState({sweeper: sweeper});
         if (game){
          var msg = 'game ' + game.status;
          setTimeout(function(){
            alert(msg);
          }, 100);
        }
      }
    }
    else{
      if (!this.state.sweeper.game.started) return;
      console.log('toogleflag');
      sweeper.toggleFlag(y, x);
      this.setState({sweeper: sweeper});
    }
  },
  handleKeyUp: function(e){
    if (e.keyCode != 16) return;
    e.preventDefault();
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
    var icon = <i className='icon-emo-happy' />;
    if (this.state.sweeper.game.ended){
      if (this.state.sweeper.game.status === 'lost'){
        icon = <i className='icon-emo-unhappy' />;
      }
    }
    return (
      <div>
        <h1>Minesweeper</h1>
        <div className='controls'>
          <div className='bombs'>{this.state.sweeper.numFlags}</div>
          <div className='btn new' onClick={this.resetBoard}>{icon}</div>
          <div className='timer'>{this.state.timer}</div>
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
      var value = this.props.value > 0 ? this.props.value : '';
      var className = 'square _' + value;
      var inner = value;
      if (this.props.value === '*'){
        className = className + ' bomb';
        inner = <i className='icon-bomb' />
      }
      else if (this.props.value === -1){
        className = className + ' flag';
        inner = <i className='icon-flag' />
      }
      square = (
        <div key={key} className={className} onClick={this.handleClick}>
          {inner}
        </div>
      );
    }
    return square;
  }
});

React.render(<App />, document.body);
