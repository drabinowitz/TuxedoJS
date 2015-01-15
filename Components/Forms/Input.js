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
    __tuxHandleIsValidCheck__: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      message: this.props.defaultValue || ''
    };
  },

  checkIfValid: function (message) {
    var minLength = this.props.minLength;
    var maxLength = this.props.maxLength;
    var minValue = this.props.minValue;
    var maxValue = this.props.maxValue;
    var required = this.props.required;
    var pattern = this.props.pattern;
    var customCheck = this.props.customCheck;
    //TODO CHANGE TO RETURN ACTUAL ERRORS
    if (minLength !== undefined && minLength > message.length) {
      return false;
    }

    if (maxLength !== undefined && maxLength < message.length) {
      return false;
    }

    if (minValue !== undefined && minValue > +message) {
      return false;
    }

    if (maxValue !== undefined && maxValue < +message) {
      return false;
    }

    if (required !== undefined && !message.length) {
      return false;
    }

    if (pattern !== undefined && message.search(pattern) === -1) {
      return false;
    }

    if (customCheck !== undefined && !customCheck(message)) {
      return false;
    }

    return true;
  },

  handleChange: function (event) {
    var newMessage = event.target.value.toString();
    var isValid = this.checkIfValid(newMessage);
    this.nearestOwnerProps.__tuxHandleIsValidCheck__(this.props.name, isValid);
  },

  render: function () {
    var type = this.props.type || 'text';
    var message = this.state.message;
    return (
      <input type={type} value={message} onChange={this.handleChange} />
    );
  }
});

module.exports = Input;
