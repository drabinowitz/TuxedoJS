'use strict';

//TuxStoreMixinGenerator FUNCTION: creates an object with the componentDidMount and componentWillUnmount methods that will add and remove the specified event listeners from the provided store
//@param props FUNCTION: returns an OBJECT defining the TuxStore for which callbacks will be registered. "this" will be bound to the component in this function. [ALTERNATE ARRAY: array of functions with the component bound as "this" that return objects with same keys as listed below]
  //expected keys:
  // store OBJECT: store object that the event and listener should be attached to
  // listener FUNCTION: callback function to be invoked upon associated event [ALTERNATE ARRAY: array of callback functions]
  // event STRING: event type to trigger listener callback function [ALTERNATE ARRAY: array of event type strings]
var TuxStoreMixinGenerator = function (props) {
  var storeConnections = {};
  if (Array.isArray(props)) {
    var propsLength = props.length;

    // add the events and listeners for the particular store to the componentDidMount React life cycle event
    storeConnections.componentDidMount = function () {
      for (var i = 0; i < propsLength; i++) {
        var prop = props[i];
        //invoke the passed in function with the component's context and store the returned object back into the array and variable
        prop = props[i] = prop.call(this);
        // map addChangeListeners, due to the second input argument set to true, to store, listeners, and events passed in
        mapListenersAndEventsToStore(prop, true);
      }
    };

    // remove the events and listeners for the particular store to the componentWillUnmount React life cycle event
    storeConnections.componentWillUnmount = function () {
      for (var i = 0; i < propsLength; i++) {
        // map removeChangeListeners, due to the second input argument set to false, to store, listeners, and events passed in
        mapListenersAndEventsToStore(props[i], false);
      }
    };
  } else if (typeof props === 'function') {
    storeConnections.componentDidMount = function () {
      props = props.call(this);
      mapListenersAndEventsToStore(props, true);
    };

    storeConnections.componentWillUnmount = function () {
      mapListenersAndEventsToStore(props, false);
    };
  }

  return storeConnections;
};

//mapListenersAndEventsToStore FUNCTION maps adding or removing change listeners from a store
//@param storeConfig OBJECT: contains the store object that the event types and the listener callbacks will be attached to
  //expected keys:
  // store OBJECT: store object that the event and listener should be attached to
  // listener FUNCTION: callback function to be invoked upon associated event [ALTERNATE ARRAY: array of callback functions] [ALTERNATE OBJECT: map of event strings to callback functions]
  // event STRING: event type to trigger listener callback function [ALTERNATE ARRAY: array of event type strings]
//@param addRemoveListener BOOLEAN: true to addChangeListener, false to removeChangeListener
var mapListenersAndEventsToStore = function (storeConfig, addOrRemoveListener) {
  var addOrRemoveListenerString = addOrRemoveListener ? 'addChangeListener' : 'removeChangeListener';

  // get store object
  var store = storeConfig.store;
  // get listener/s
  var listener = storeConfig.listener;
  // deterimine if listener is an array of callbacks, if it isn't it will be converted a single element array for ease of looping if event is an array
  var listenerIsArray = Array.isArray(listener);
  // get event/s
  var event = storeConfig.event;
  //determine if event is an array of change event types, if it isn't it will be converted to a single element array for ease of looping if listener is an array
  var eventIsArray = Array.isArray(event);

  //if the listener is an object and not an array
  if (typeof(listener) === 'object' && !listenerIsArray) {
    //loop through keys in listener
    var eventKey;
    for (eventKey in listener) {
      if (listener.hasOwnProperty(eventKey)) {
        //invoke mapListenersAndEventsToStore with a new object possessing the same store, the eventKey as the event, and the value at this key as the listener
        mapListenersAndEventsToStore({
          store: store,
          event: eventKey,
          listener: listener[eventKey]
        }, addOrRemoveListener);
      }
    }
  // check to see if either listener or event is an array and if one is the other will be changed to an array
  } else if (listenerIsArray || eventIsArray) {
    if (!listenerIsArray) {
      listener = [listener];
    } else if (!eventIsArray) {
      event = [event];
    }
    // pre-calculate listener and event lengths
    var listenerLength = listener.length;
    var eventLength = event.length;

    // determine which array is a longer length and set longerLength to that value. This is done if one is larger than the other,
    // so that the last element of the shorter array will be paired with the remaining elements of the longer array
    var longerLength = listenerLength;
    if (listenerLength < eventLength) {
      longerLength = eventLength;
    }

    // loop through and either add or remove change listeners with the specified event type from the store
    for (var i = 0; i < longerLength; i++) {
      var currentListener = listener[i] || listener[listenerLength - 1];
      var currentEvent = event[i] || event[eventLength - 1];
      store[addOrRemoveListenerString](currentListener, currentEvent);
    }
  } else {
    // if neither the listener or event was an array, the add or remove change listener can be invoked without converting them to arrays
    store[addOrRemoveListenerString](listener, event);
  }
};

// export TuxStoreMixinGenerator
module.exports = TuxStoreMixinGenerator;
