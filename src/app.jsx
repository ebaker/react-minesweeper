var Sweeper = require('./sweeper');
var s = new Sweeper();

console.log('sweeper', s);

var App = React.createClass({
  getInitialState: function() {
    return {
      };
  },
  render: function() {
  return (
    <div>App</div>
  );
  }
});

React.render(<App />, document.body);
