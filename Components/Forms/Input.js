'use strict';

var React = require('tux/React');

var Input = React.createMutableClass({

  __tuxFormInput__: true,

  mutableTraits: {
    props: 'isValid',
    state: 'message'
  },

  getDefaultProps: function () {
    return {
      isValid: true
    };
  },

  propTypes: {
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    minLength: React.PropTypes.number,
    maxLength: React.PropTypes.number,
    minValue: React.PropTypes.number,
    maxValue: React.PropTypes.number,
    required: React.PropTypes.bool,
    pattern: React.PropTypes.instanceOf(window.Regexp),
    customCheck: React.PropTypes.func
  },

  nearestOwnerPropTypes: {
    registerWithForm: React.PropTypes.func.isRequired,
    unregisterWithForm: React.PropTypes.func.isRequired,
    checkIfInputIsValid: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    this.nearestOwnerProps.registerWithForm(this, this.getDOMNode().value.toString());
  },

  componentWillUnmount: function () {
    this.nearestOwnerProps.unregisterWithForm(this);
  },

  handleChange: function (event) {
    var newMessage = event.target.value.toString();
    this.tuxIsValid = this.nearestOwnerProps.checkIfInputIsValid(this, newMessage);
  },

  render: function () {
    var type = this.props.type || 'text';
    return (
      <input type={type} onChange={this.handleChange} />
    );
  }
});

module.exports = Input;
