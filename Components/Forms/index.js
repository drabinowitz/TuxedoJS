'use strict';

var React = require('tux/React');

var Form = React.createOwnerClass({
  registerOwnerProps: function () {
    return {
      __tuxHandleIsValidCheck__: function (inputName, isValid) {
        var newState = {
          validInputMap: {}
        };
        newState.validInputMap[inputName] = isValid;
        this.extendState(newState);
      }.bind(this)
    };
  },

  render: function () {
    React.children.map
  }
});

module.exports = Form;
