var Sweeper = require('./sweeper');
var React = require('react');
var ReactDOM = require('react-dom');

// overall app component
var App = React.createClass({
  getInitialState: function() {
    var sweeper = new Sweeper(12, 10, 5);
    sweeper.resetBoard();
    return {
      sweeper: sweeper,
      isFlag: false,
      timer: 0,
      isKeydown: false
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
      if (!this.state.sweeper.game.started)
        return;
      sweeper.toggleFlag(y, x);
      var isFlag = this.state.isFlag && this.state.isKeydown;
      this.setState({sweeper: sweeper, isFlag: isFlag});
    }
  },
  onFlagClick: function(e){
    var toggle = !this.state.isFlag;
    this.setState({isFlag: toggle});
  },
  handleKeyUp: function(e){

    // shift (16) toggle flag
    if (e.keyCode != 16) return;
    e.preventDefault();
    this.setState({isFlag: false, isKeydown: false});
  },
  handleKeyDown: function(e){

    // shift (16) toggle flag
    if (e.keyCode != 16) return;
    e.preventDefault();
    this.setState({isFlag: true, isKeydown: true});
  },
  render: function() {

    // reset game smiley or sad face
    var icon = <i className='icon-emo-happy' />;
    if (this.state.sweeper.game.ended){
      if (this.state.sweeper.game.status === 'lost'){
        icon = <i className='icon-emo-unhappy' />;
      }
    }
    
    // if bombs in top left clicked, toggle flag state
    var flagsClassName = 'bombs';
    if (this.state.isFlag){
      flagsClassName = flagsClassName + ' active';
    }
 
    // controls set here, using Board component
    return (
      <div>
        <h1>Minesweeper</h1>
        <div className='controls'>
          <div className={flagsClassName} onClick={this.onFlagClick}>
            {this.state.sweeper.numFlags}
          </div>
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

// Board component 
var Board = React.createClass({
  render: function() {
    var y, board = [];
    for (y = 0; y < this.props.sweeper.board.length; y++){
      board.push(
        <Row 
          key={y}
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

// Row in a Board
var Row = React.createClass({
  render: function(){
    var x, row = [];
      for (x = 0; x < this.props.width; x++){
        row.push(
          <Square
            key={x}
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

// Square on the board
var Square = React.createClass({
  handleClick: function(e){
    this.props.squareCallback(this.props.y, this.props.x);
  },
  render: function(){
    var key = this.props.y+'_'+this.props.x;

    // basic empty square setup as default
    var square = (
      <div 
        key={key} 
        y={this.props.y}
        x={this.props.x}
        className='square empty' 
        onClick={this.handleClick}
      />
    );

    // square uncoverd, display based on value
    if (this.props.value != undefined){

      // ignore 0 or -1 value
      var value = this.props.value > 0 ? this.props.value : '';
      var className = 'square _' + value;
      var inner = value;

      // display bomb
      if (this.props.value === '*'){
        className = className + ' bomb';
        inner = <i className='icon-bomb' />
      }

      // display flag indicated by -1
      else if (this.props.value === -1){
        className = className + ' flag';
        inner = <i className='icon-flag' />
      }

      // set square inner based on conditions above
      square = (
        <div key={key} className={className} onClick={this.handleClick}>
          {inner}
        </div>
      );
    }
    return square;
  }
});

// mobile click support
var attachFastClick = require('fastclick');
attachFastClick(document.body);

ReactDOM.render(<App />, document.getElementById('app'));
