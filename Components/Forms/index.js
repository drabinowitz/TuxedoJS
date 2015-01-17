'use strict';

var React = require('tux/React');
var assign = require('object-assign');
var invariant = require('tux/src/TuxInvariant');

var Form = React.createOwnerClass({
  getInitialState: function () {
    return {
      validInputMap: {}
    };
  },

  checkIfInputIsValid: function (input, message) {
    var newState = {
      validInputMap: assign({}, this.state.validInputMap)
    };

    var validityMap = this.generateValidityMapForInput(input, message);
    newState.validInputMap[input.props.name] = validityMap;
    this.setState(newState);
  },

  registerWithForm: function (input, message) {
    var newState = {
       validInputMap: assign({}, this.state.validInputMap)
    };

    var validInputMap = newState.validInputMap;
    var name = this.props.name;
    invariant(!validInputMap[name], 'input name: "%s" is already registered in this form.  Form inputs must be unique.', name);
    this.checkIfInputIsValid(input, message);
  },

  unregisterWithForm: function (input) {
    var newState = {
       validInputMap: assign({}, this.state.validInputMap)
    };

    delete newState.validInputMap[input.props.name];
    this.setState(newState);
  },

  checkIfFormIsValid: function () {
    var input;
    var validInputMap = this.state.validInputMap;
    var inputValueMap = {};
    for (input in validInputMap) {
      if (validInputMap.hasOwnProperty(input)) {
        var validityMap = validInputMap[input];
        if (!validityMap.isValid) {
          return false;
        }
        inputValueMap[input] = validityMap.value;
      }
    }
    return inputValueMap;
  },

  registerOwnerProps: function () {
    return {
      checkIfInputIsValid: this.checkIfInputIsValid.bind(this),
      checkIfFormIsValid: this.checkIfFormIsValid.bind(this),
      registerWithForm: this.registerWithForm.bind(this),
      unregisterWithForm: this.unregisterWithForm.bind(this)
    };
  },

  generateValidityMapForInput: function (input, message) {
    var minLength = input.props.minLength;
    var maxLength = input.props.maxLength;
    var minValue = input.props.minValue;
    var maxValue = input.props.maxValue;
    var required = input.props.required;
    var pattern = input.props.pattern;
    var customCheck = input.props.customCheck;

    var validityMap = {value: message};
    if (minLength !== undefined && minLength > message.length) {
      validityMap.minLength = true;
    }

    if (maxLength !== undefined && maxLength < message.length) {
      validityMap.maxLength = true;
    }

    if (minValue !== undefined && minValue > +message) {
      validityMap.minValue = true;
    }

    if (maxValue !== undefined && maxValue < +message) {
      validityMap.maxValue = true;
    }

    if (required !== undefined && !message.length) {
      validityMap.required = true;
    }

    if (pattern !== undefined && message.search(pattern) === -1) {
      validityMap.pattern = true;
    }

    if (customCheck !== undefined && !customCheck(message)) {
      validityMap.customCheck = true;
    }

    validityMap.isValid = Object.keys(validityMap).length > 1;

    return validityMap;
  },

  handleSubmit: function () {
    var inputValueMap = this.checkIfFormIsValid();
    if (inputValueMap) {
      this.props.handleSubmit(inputValueMap);
    }
  },

  render: function () {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        {this.props.children}
      </form>
    );
  }
});

module.exports = Form;
