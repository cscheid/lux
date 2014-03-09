// Code in this subdirectory depends on Promises/A+ javascript support.
// By default, we assume it to be in the "Promise" global variable.
// If your favorite Promises library uses a different entry point,
// you can pass it to Lux.Promises.set_library

(function() {

var Promise = window.Promise;

Lux.Promises = {};

Lux.Promises.set_library = function(obj) {
    Promise = obj;
};
