var Sweeper = require('./sweeper');

var App = React.createClass({
  getInitialState: function() {
    return {
      sweeper: new Sweeper()
      };
  },
  render: function() {
  return (
    <div>
      <h1>App</h1>
      <Board sweeper={this.state.sweeper}/>
    </div>
  );
  }
});

var Board = React.createClass({
  render: function() {
    return <div>board</div>;
  }
});

React.render(<App />, document.body);
