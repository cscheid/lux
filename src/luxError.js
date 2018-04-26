// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

function LuxError(message, fileName, lineNumber) {
  var instance = new Error(message, fileName, lineNumber);
  instance.msg = message;
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, LuxError);
  }
  return instance;
}

LuxError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

if (Object.setPrototypeOf){
  Object.setPrototypeOf(LuxError, Error);
} else {
  LuxError.__proto__ = Error;
}

exports.LuxError = LuxError;

// try {
//   throw new CustomError('baz', 'bazMessage');
// } catch(e){
//   console.log(e.foo); //baz
//   console.log(e.message) ;//bazMessage
// }
