!(function() {
    var Module = {};

var emscriptenate = function(Module) {
// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };

  var nodeFS = require('fs');
  var nodePath = require('path');

  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };

  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  Module['arguments'] = process['argv'].slice(2);

  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }

  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  this['Module'] = Module;

  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WEB) {
    this['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}



// === Auto-generated preamble library stuff ===

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?\{ ?[^}]* ?\}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (vararg) return 8;
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_ && type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    code = Pointer_stringify(code);
    if (code[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (code.indexOf('"', 1) === code.length-1) {
        code = code.substr(1, code.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + code + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + code + ' })'); // new Function does not allow upvars in node
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;

      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }

      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }

      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  getCompilerSetting: function (name) {
    throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work';
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*(+4294967296))) : ((+((low>>>0)))+((+((high|0)))*(+4294967296)))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}


Module['Runtime'] = Runtime;









//========================================
// Runtime essentials
//========================================

var __THREW__ = 0; // Used in checking for thrown exceptions.

var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}

// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;

// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;

// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module['allocate'] = allocate;

function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }

  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;

// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;

function demangle(func) {
  var i = 3;
  // params, etc.
  var basicTypes = {
    'v': 'void',
    'b': 'bool',
    'c': 'char',
    's': 'short',
    'i': 'int',
    'l': 'long',
    'f': 'float',
    'd': 'double',
    'w': 'wchar_t',
    'a': 'signed char',
    'h': 'unsigned char',
    't': 'unsigned short',
    'j': 'unsigned int',
    'm': 'unsigned long',
    'x': 'long long',
    'y': 'unsigned long long',
    'z': '...'
  };
  var subs = [];
  var first = true;
  function dump(x) {
    //return;
    if (x) Module.print(x);
    Module.print(func);
    var pre = '';
    for (var a = 0; a < i; a++) pre += ' ';
    Module.print (pre + '^');
  }
  function parseNested() {
    i++;
    if (func[i] === 'K') i++; // ignore const
    var parts = [];
    while (func[i] !== 'E') {
      if (func[i] === 'S') { // substitution
        i++;
        var next = func.indexOf('_', i);
        var num = func.substring(i, next) || 0;
        parts.push(subs[num] || '?');
        i = next+1;
        continue;
      }
      if (func[i] === 'C') { // constructor
        parts.push(parts[parts.length-1]);
        i += 2;
        continue;
      }
      var size = parseInt(func.substr(i));
      var pre = size.toString().length;
      if (!size || !pre) { i--; break; } // counter i++ below us
      var curr = func.substr(i + pre, size);
      parts.push(curr);
      subs.push(curr);
      i += pre + size;
    }
    i++; // skip E
    return parts;
  }
  function parse(rawList, limit, allowVoid) { // main parser
    limit = limit || Infinity;
    var ret = '', list = [];
    function flushList() {
      return '(' + list.join(', ') + ')';
    }
    var name;
    if (func[i] === 'N') {
      // namespaced N-E
      name = parseNested().join('::');
      limit--;
      if (limit === 0) return rawList ? [name] : name;
    } else {
      // not namespaced
      if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
      var size = parseInt(func.substr(i));
      if (size) {
        var pre = size.toString().length;
        name = func.substr(i + pre, size);
        i += pre + size;
      }
    }
    first = false;
    if (func[i] === 'I') {
      i++;
      var iList = parse(true);
      var iRet = parse(true, 1, true);
      ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
    } else {
      ret = name;
    }
    paramLoop: while (i < func.length && limit-- > 0) {
      //dump('paramLoop');
      var c = func[i++];
      if (c in basicTypes) {
        list.push(basicTypes[c]);
      } else {
        switch (c) {
          case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
          case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
          case 'L': { // literal
            i++; // skip basic type
            var end = func.indexOf('E', i);
            var size = end - i;
            list.push(func.substr(i, size));
            i += size + 2; // size + 'EE'
            break;
          }
          case 'A': { // array
            var size = parseInt(func.substr(i));
            i += size.toString().length;
            if (func[i] !== '_') throw '?';
            i++; // skip _
            list.push(parse(true, 1, true)[0] + ' [' + size + ']');
            break;
          }
          case 'E': break paramLoop;
          default: ret += '?' + c; break paramLoop;
        }
      }
    }
    if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
    return rawList ? list : ret + flushList();
  }
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    return parse();
  } catch(e) {
    return func;
  }
}

function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}

function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}

// Memory management

var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}

var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk

function enlargeMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.');
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;

var totalMemory = 4096;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024
  }
}
if (totalMemory !== TOTAL_MEMORY) {
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be more reasonable');
  TOTAL_MEMORY = totalMemory;
}

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'JS engine does not provide full typed array support');

var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);

// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');

Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;

function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;

// Tools

// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;

// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];


var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


var memoryInitializer = null;

// === Body ===



STATIC_BASE = 8;

STATICTOP = STATIC_BASE + 2744;


/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });

var _stderr;
var _stderr=_stderr=allocate(1, "i32*", ALLOC_STATIC);






































































































































































/* memory initializer */ allocate([69,100,103,101,83,105,103,110,40,32,100,115,116,85,112,44,32,116,101,115,115,45,62,101,118,101,110,116,44,32,111,114,103,85,112,32,41,32,60,61,32,48,0,0,0,0,0,0,101,45,62,79,114,103,32,61,61,32,118,0,0,0,0,0,33,32,86,101,114,116,69,113,40,32,100,115,116,76,111,44,32,100,115,116,85,112,32,41,0,0,0,0,0,0,0,0,99,104,105,108,100,32,60,61,32,112,113,45,62,109,97,120,0,0,0,0,0,0,0,0,118,45,62,112,114,101,118,32,61,61,32,118,80,114,101,118,0,0,0,0,0,0,0,0,114,101,103,80,114,101,118,45,62,119,105,110,100,105,110,103,78,117,109,98,101,114,32,45,32,101,45,62,119,105,110,100,105,110,103,32,61,61,32,114,101,103,45,62,119,105,110,100,105,110,103,78,117,109,98,101,114,0,0,0,0,0,0,0,69,82,82,79,82,44,32,99,97,110,39,116,32,104,97,110,100,108,101,32,37,100,10,0,99,117,114,114,32,60,32,112,113,45,62,109,97,120,32,38,38,32,112,113,45,62,107,101,121,115,91,99,117,114,114,93,32,33,61,32,78,85,76,76,0,0,0,0,0,0,0,0,102,45,62,112,114,101,118,32,61,61,32,102,80,114,101,118,32,38,38,32,102,45,62,97,110,69,100,103,101,32,61,61,32,78,85,76,76,32,38,38,32,102,45,62,100,97,116,97,32,61,61,32,78,85,76,76,0,0,0,0,0,0,0,0,117,112,45,62,76,110,101,120,116,32,33,61,32,117,112,32,38,38,32,117,112,45,62,76,110,101,120,116,45,62,76,110,101,120,116,32,33,61,32,117,112,0,0,0,0,0,0,0,86,101,114,116,76,101,113,40,32,101,45,62,79,114,103,44,32,101,45,62,68,115,116,32,41,0,0,0,0,0,0,0,99,117,114,114,32,33,61,32,76,79,78,71,95,77,65,88,0,0,0,0,0,0,0,0,101,45,62,76,102,97,99,101,32,61,61,32,102,0,0,0,114,101,103,45,62,101,85,112,45,62,119,105,110,100,105,110,103,32,61,61,32,48,0,0,76,69,81,40,32,42,42,40,105,43,49,41,44,32,42,42,105,32,41,0,0,0,0,0,101,45,62,79,110,101,120,116,45,62,83,121,109,45,62,76,110,101,120,116,32,61,61,32,101,0,0,0,0,0,0,0,101,45,62,76,110,101,120,116,32,33,61,32,101,0,0,0,114,101,103,45,62,119,105,110,100,105,110,103,78,117,109,98,101,114,32,61,61,32,48,0,112,114,105,111,114,105,116,121,113,46,99,0,0,0,0,0,101,45,62,76,110,101,120,116,45,62,79,110,101,120,116,45,62,83,121,109,32,61,61,32,101,0,0,0,0,0,0,0,102,114,101,101,95,104,97,110,100,108,101,32,33,61,32,76,79,78,71,95,77,65,88,0,43,43,102,105,120,101,100,69,100,103,101,115,32,61,61,32,49,0,0,0,0,0,0,0,112,113,32,33,61,32,78,85,76,76,0,0,0,0,0,0,115,105,122,101,32,61,61,32,49,0,0,0,0,0,0,0,86,101,114,116,76,101,113,40,32,117,44,32,118,32,41,32,38,38,32,86,101,114,116,76,101,113,40,32,118,44,32,119,32,41,0,0,0,0,0,0,101,45,62,83,121,109,45,62,83,121,109,32,61,61,32,101,0,0,0,0,0,0,0,0,108,111,45,62,76,110,101,120,116,32,33,61,32,117,112,0,114,101,103,45,62,102,105,120,85,112,112,101,114,69,100,103,101,0,0,0,0,0,0,0,104,67,117,114,114,32,62,61,32,49,32,38,38,32,104,67,117,114,114,32,60,61,32,112,113,45,62,109,97,120,32,38,38,32,104,91,104,67,117,114,114,93,46,107,101,121,32,33,61,32,78,85,76,76,0,0,84,114,97,110,115,76,101,113,40,32,117,44,32,118,32,41,32,38,38,32,84,114,97,110,115,76,101,113,40,32,118,44,32,119,32,41,0,0,0,0,115,105,122,101,32,61,61,32,48,0,0,0,0,0,0,0,101,45,62,83,121,109,32,33,61,32,101,0,0,0,0,0,84,79,76,69,82,65,78,67,69,95,78,79,78,90,69,82,79,0,0,0,0,0,0,0,70,65,76,83,69,0,0,0,33,32,86,101,114,116,69,113,40,32,101,85,112,45,62,68,115,116,44,32,101,76,111,45,62,68,115,116,32,41,0,0,116,101,115,115,109,111,110,111,46,99,0,0,0,0,0,0,105,115,101,99,116,46,115,32,60,61,32,77,65,88,40,32,111,114,103,76,111,45,62,115,44,32,111,114,103,85,112,45,62,115,32,41,0,0,0,0,77,73,78,40,32,100,115,116,76,111,45,62,115,44,32,100,115,116,85,112,45,62,115,32,41,32,60,61,32,105,115,101,99,116,46,115,0,0,0,0,102,45,62,109,97,114,107,101,100,0,0,0,0,0,0,0,115,119,101,101,112,46,99,0,105,115,101,99,116,46,116,32,60,61,32,77,65,88,40,32,111,114,103,76,111,45,62,116,44,32,100,115,116,76,111,45,62,116,32,41,0,0,0,0,101,45,62,83,121,109,45,62,110,101,120,116,32,61,61,32,101,80,114,101,118,45,62,83,121,109,32,38,38,32,101,45,62,83,121,109,32,61,61,32,38,109,101,115,104,45,62,101,72,101,97,100,83,121,109,32,38,38,32,101,45,62,83,121,109,45,62,83,121,109,32,61,61,32,101,32,38,38,32,101,45,62,79,114,103,32,61,61,32,78,85,76,76,32,38,38,32,101,45,62,68,115,116,32,61,61,32,78,85,76,76,32,38,38,32,101,45,62,76,102,97,99,101,32,61,61,32,78,85,76,76,32,38,38,32,101,45,62,82,102,97,99,101,32,61,61,32,78,85,76,76,0,46,47,112,114,105,111,114,105,116,121,113,45,104,101,97,112,46,99,0,0,0,0,0,0,77,73,78,40,32,111,114,103,85,112,45,62,116,44,32,100,115,116,85,112,45,62,116,32,41,32,60,61,32,105,115,101,99,116,46,116,0,0,0,0,103,101,111,109,46,99,0,0,101,45,62,68,115,116,32,33,61,32,78,85,76,76,0,0,33,32,114,101,103,85,112,45,62,102,105,120,85,112,112,101,114,69,100,103,101,32,38,38,32,33,32,114,101,103,76,111,45,62,102,105,120,85,112,112,101,114,69,100,103,101,0,0,101,45,62,79,114,103,32,33,61,32,78,85,76,76,0,0,114,101,110,100,101,114,46,99,0,0,0,0,0,0,0,0,111,114,103,85,112,32,33,61,32,116,101,115,115,45,62,101,118,101,110,116,32,38,38,32,111,114,103,76,111,32,33,61,32,116,101,115,115,45,62,101,118,101,110,116,0,0,0,0,101,45,62,83,121,109,45,62,110,101,120,116,32,61,61,32,101,80,114,101,118,45,62,83,121,109,0,0,0,0,0,0,69,100,103,101,83,105,103,110,40,32,100,115,116,76,111,44,32,116,101,115,115,45,62,101,118,101,110,116,44,32,111,114,103,76,111,32,41,32,62,61,32,48,0,0,0,0,0,0,118,45,62,112,114,101,118,32,61,61,32,118,80,114,101,118,32,38,38,32,118,45,62,97,110,69,100,103,101,32,61,61,32,78,85,76,76,32,38,38,32,118,45,62,100,97,116,97,32,61,61,32,78,85,76,76,0,0,0,0,0,0,0,0,109,101,115,104,46,99,0,0,102,45,62,112,114,101,118,32,61,61,32,102,80,114,101,118,0,0,0,0,0,0,0,0,95,95,103,108,95,116,114,97,110,115,83,105,103,110,0,0,95,95,103,108,95,116,114,97,110,115,69,118,97,108,0,0,95,95,103,108,95,114,101,110,100,101,114,77,101,115,104,0,95,95,103,108,95,112,113,83,111,114,116,73,110,115,101,114,116,0,0,0,0,0,0,0,95,95,103,108,95,112,113,83,111,114,116,73,110,105,116,0,95,95,103,108,95,112,113,83,111,114,116,68,101,108,101,116,101,80,114,105,111,114,105,116,121,81,0,0,0,0,0,0,95,95,103,108,95,112,113,83,111,114,116,68,101,108,101,116,101,0,0,0,0,0,0,0,95,95,103,108,95,112,113,72,101,97,112,73,110,115,101,114,116,0,0,0,0,0,0,0,95,95,103,108,95,112,113,72,101,97,112,68,101,108,101,116,101,0,0,0,0,0,0,0,95,95,103,108,95,109,101,115,104,84,101,115,115,101,108,108,97,116,101,77,111,110,111,82,101,103,105,111,110,0,0,0,95,95,103,108,95,109,101,115,104,67,104,101,99,107,77,101,115,104,0,0,0,0,0,0,95,95,103,108,95,101,100,103,101,83,105,103,110,0,0,0,95,95,103,108,95,101,100,103,101,69,118,97,108,0,0,0,82,101,110,100,101,114,84,114,105,97,110,103,108,101,0,0,82,101,110,100,101,114,83,116,114,105,112,0,0,0,0,0,82,101,110,100,101,114,70,97,110,0,0,0,0,0,0,0,82,101,109,111,118,101,68,101,103,101,110,101,114,97,116,101,70,97,99,101,115,0,0,0,73,115,87,105,110,100,105,110,103,73,110,115,105,100,101,0,70,108,111,97,116,68,111,119,110,0,0,0,0,0,0,0,70,105,120,85,112,112,101,114,69,100,103,101,0,0,0,0,68,111,110,101,69,100,103,101,68,105,99,116,0,0,0,0,68,101,108,101,116,101,82,101,103,105,111,110,0,0,0,0,67,111,110,110,101,99,116,76,101,102,116,68,101,103,101,110,101,114,97,116,101,0,0,0,67,104,101,99,107,70,111,114,76,101,102,116,83,112,108,105,99,101,0,0,0,0,0,0,67,104,101,99,107,70,111,114,73,110,116,101,114,115,101,99,116,0,0,0,0,0,0,0,65,100,100,82,105,103,104,116,69,100,103,101,115,0,0,0,0,0,0,63,0,0,0,63,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);



var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}


  function ___assert_fail(condition, filename, line, func) {
      ABORT = true;
      throw 'Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + stackTrace();
    }

  
   
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i64=_memset;

  function _llvm_lifetime_start() {}

  function _llvm_lifetime_end() {}

  
  
  
  
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }
  
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          fileStore.createIndex('timestamp', 'timestamp', { unique: false });
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function() {
          callback(this.error);
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function() { callback(this.error); };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index('timestamp');
  
          index.openKeyCursor().onsuccess = function(event) {
            var cursor = event.target.result;
  
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, entries: entries });
            }
  
            entries[cursor.primaryKey] = { timestamp: cursor.key };
  
            cursor.continue();
          };
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function() { callback(this.error); };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function() { done(this.error); };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          stream.position = position;
          return position;
        }}};
  
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        if (stream.__proto__) {
          // reuse the object
          stream.__proto__ = FS.FSStream.prototype;
        } else {
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
        }
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },getStreamFromPtr:function (ptr) {
        return FS.streams[ptr - 1];
      },getPtrForStream:function (stream) {
        return stream ? stream.fd + 1 : 0;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            callback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=FS.getPtrForStream(stdin);
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=FS.getPtrForStream(stdout);
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=FS.getPtrForStream(stderr);
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
  
              if (!hasByteServing) chunkSize = datalength;
  
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
  
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
  
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
  
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  
  
  
  
  function _mkport() { throw 'TODO' }var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
  
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
  
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
  
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
  
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
  
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
  
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
  
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
  
  
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
  
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
  
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
  
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
  
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
  
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
  
  
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
  
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
  
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
  
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
  
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
  
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
  
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
  
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
  
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
  
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
  
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
  
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
  
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
  
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
  
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
  
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
  
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
  
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
  
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
  
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
  
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
  
  
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
  
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fileno(stream) {
      // int fileno(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fileno.html
      return FS.getStreamFromPtr(stream).fd;
    }function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr;
      var fd = _fileno(stream);
      var ret = _write(fd, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _putchar(c) {
      // int putchar(int c);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/putchar.html
      return _fputc(c, HEAP32[((_stdout)>>2)]);
    } 
  Module["_saveSetjmp"] = _saveSetjmp;
  
   
  Module["_testSetjmp"] = _testSetjmp;var _setjmp=undefined;

  function _longjmp(env, value) {
      asm['setThrew'](env, value || 1);
      throw 'longjmp';
    }

  var _llvm_memset_p0i8_i32=_memset;

  
  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;

  
  function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var fd = _fileno(stream);
      var bytesWritten = _write(fd, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  
  
   
  Module["_strlen"] = _strlen;
  
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
  
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          }
          if (precision < 0) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }

  function _abort() {
      Module['abort']();
    }

  function ___errno_location() {
      return ___errno_state;
    }

  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }

  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }

  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }






  var Browser={mainLoop:{scheduler:null,method:"",shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
  
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
  
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        var errorInfo = '?';
        function onContextCreationError(event) {
          errorInfo = event.statusMessage || errorInfo;
        }
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
  
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
  
  
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
  
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          GLctx = Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
  
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
  
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function (event) {
        return Math.max(-1, Math.min(1, event.type === 'DOMMouseScroll' ? event.detail : -event.wheelDelta));
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (scrollX + rect.left);
              y = t.pageY - (scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (scrollX + rect.left);
            y = event.pageY - (scrollY + rect.top);
          }
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

staticSealed = true; // seal the static portion of memory

STACK_MAX = STACK_BASE + 5242880;

DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");


var Math_min = Math.min;
function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_i(index) {
  try {
    return Module["dynCall_i"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env._stderr|0;var n=+env.NaN;var o=+env.Infinity;var p=0;var q=0;var r=0;var s=0;var t=0,u=0,v=0,w=0,x=0.0,y=0,z=0,A=0,B=0.0;var C=0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=global.Math.floor;var N=global.Math.abs;var O=global.Math.sqrt;var P=global.Math.pow;var Q=global.Math.cos;var R=global.Math.sin;var S=global.Math.tan;var T=global.Math.acos;var U=global.Math.asin;var V=global.Math.atan;var W=global.Math.atan2;var X=global.Math.exp;var Y=global.Math.log;var Z=global.Math.ceil;var _=global.Math.imul;var $=env.abort;var aa=env.assert;var ba=env.asmPrintInt;var ca=env.asmPrintFloat;var da=env.min;var ea=env.invoke_viiiii;var fa=env.invoke_i;var ga=env.invoke_vi;var ha=env.invoke_vii;var ia=env.invoke_iiii;var ja=env.invoke_ii;var ka=env.invoke_viii;var la=env.invoke_v;var ma=env.invoke_iii;var na=env.invoke_viiii;var oa=env._llvm_lifetime_end;var pa=env.___assert_fail;var qa=env._abort;var ra=env._fprintf;var sa=env._fflush;var ta=env._fputc;var ua=env._sysconf;var va=env.___setErrNo;var wa=env._fwrite;var xa=env._write;var ya=env._send;var za=env._longjmp;var Aa=env.__reallyNegative;var Ba=env.__formatString;var Ca=env._emscripten_memcpy_big;var Da=env._fileno;var Ea=env._pwrite;var Fa=env._putchar;var Ga=env._sbrk;var Ha=env.___errno_location;var Ia=env._llvm_lifetime_start;var Ja=env._mkport;var Ka=env._time;var La=0.0;
// EMSCRIPTEN_START_FUNCS
function Wa(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7&-8;return b|0}function Xa(){return i|0}function Ya(a){a=a|0;i=a}function Za(a,b){a=a|0;b=b|0;if((p|0)==0){p=a;q=b}}function _a(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function $a(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function ab(a){a=a|0;C=a}function bb(a){a=a|0;D=a}function cb(a){a=a|0;E=a}function db(a){a=a|0;F=a}function eb(a){a=a|0;G=a}function fb(a){a=a|0;H=a}function gb(a){a=a|0;I=a}function hb(a){a=a|0;J=a}function ib(a){a=a|0;K=a}function jb(a){a=a|0;L=a}function kb(){}function lb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=Qc(20)|0;if((d|0)==0){e=0;return e|0}f=d;c[d>>2]=0;c[d+4>>2]=f;c[d+8>>2]=f;c[d+12>>2]=a;c[d+16>>2]=b;e=d;return e|0}function mb(a){a=a|0;var b=0,d=0,e=0,f=0;b=a|0;d=c[a+4>>2]|0;if((d|0)==(b|0)){e=a;Rc(e);return}else{f=d}while(1){d=c[f+4>>2]|0;Rc(f);if((d|0)==(b|0)){break}else{f=d}}e=a;Rc(e);return}function nb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=a+16|0;f=a+12|0;a=b;do{a=c[a+8>>2]|0;b=c[a>>2]|0;if((b|0)==0){break}}while((Qa[c[e>>2]&7](c[f>>2]|0,b,d)|0)==0);f=Qc(12)|0;e=f;if((f|0)==0){g=0;return g|0}c[f>>2]=d;d=a+4|0;c[f+4>>2]=c[d>>2];c[(c[d>>2]|0)+8>>2]=e;c[f+8>>2]=a;c[d>>2]=e;g=e;return g|0}function ob(a,b){a=a|0;b=b|0;var d=0;a=b+8|0;d=b+4|0;c[(c[d>>2]|0)+8>>2]=c[a>>2];c[(c[a>>2]|0)+4>>2]=c[d>>2];Rc(b);return}function pb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=a+16|0;e=a+12|0;f=a|0;while(1){g=c[f+4>>2]|0;a=c[g>>2]|0;if((a|0)==0){h=4;break}if((Qa[c[d>>2]&7](c[e>>2]|0,b,a)|0)==0){f=g}else{h=4;break}}if((h|0)==4){return g|0}return 0}function qb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;b=Qc(64)|0;d=b;e=Qc(64)|0;f=e;g=Qc(28)|0;h=g;i=(b|0)==0;j=(e|0)==0;k=(g|0)==0;if(i|j|k){if(!i){Rc(b)}if(!j){Rc(e)}if(k){l=0;return l|0}Rc(g);l=0;return l|0}k=a+92|0;j=Qc(64)|0;if((j|0)==0){Rc(b);Rc(e);Rc(g);l=0;return l|0}i=j;m=j+32|0;n=m;o=c[a+96>>2]|0;p=o>>>0<k>>>0?o:k;k=p+4|0;o=c[c[k>>2]>>2]|0;c[m>>2]=o;c[c[o+4>>2]>>2]=i;c[j>>2]=p;c[c[k>>2]>>2]=n;k=j+4|0;c[k>>2]=n;c[j+8>>2]=i;c[j+12>>2]=n;Vc(j+16|0,0,16)|0;c[j+36>>2]=i;c[j+40>>2]=n;c[j+44>>2]=i;Vc(j+48|0,0,16)|0;j=a|0;n=a+4|0;p=c[n>>2]|0;c[b+4>>2]=p;c[p>>2]=d;c[b>>2]=j;c[n>>2]=d;c[b+8>>2]=i;c[b+12>>2]=0;b=i;do{c[b+16>>2]=d;b=c[b+8>>2]|0;}while((b|0)!=(i|0));b=c[k>>2]|0;k=c[n>>2]|0;c[e+4>>2]=k;c[k>>2]=f;c[e>>2]=j;c[n>>2]=f;c[e+8>>2]=b;c[e+12>>2]=0;e=b;do{c[e+16>>2]=f;e=c[e+8>>2]|0;}while((e|0)!=(b|0));b=a+68|0;e=c[b>>2]|0;c[g+4>>2]=e;c[e>>2]=h;c[g>>2]=a+64;c[b>>2]=h;c[g+8>>2]=i;c[g+12>>2]=0;c[g+16>>2]=0;c[g+20>>2]=0;c[g+24>>2]=c[a+88>>2];a=i;while(1){c[a+20>>2]=h;g=c[a+12>>2]|0;if((g|0)==(i|0)){l=i;break}else{a=g}}return l|0}function rb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;if((a|0)==(b|0)){d=1;return d|0}e=c[b+16>>2]|0;f=a+16|0;g=c[f>>2]|0;if((e|0)==(g|0)){h=0}else{i=c[e+8>>2]|0;j=i;do{c[j+16>>2]=g;j=c[j+8>>2]|0;}while((j|0)!=(i|0));i=c[e+4>>2]|0;j=c[e>>2]|0;c[j+4>>2]=i;c[i>>2]=j;Rc(e);h=1}e=c[b+20>>2]|0;j=a+20|0;i=c[j>>2]|0;if((e|0)==(i|0)){k=0}else{g=c[e+8>>2]|0;l=g;do{c[l+20>>2]=i;l=c[l+12>>2]|0;}while((l|0)!=(g|0));g=c[e+4>>2]|0;l=c[e>>2]|0;c[l+4>>2]=g;c[g>>2]=l;Rc(e);k=1}e=b+8|0;l=c[e>>2]|0;g=a+8|0;i=c[g>>2]|0;c[(c[l+4>>2]|0)+12>>2]=a;c[(c[i+4>>2]|0)+12>>2]=b;c[e>>2]=i;c[g>>2]=l;if((h|0)==0){h=Qc(64)|0;l=h;if((h|0)==0){d=0;return d|0}g=c[f>>2]|0;i=g+4|0;e=c[i>>2]|0;c[h+4>>2]=e;c[e>>2]=l;c[h>>2]=g;c[i>>2]=l;c[h+8>>2]=b;c[h+12>>2]=0;h=b;do{c[h+16>>2]=l;h=c[h+8>>2]|0;}while((h|0)!=(b|0));c[(c[f>>2]|0)+8>>2]=a}if((k|0)!=0){d=1;return d|0}k=Qc(28)|0;f=k;if((k|0)==0){d=0;return d|0}h=c[j>>2]|0;l=h+4|0;i=c[l>>2]|0;c[k+4>>2]=i;c[i>>2]=f;c[k>>2]=h;c[l>>2]=f;c[k+8>>2]=b;c[k+12>>2]=0;c[k+16>>2]=0;c[k+20>>2]=0;c[k+24>>2]=c[h+24>>2];h=b;do{c[h+20>>2]=f;h=c[h+12>>2]|0;}while((h|0)!=(b|0));c[(c[j>>2]|0)+8>>2]=a;d=1;return d|0}function sb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;b=a+4|0;d=c[b>>2]|0;e=a+20|0;f=c[e>>2]|0;g=d+20|0;h=c[g>>2]|0;if((f|0)==(h|0)){i=0}else{j=c[f+8>>2]|0;k=j;do{c[k+20>>2]=h;k=c[k+12>>2]|0;}while((k|0)!=(j|0));j=c[f+4>>2]|0;k=c[f>>2]|0;c[k+4>>2]=j;c[j>>2]=k;Rc(f);i=1}f=a+8|0;do{if((c[f>>2]|0)==(a|0)){k=c[a+16>>2]|0;j=c[k+8>>2]|0;h=j;do{c[h+16>>2]=0;h=c[h+8>>2]|0;}while((h|0)!=(j|0));j=c[k+4>>2]|0;h=c[k>>2]|0;c[h+4>>2]=j;c[j>>2]=h;Rc(k)}else{h=c[b>>2]|0;c[(c[h+20>>2]|0)+8>>2]=c[h+12>>2];c[(c[a+16>>2]|0)+8>>2]=c[f>>2];h=c[(c[b>>2]|0)+12>>2]|0;j=c[f>>2]|0;l=h+8|0;m=c[l>>2]|0;c[(c[j+4>>2]|0)+12>>2]=h;c[(c[m+4>>2]|0)+12>>2]=a;c[f>>2]=m;c[l>>2]=j;if((i|0)!=0){break}j=Qc(28)|0;l=j;if((j|0)==0){n=0;return n|0}m=c[e>>2]|0;h=m+4|0;o=c[h>>2]|0;c[j+4>>2]=o;c[o>>2]=l;c[j>>2]=m;c[h>>2]=l;c[j+8>>2]=a;c[j+12>>2]=0;c[j+16>>2]=0;c[j+20>>2]=0;c[j+24>>2]=c[m+24>>2];m=a;do{c[m+20>>2]=l;m=c[m+12>>2]|0;}while((m|0)!=(a|0))}}while(0);i=d+8|0;if((c[i>>2]|0)==(d|0)){f=c[d+16>>2]|0;m=c[f+8>>2]|0;l=m;do{c[l+16>>2]=0;l=c[l+8>>2]|0;}while((l|0)!=(m|0));m=c[f+4>>2]|0;l=c[f>>2]|0;c[l+4>>2]=m;c[m>>2]=l;Rc(f);f=c[g>>2]|0;g=c[f+8>>2]|0;l=g;do{c[l+20>>2]=0;l=c[l+12>>2]|0;}while((l|0)!=(g|0));g=c[f+4>>2]|0;l=c[f>>2]|0;c[l+4>>2]=g;c[g>>2]=l;Rc(f)}else{f=d+4|0;c[(c[e>>2]|0)+8>>2]=c[(c[f>>2]|0)+12>>2];c[(c[d+16>>2]|0)+8>>2]=c[i>>2];e=c[(c[f>>2]|0)+12>>2]|0;f=c[i>>2]|0;l=e+8|0;g=c[l>>2]|0;c[(c[f+4>>2]|0)+12>>2]=e;c[(c[g+4>>2]|0)+12>>2]=d;c[i>>2]=g;c[l>>2]=f}f=c[b>>2]|0;b=f>>>0<a>>>0?f:a;a=c[b>>2]|0;f=c[c[b+4>>2]>>2]|0;c[c[a+4>>2]>>2]=f;c[c[f+4>>2]>>2]=a;Rc(b);n=1;return n|0}function tb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;b=Qc(64)|0;if((b|0)==0){d=0;return d|0}e=b;f=b+32|0;g=f;h=a+4|0;i=c[h>>2]|0;j=i>>>0<a>>>0?i:a;i=j+4|0;k=c[c[i>>2]>>2]|0;c[f>>2]=k;c[c[k+4>>2]>>2]=e;c[b>>2]=j;c[c[i>>2]>>2]=g;c[b+4>>2]=g;i=b+8|0;c[i>>2]=e;c[b+12>>2]=g;j=b+16|0;Vc(j|0,0,16)|0;c[b+36>>2]=e;c[b+40>>2]=g;c[b+44>>2]=e;Vc(b+48|0,0,16)|0;k=c[a+12>>2]|0;f=k+8|0;l=c[f>>2]|0;c[b+44>>2]=k;c[(c[l+4>>2]|0)+12>>2]=e;c[i>>2]=l;c[f>>2]=e;f=c[(c[h>>2]|0)+16>>2]|0;c[j>>2]=f;j=Qc(64)|0;h=j;if((j|0)==0){d=0;return d|0}l=f+4|0;i=c[l>>2]|0;c[j+4>>2]=i;c[i>>2]=h;c[j>>2]=f;c[l>>2]=h;c[j+8>>2]=g;c[j+12>>2]=0;j=g;do{c[j+16>>2]=h;j=c[j+8>>2]|0;}while((j|0)!=(g|0));g=c[a+20>>2]|0;c[b+52>>2]=g;c[b+20>>2]=g;d=e;return d|0}function ub(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;b=tb(a)|0;if((b|0)==0){d=0;return d|0}e=c[b+4>>2]|0;b=a+4|0;f=c[b>>2]|0;g=c[(c[f+4>>2]|0)+12>>2]|0;h=f+8|0;i=c[h>>2]|0;j=g+8|0;k=c[j>>2]|0;c[(c[i+4>>2]|0)+12>>2]=g;c[(c[k+4>>2]|0)+12>>2]=f;c[h>>2]=k;c[j>>2]=i;i=c[b>>2]|0;j=i+8|0;k=c[j>>2]|0;h=e+8|0;f=c[h>>2]|0;c[(c[k+4>>2]|0)+12>>2]=e;c[(c[f+4>>2]|0)+12>>2]=i;c[j>>2]=f;c[h>>2]=k;c[(c[b>>2]|0)+16>>2]=c[e+16>>2];k=e+4|0;h=c[k>>2]|0;c[(c[h+16>>2]|0)+8>>2]=h;c[(c[k>>2]|0)+20>>2]=c[(c[b>>2]|0)+20>>2];c[e+28>>2]=c[a+28>>2];c[(c[k>>2]|0)+28>>2]=c[(c[b>>2]|0)+28>>2];d=e;return d|0}function vb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=Qc(64)|0;if((d|0)==0){e=0;return e|0}f=d;g=d+32|0;h=g;i=a+4|0;j=c[i>>2]|0;k=j>>>0<a>>>0?j:a;j=k+4|0;l=c[c[j>>2]>>2]|0;c[g>>2]=l;c[c[l+4>>2]>>2]=f;c[d>>2]=k;c[c[j>>2]>>2]=h;c[d+4>>2]=h;j=d+8|0;c[j>>2]=f;c[d+12>>2]=h;k=d+16|0;Vc(k|0,0,16)|0;c[d+36>>2]=f;c[d+40>>2]=h;c[d+44>>2]=f;Vc(d+48|0,0,16)|0;l=c[b+20>>2]|0;g=a+20|0;m=c[g>>2]|0;if((l|0)==(m|0)){n=0;o=f}else{p=c[l+8>>2]|0;q=p;do{c[q+20>>2]=m;q=c[q+12>>2]|0;}while((q|0)!=(p|0));p=c[l+4>>2]|0;q=c[l>>2]|0;c[q+4>>2]=p;c[p>>2]=q;Rc(l);n=1;o=c[j>>2]|0}l=c[a+12>>2]|0;a=l+8|0;q=c[a>>2]|0;c[(c[o+4>>2]|0)+12>>2]=l;c[(c[q+4>>2]|0)+12>>2]=f;c[j>>2]=q;c[a>>2]=o;o=d+40|0;a=c[o>>2]|0;q=b+8|0;j=c[q>>2]|0;c[(c[a+4>>2]|0)+12>>2]=b;c[(c[j+4>>2]|0)+12>>2]=h;c[o>>2]=j;c[q>>2]=a;c[k>>2]=c[(c[i>>2]|0)+16>>2];c[d+48>>2]=c[b+16>>2];b=c[g>>2]|0;c[d+52>>2]=b;c[d+20>>2]=b;c[b+8>>2]=h;if(n){e=f;return e|0}n=Qc(28)|0;h=n;if((n|0)==0){e=0;return e|0}b=c[g>>2]|0;g=b+4|0;d=c[g>>2]|0;c[n+4>>2]=d;c[d>>2]=h;c[n>>2]=b;c[g>>2]=h;c[n+8>>2]=f;c[n+12>>2]=0;c[n+16>>2]=0;c[n+20>>2]=0;c[n+24>>2]=c[b+24>>2];b=f;while(1){c[b+20>>2]=h;n=c[b+12>>2]|0;if((n|0)==(f|0)){e=f;break}else{b=n}}return e|0}function wb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;b=c[a+8>>2]|0;d=c[b+12>>2]|0;while(1){e=c[d+12>>2]|0;c[d+20>>2]=0;f=d+4|0;if((c[(c[f>>2]|0)+20>>2]|0)==0){g=d+8|0;h=c[g>>2]|0;i=c[d+16>>2]|0;j=i+8|0;if((h|0)==(d|0)){k=c[j>>2]|0;l=k;do{c[l+16>>2]=0;l=c[l+8>>2]|0;}while((l|0)!=(k|0));k=c[i+4>>2]|0;l=c[i>>2]|0;c[l+4>>2]=k;c[k>>2]=l;Rc(i)}else{c[j>>2]=h;l=c[(c[f>>2]|0)+12>>2]|0;k=c[g>>2]|0;m=l+8|0;n=c[m>>2]|0;c[(c[k+4>>2]|0)+12>>2]=l;c[(c[n+4>>2]|0)+12>>2]=d;c[g>>2]=n;c[m>>2]=k}k=c[f>>2]|0;m=k+8|0;n=c[m>>2]|0;l=c[k+16>>2]|0;o=l+8|0;if((n|0)==(k|0)){p=c[o>>2]|0;q=p;do{c[q+16>>2]=0;q=c[q+8>>2]|0;}while((q|0)!=(p|0));p=c[l+4>>2]|0;q=c[l>>2]|0;c[q+4>>2]=p;c[p>>2]=q;Rc(l)}else{c[o>>2]=n;q=c[(c[k+4>>2]|0)+12>>2]|0;p=c[m>>2]|0;g=q+8|0;h=c[g>>2]|0;c[(c[p+4>>2]|0)+12>>2]=q;c[(c[h+4>>2]|0)+12>>2]=k;c[m>>2]=h;c[g>>2]=p}p=c[f>>2]|0;g=p>>>0<d>>>0?p:d;p=c[g>>2]|0;h=c[c[g+4>>2]>>2]|0;c[c[p+4>>2]>>2]=h;c[c[h+4>>2]>>2]=p;Rc(g)}if((d|0)==(b|0)){break}else{d=e}}d=c[a+4>>2]|0;b=c[a>>2]|0;c[b+4>>2]=d;c[d>>2]=b;Rc(a);return}function xb(){var a=0,b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;a=Qc(160)|0;if((a|0)==0){b=0;return b|0}d=a;e=a+64|0;f=e;g=a+92|0;h=g;i=a+124|0;j=i;c[a+4>>2]=d;c[a>>2]=d;c[a+8>>2]=0;c[a+12>>2]=0;c[a+68>>2]=f;c[e>>2]=f;Vc(a+72|0,0,20)|0;c[g>>2]=h;c[a+96>>2]=j;Vc(a+100|0,0,24)|0;c[i>>2]=j;c[a+128>>2]=h;Vc(a+132|0,0,24)|0;b=a;return b|0}function yb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=a+64|0;d=c[b>>2]|0;if((d|0)!=(b|0)){e=d;while(1){d=c[e>>2]|0;Rc(e);if((d|0)==(b|0)){break}else{e=d}}}e=a|0;b=c[a>>2]|0;if((b|0)!=(e|0)){d=b;while(1){b=c[d>>2]|0;Rc(d);if((b|0)==(e|0)){break}else{d=b}}}d=a+92|0;e=c[d>>2]|0;if((e|0)==(d|0)){f=a;Rc(f);return}else{g=e}while(1){e=c[g>>2]|0;Rc(g);if((e|0)==(d|0)){break}else{g=e}}f=a;Rc(f);return}function zb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;b=a+64|0;d=a|0;e=a+92|0;f=c[b>>2]|0;g=(c[f+4>>2]|0)==(b|0);a:do{if((f|0)==(b|0)){h=g}else{i=f;j=g;b:while(1){if(!j){k=4;break}l=c[i+8>>2]|0;m=l;while(1){n=c[m+4>>2]|0;if((n|0)==(m|0)){k=7;break b}if((c[n+4>>2]|0)!=(m|0)){k=9;break b}n=c[m+12>>2]|0;if((c[(c[n+8>>2]|0)+4>>2]|0)!=(m|0)){k=11;break b}if((c[(c[(c[m+8>>2]|0)+4>>2]|0)+12>>2]|0)!=(m|0)){k=13;break b}if((c[m+20>>2]|0)!=(i|0)){k=15;break b}if((n|0)==(l|0)){break}else{m=n}}m=c[i>>2]|0;l=(c[m+4>>2]|0)==(i|0);if((m|0)==(b|0)){h=l;break a}else{i=m;j=l}}if((k|0)==4){pa(1696,1688,753,1944)}else if((k|0)==7){pa(936,1688,756,1944)}else if((k|0)==9){pa(760,1688,757,1944)}else if((k|0)==11){pa(608,1688,758,1944)}else if((k|0)==13){pa(520,1688,759,1944)}else if((k|0)==15){pa(456,1688,760,1944)}}}while(0);if(!h){pa(288,1688,764,1944)}if((c[a+72>>2]|0)!=0){pa(288,1688,764,1944)}if((c[a+76>>2]|0)!=0){pa(288,1688,764,1944)}h=c[a>>2]|0;b=(c[h+4>>2]|0)==(d|0);c:do{if((h|0)==(d|0)){o=b}else{g=h;f=b;d:while(1){if(!f){k=24;break}j=c[g+8>>2]|0;i=j;l=c[j+4>>2]|0;while(1){if((l|0)==(i|0)){k=27;break d}if((c[l+4>>2]|0)!=(i|0)){k=29;break d}if((c[(c[(c[i+12>>2]|0)+8>>2]|0)+4>>2]|0)!=(i|0)){k=31;break d}m=c[i+8>>2]|0;n=c[m+4>>2]|0;if((c[n+12>>2]|0)!=(i|0)){k=33;break d}if((c[i+16>>2]|0)!=(g|0)){k=35;break d}if((m|0)==(j|0)){break}else{i=m;l=n}}l=c[g>>2]|0;i=(c[l+4>>2]|0)==(g|0);if((l|0)==(d|0)){o=i;break c}else{g=l;f=i}}if((k|0)==24){pa(128,1688,768,1944)}else if((k|0)==27){pa(936,1688,771,1944)}else if((k|0)==29){pa(760,1688,772,1944)}else if((k|0)==31){pa(608,1688,773,1944)}else if((k|0)==33){pa(520,1688,774,1944)}else if((k|0)==35){pa(56,1688,775,1944)}}}while(0);if(!o){pa(1624,1688,779,1944)}if((c[a+8>>2]|0)!=0){pa(1624,1688,779,1944)}if((c[a+12>>2]|0)!=0){pa(1624,1688,779,1944)}o=e;d=c[a+96>>2]|0;while(1){b=c[o>>2]|0;p=c[b+4>>2]|0;q=(c[p>>2]|0)==(d|0);if((b|0)==(e|0)){k=57;break}if(!q){k=44;break}if((p|0)==(b|0)){k=46;break}if((c[p+4>>2]|0)!=(b|0)){k=48;break}if((c[b+16>>2]|0)==0){k=50;break}if((c[p+16>>2]|0)==0){k=52;break}if((c[(c[(c[b+12>>2]|0)+8>>2]|0)+4>>2]|0)!=(b|0)){k=54;break}if((c[(c[(c[b+8>>2]|0)+4>>2]|0)+12>>2]|0)==(b|0)){o=b;d=p}else{k=56;break}}if((k|0)==44){pa(1544,1688,783,1944)}else if((k|0)==46){pa(936,1688,784,1944)}else if((k|0)==48){pa(760,1688,785,1944)}else if((k|0)==50){pa(1464,1688,786,1944)}else if((k|0)==52){pa(1400,1688,787,1944)}else if((k|0)==54){pa(608,1688,788,1944)}else if((k|0)==56){pa(520,1688,789,1944)}else if((k|0)==57){if(!q){pa(1176,1688,795,1944)}if((p|0)!=(a+124|0)){pa(1176,1688,795,1944)}if((c[p+4>>2]|0)!=(e|0)){pa(1176,1688,795,1944)}if((c[a+108>>2]|0)!=0){pa(1176,1688,795,1944)}if((c[p+16>>2]|0)!=0){pa(1176,1688,795,1944)}if((c[a+112>>2]|0)!=0){pa(1176,1688,795,1944)}if((c[p+20>>2]|0)==0){return}else{pa(1176,1688,795,1944)}}}function Ab(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,qa=0;d=i;i=i+48|0;e=d|0;f=d+16|0;g=d+32|0;h=a+128|0;c[h>>2]=0;j=b+64|0;b=j|0;k=c[b>>2]|0;if((k|0)==(j|0)){i=d;return}else{l=k}do{c[l+20>>2]=0;l=c[l>>2]|0;}while((l|0)!=(j|0));l=c[b>>2]|0;if((l|0)==(j|0)){i=d;return}b=a+120|0;k=e|0;m=e+8|0;n=e+4|0;o=f|0;p=f+8|0;q=f+4|0;r=g|0;s=g+8|0;t=g+4|0;u=l;a:do{do{if((c[u+24>>2]|0)!=0){l=u+20|0;if((c[l>>2]|0)!=0){break}v=c[u+8>>2]|0;do{if((c[b>>2]|0)==0){w=v+20|0;x=c[w>>2]|0;b:do{if((c[x+24>>2]|0)==0){y=0;z=0}else{A=0;B=0;C=v;D=w;E=x;while(1){if((c[E+20>>2]|0)!=0){y=A;z=B;break b}c[E+16>>2]=B;F=c[D>>2]|0;c[F+20>>2]=1;G=A+1|0;H=c[C+8>>2]|0;I=H+20|0;J=c[I>>2]|0;if((c[J+24>>2]|0)==0){y=G;z=F;break}else{A=G;B=F;C=H;D=I;E=J}}}}while(0);x=v+4|0;w=c[(c[x>>2]|0)+20>>2]|0;c:do{if((c[w+24>>2]|0)==0){K=y;L=z;M=v}else{E=y;D=z;C=v;B=x;A=w;while(1){if((c[A+20>>2]|0)!=0){K=E;L=D;M=C;break c}c[A+16>>2]=D;J=c[B>>2]|0;I=c[J+20>>2]|0;c[I+20>>2]=1;H=E+1|0;F=c[J+12>>2]|0;J=F+4|0;G=c[(c[J>>2]|0)+20>>2]|0;if((c[G+24>>2]|0)==0){K=H;L=I;M=F;break}else{E=H;D=I;C=F;B=J;A=G}}}}while(0);if((L|0)!=0){w=L;do{c[w+20>>2]=0;w=c[w+16>>2]|0;}while((w|0)!=0)}w=(K|0)>1;x=w?4:2;A=w?M:v;B=w?K:1;w=v+12|0;C=c[w>>2]|0;D=C+20|0;E=c[D>>2]|0;d:do{if((c[E+24>>2]|0)==0){N=0;O=0}else{G=0;J=0;F=C;I=D;H=E;while(1){if((c[H+20>>2]|0)!=0){N=G;O=J;break d}c[H+16>>2]=J;P=c[I>>2]|0;c[P+20>>2]=1;Q=G+1|0;R=c[F+8>>2]|0;S=R+20|0;T=c[S>>2]|0;if((c[T+24>>2]|0)==0){N=Q;O=P;break}else{G=Q;J=P;F=R;I=S;H=T}}}}while(0);E=C+4|0;D=c[(c[E>>2]|0)+20>>2]|0;e:do{if((c[D+24>>2]|0)==0){U=N;V=O;W=C}else{H=N;I=O;F=C;J=E;G=D;while(1){if((c[G+20>>2]|0)!=0){U=H;V=I;W=F;break e}c[G+16>>2]=I;T=c[J>>2]|0;S=c[T+20>>2]|0;c[S+20>>2]=1;R=H+1|0;P=c[T+12>>2]|0;T=P+4|0;Q=c[(c[T>>2]|0)+20>>2]|0;if((c[Q+24>>2]|0)==0){U=R;V=S;W=P;break}else{H=R;I=S;F=P;J=T;G=Q}}}}while(0);if((V|0)!=0){D=V;do{c[D+20>>2]=0;D=c[D+16>>2]|0;}while((D|0)!=0)}D=(U|0)>(B|0);E=D?4:x;C=D?W:A;G=D?U:B;D=v+8|0;J=c[(c[D>>2]|0)+4>>2]|0;F=J+20|0;I=c[F>>2]|0;f:do{if((c[I+24>>2]|0)==0){X=0;Y=0}else{H=0;Q=0;T=J;P=F;S=I;while(1){if((c[S+20>>2]|0)!=0){X=H;Y=Q;break f}c[S+16>>2]=Q;R=c[P>>2]|0;c[R+20>>2]=1;Z=H+1|0;_=c[T+8>>2]|0;$=_+20|0;aa=c[$>>2]|0;if((c[aa+24>>2]|0)==0){X=Z;Y=R;break}else{H=Z;Q=R;T=_;P=$;S=aa}}}}while(0);I=J+4|0;F=c[(c[I>>2]|0)+20>>2]|0;g:do{if((c[F+24>>2]|0)==0){ba=X;ca=Y;da=J}else{B=X;A=Y;x=J;S=I;P=F;while(1){if((c[P+20>>2]|0)!=0){ba=B;ca=A;da=x;break g}c[P+16>>2]=A;T=c[S>>2]|0;Q=c[T+20>>2]|0;c[Q+20>>2]=1;H=B+1|0;aa=c[T+12>>2]|0;T=aa+4|0;$=c[(c[T>>2]|0)+20>>2]|0;if((c[$+24>>2]|0)==0){ba=H;ca=Q;da=aa;break}else{B=H;A=Q;x=aa;S=T;P=$}}}}while(0);if((ca|0)!=0){F=ca;do{c[F+20>>2]=0;F=c[F+16>>2]|0;}while((F|0)!=0)}F=(ba|0)>(G|0);I=F?ba:G;Eb(e,v);J=c[k>>2]|0;if((J|0)>(I|0)){ea=J;fa=c[n>>2]|0;ga=c[m>>2]|0}else{ea=I;fa=F?da:C;ga=F?4:E}Eb(f,c[w>>2]|0);F=c[o>>2]|0;if((F|0)>(ea|0)){ha=F;ia=c[q>>2]|0;ja=c[p>>2]|0}else{ha=ea;ia=fa;ja=ga}Eb(g,c[(c[D>>2]|0)+4>>2]|0);F=c[r>>2]|0;if((F|0)<=(ha|0)){ka=ha;la=ia;ma=ja;break}ka=F;la=c[t>>2]|0;ma=c[s>>2]|0}else{ka=1;la=v;ma=2}}while(0);Sa[ma&7](a,la,ka);if((c[l>>2]|0)==0){na=39;break a}}}while(0);u=c[u>>2]|0;}while((u|0)!=(j|0));if((na|0)==39){pa(1112,1480,100,1752)}na=c[h>>2]|0;if((na|0)==0){i=d;return}j=c[a+3360>>2]|0;if((j|0)==28){Oa[c[a+132>>2]&31](4);oa=a+3540|0}else{u=a+3540|0;Pa[j&31](4,c[u>>2]|0);oa=u}u=a+120|0;j=a+3368|0;ka=a+140|0;la=a+3364|0;ma=a+136|0;s=na;na=-1;while(1){t=s+8|0;ja=na;ia=c[t>>2]|0;while(1){do{if((c[u>>2]|0)==0){qa=ja}else{ha=(c[(c[(c[ia+4>>2]|0)+20>>2]|0)+24>>2]|0)==0|0;if((ja|0)==(ha|0)){qa=ja;break}r=c[la>>2]|0;if((r|0)==22){Oa[c[ma>>2]&31](ha);qa=ha;break}else{Pa[r&31](ha,c[oa>>2]|0);qa=ha;break}}}while(0);l=c[j>>2]|0;if((l|0)==4){Oa[c[ka>>2]&31](c[(c[ia+16>>2]|0)+12>>2]|0)}else{Pa[l&31](c[(c[ia+16>>2]|0)+12>>2]|0,c[oa>>2]|0)}l=c[ia+12>>2]|0;if((l|0)==(c[t>>2]|0)){break}else{ja=qa;ia=l}}ia=c[s+16>>2]|0;if((ia|0)==0){break}else{s=ia;na=qa}}qa=c[a+3372>>2]|0;if((qa|0)==6){Ta[c[a+144>>2]&3]()}else{Oa[qa&31](c[oa>>2]|0)}c[h>>2]=0;i=d;return}function Bb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;d=b+64|0;b=c[d>>2]|0;if((b|0)==(d|0)){return}e=a+3360|0;f=a+132|0;g=a+3368|0;h=a+140|0;i=a+3540|0;j=a+3372|0;k=a+144|0;a=b;do{do{if((c[a+24>>2]|0)!=0){b=c[e>>2]|0;if((b|0)==28){Oa[c[f>>2]&31](2)}else{Pa[b&31](2,c[i>>2]|0)}b=a+8|0;l=c[b>>2]|0;do{m=c[g>>2]|0;if((m|0)==4){Oa[c[h>>2]&31](c[(c[l+16>>2]|0)+12>>2]|0)}else{Pa[m&31](c[(c[l+16>>2]|0)+12>>2]|0,c[i>>2]|0)}l=c[l+12>>2]|0;}while((l|0)!=(c[b>>2]|0));b=c[j>>2]|0;if((b|0)==6){Ta[c[k>>2]&3]();break}else{Oa[b&31](c[i>>2]|0);break}}}while(0);a=c[a>>2]|0;}while((a|0)!=(d|0));return}function Cb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0.0,i=0.0,j=0.0,k=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0,M=0,N=0,O=0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0,U=0,V=0,W=0,X=0;b=a+160|0;d=c[a+156>>2]|0;e=a+160+(d<<5)|0;if((d|0)<3){f=1;return f|0}g=+h[a+16>>3];i=+h[a+24>>3];j=+h[a+32>>3];do{if(g==0.0){if(i==0.0&j==0.0){k=a+192|0;if((d|0)<=2){break}l=+h[a+176>>3];m=+h[a+168>>3];n=+h[a+160>>3];o=+h[a+208>>3]-l;p=+h[a+200>>3]-m;q=+h[k>>3]-n;r=k;k=a+224|0;s=0.0;t=0.0;u=0.0;while(1){v=+h[k>>3]-n;w=+h[r+40>>3]-m;x=+h[r+48>>3]-l;y=p*x-o*w;z=o*v-q*x;A=q*w-p*v;if(u*A+(s*y+t*z)<0.0){B=s-y;C=u-A;D=t-z}else{B=s+y;C=u+A;D=t+z}E=k+32|0;if(E>>>0<e>>>0){o=x;p=w;q=v;r=k;k=E;s=B;t=D;u=C}else{F=B;G=D;H=C;break}}}else{F=g;G=i;H=j}if((d|0)>2){I=H;J=G;K=F;L=12}}else{I=j;J=i;K=g;L=12}}while(0);do{if((L|0)==12){k=a+192|0;g=+h[a+176>>3];i=+h[a+168>>3];j=+h[a+160>>3];F=+h[a+208>>3]-g;G=+h[a+200>>3]-i;H=+h[k>>3]-j;r=k;E=0;M=a+224|0;a:while(1){C=F;D=G;B=H;N=r;O=M;while(1){P=+h[O>>3]-j;Q=+h[N+40>>3]-i;R=+h[N+48>>3]-g;S=I*(B*Q-D*P)+(K*(D*R-C*Q)+J*(C*P-B*R));if(S!=0.0){break}T=O+32|0;if(T>>>0<e>>>0){C=R;D=Q;B=P;N=O;O=T}else{U=E;L=20;break a}}if(S>0.0){if((E|0)<0){f=0;L=51;break}else{V=1}}else{if((E|0)>0){f=0;L=51;break}else{V=-1}}N=O+32|0;if(N>>>0<e>>>0){F=R;G=Q;H=P;r=O;E=V;M=N}else{U=V;L=20;break}}if((L|0)==20){if((U|0)==0){break}else if((U|0)==2){f=0;return f|0}M=c[a+96>>2]|0;do{if((M|0)==100132){if((U|0)<0){f=1}else{break}return f|0}else if((M|0)==100133){if((U|0)>0){f=1}else{break}return f|0}else if((M|0)==100134){f=1;return f|0}}while(0);M=c[a+3360>>2]|0;if((M|0)==28){if((c[a+124>>2]|0)==0){W=(d|0)>3?6:4}else{W=2}Oa[c[a+132>>2]&31](W)}else{if((c[a+124>>2]|0)==0){X=(d|0)>3?6:4}else{X=2}Pa[M&31](X,c[a+3540>>2]|0)}M=a+3368|0;E=c[M>>2]|0;if((E|0)==4){Oa[c[a+140>>2]&31](c[a+184>>2]|0)}else{Pa[E&31](c[a+184>>2]|0,c[a+3540>>2]|0)}do{if((U|0)>0){if((d|0)<=1){break}E=a+140|0;r=a+3540|0;N=k;do{T=c[M>>2]|0;if((T|0)==4){Oa[c[E>>2]&31](c[N+24>>2]|0)}else{Pa[T&31](c[N+24>>2]|0,c[r>>2]|0)}N=N+32|0;}while(N>>>0<e>>>0)}else{N=d-1|0;if((N|0)<=0){break}r=a+140|0;E=a+3540|0;O=a+160+(N<<5)|0;do{N=c[M>>2]|0;if((N|0)==4){Oa[c[r>>2]&31](c[O+24>>2]|0)}else{Pa[N&31](c[O+24>>2]|0,c[E>>2]|0)}O=O-32|0;}while(O>>>0>b>>>0)}}while(0);M=c[a+3372>>2]|0;if((M|0)==6){Ta[c[a+144>>2]&3]();f=1;return f|0}else{Oa[M&31](c[a+3540>>2]|0);f=1;return f|0}}else if((L|0)==51){return f|0}}}while(0);f=1;return f|0}function Db(a,b,d){a=a|0;b=b|0;d=d|0;if((d|0)==1){d=a+128|0;a=b+20|0;c[(c[a>>2]|0)+16>>2]=c[d>>2];c[d>>2]=c[a>>2];c[(c[a>>2]|0)+20>>2]=1;return}else{pa(704,1480,243,2e3)}}function Eb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;d=b+20|0;e=c[d>>2]|0;a:do{if((c[e+24>>2]|0)==0){f=b;g=0;h=0}else{i=0;j=0;k=b;l=d;m=e;while(1){if((c[m+20>>2]|0)!=0){f=k;g=j;h=i;break a}c[m+16>>2]=j;n=c[l>>2]|0;c[n+20>>2]=1;o=i|1;p=c[(c[k+12>>2]|0)+4>>2]|0;q=p+20|0;r=c[q>>2]|0;if((c[r+24>>2]|0)==0){f=p;g=n;h=o;break a}if((c[r+20>>2]|0)!=0){f=p;g=n;h=o;break a}c[r+16>>2]=n;n=c[q>>2]|0;c[n+20>>2]=1;q=i+2|0;r=c[p+8>>2]|0;p=r+20|0;o=c[p>>2]|0;if((c[o+24>>2]|0)==0){f=r;g=n;h=q;break}else{i=q;j=n;k=r;l=p;m=o}}}}while(0);e=b+4|0;d=c[(c[e>>2]|0)+20>>2]|0;b:do{if((c[d+24>>2]|0)==0){s=b;t=g;u=0}else{m=0;l=g;k=b;j=e;i=d;while(1){if((c[i+20>>2]|0)!=0){s=k;t=l;u=m;break b}c[i+16>>2]=l;o=c[j>>2]|0;p=c[o+20>>2]|0;c[p+20>>2]=1;r=m|1;n=c[o+12>>2]|0;o=n+4|0;q=c[(c[o>>2]|0)+20>>2]|0;if((c[q+24>>2]|0)==0){s=n;t=p;u=r;break b}if((c[q+20>>2]|0)!=0){s=n;t=p;u=r;break b}c[q+16>>2]=p;p=c[o>>2]|0;o=c[p+20>>2]|0;c[o+20>>2]=1;q=m+2|0;r=c[(c[p+8>>2]|0)+4>>2]|0;p=r+4|0;n=c[(c[p>>2]|0)+20>>2]|0;if((c[n+24>>2]|0)==0){s=r;t=o;u=q;break}else{m=q;l=o;k=r;j=p;i=n}}}}while(0);d=u+h|0;do{if((h&1|0)==0){v=c[f+4>>2]|0;w=d}else{if((u&1|0)==0){v=s;w=d;break}v=c[s+8>>2]|0;w=d-1|0}}while(0);if((t|0)==0){x=a|0;c[x>>2]=w;y=a+4|0;c[y>>2]=v;z=a+8|0;c[z>>2]=6;return}else{A=t}do{c[A+20>>2]=0;A=c[A+16>>2]|0;}while((A|0)!=0);x=a|0;c[x>>2]=w;y=a+4|0;c[y>>2]=v;z=a+8|0;c[z>>2]=6;return}function Fb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;e=c[a+3360>>2]|0;if((e|0)==28){Oa[c[a+132>>2]&31](5)}else{Pa[e&31](5,c[a+3540>>2]|0)}e=a+3368|0;f=c[e>>2]|0;if((f|0)==4){Oa[c[a+140>>2]&31](c[(c[b+16>>2]|0)+12>>2]|0)}else{Pa[f&31](c[(c[b+16>>2]|0)+12>>2]|0,c[a+3540>>2]|0)}f=c[e>>2]|0;if((f|0)==4){Oa[c[a+140>>2]&31](c[(c[(c[b+4>>2]|0)+16>>2]|0)+12>>2]|0)}else{Pa[f&31](c[(c[(c[b+4>>2]|0)+16>>2]|0)+12>>2]|0,c[a+3540>>2]|0)}f=c[b+20>>2]|0;a:do{if((c[f+24>>2]|0)==0){g=d}else{h=a+140|0;i=a+3540|0;j=b;k=d;l=f;while(1){m=l+20|0;if((c[m>>2]|0)!=0){g=k;break a}c[m>>2]=1;m=k-1|0;n=c[(c[j+12>>2]|0)+4>>2]|0;o=c[e>>2]|0;if((o|0)==4){Oa[c[h>>2]&31](c[(c[n+16>>2]|0)+12>>2]|0)}else{Pa[o&31](c[(c[n+16>>2]|0)+12>>2]|0,c[i>>2]|0)}o=c[n+20>>2]|0;if((c[o+24>>2]|0)==0){g=m;break a}p=o+20|0;if((c[p>>2]|0)!=0){g=m;break a}c[p>>2]=1;p=k-2|0;m=c[n+8>>2]|0;n=c[e>>2]|0;if((n|0)==4){Oa[c[h>>2]&31](c[(c[(c[m+4>>2]|0)+16>>2]|0)+12>>2]|0)}else{Pa[n&31](c[(c[(c[m+4>>2]|0)+16>>2]|0)+12>>2]|0,c[i>>2]|0)}n=c[m+20>>2]|0;if((c[n+24>>2]|0)==0){g=p;break}else{j=m;k=p;l=n}}}}while(0);if((g|0)!=0){pa(920,1480,328,2016)}g=c[a+3372>>2]|0;if((g|0)==6){Ta[c[a+144>>2]&3]();return}else{Oa[g&31](c[a+3540>>2]|0);return}}function Gb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;e=c[a+3360>>2]|0;if((e|0)==28){Oa[c[a+132>>2]&31](6)}else{Pa[e&31](6,c[a+3540>>2]|0)}e=a+3368|0;f=c[e>>2]|0;if((f|0)==4){Oa[c[a+140>>2]&31](c[(c[b+16>>2]|0)+12>>2]|0)}else{Pa[f&31](c[(c[b+16>>2]|0)+12>>2]|0,c[a+3540>>2]|0)}f=c[e>>2]|0;if((f|0)==4){Oa[c[a+140>>2]&31](c[(c[(c[b+4>>2]|0)+16>>2]|0)+12>>2]|0)}else{Pa[f&31](c[(c[(c[b+4>>2]|0)+16>>2]|0)+12>>2]|0,c[a+3540>>2]|0)}f=c[b+20>>2]|0;a:do{if((c[f+24>>2]|0)==0){g=d}else{h=a+140|0;i=a+3540|0;j=b;k=d;l=f;while(1){m=l+20|0;if((c[m>>2]|0)!=0){g=k;break a}c[m>>2]=1;m=k-1|0;n=c[j+8>>2]|0;o=c[e>>2]|0;if((o|0)==4){Oa[c[h>>2]&31](c[(c[(c[n+4>>2]|0)+16>>2]|0)+12>>2]|0)}else{Pa[o&31](c[(c[(c[n+4>>2]|0)+16>>2]|0)+12>>2]|0,c[i>>2]|0)}o=c[n+20>>2]|0;if((c[o+24>>2]|0)==0){g=m;break}else{j=n;k=m;l=o}}}}while(0);if((g|0)!=0){pa(920,1480,300,2032)}g=c[a+3372>>2]|0;if((g|0)==6){Ta[c[a+144>>2]&3]();return}else{Oa[g&31](c[a+3540>>2]|0);return}}function Hb(a,b){a=a|0;b=b|0;return}function Ib(a,b){a=a|0;b=b|0;return}function Jb(a,b){a=a|0;b=b|0;return}function Kb(a){a=a|0;return}function Lb(a,b){a=a|0;b=b|0;return}function Mb(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return}function Nb(){var a=0,b=0;if((fc(64)|0)==0){a=0;return a|0}b=Qc(3544)|0;if((b|0)==0){a=0;return a|0}c[b>>2]=0;h[b+88>>3]=0.0;Vc(b+16|0,0,24)|0;c[b+96>>2]=100130;c[b+120>>2]=0;c[b+124>>2]=0;c[b+132>>2]=14;c[b+136>>2]=16;c[b+140>>2]=20;c[b+144>>2]=2;c[b+12>>2]=18;c[b+116>>2]=2;c[b+148>>2]=12;c[b+3360>>2]=28;c[b+3364>>2]=22;c[b+3368>>2]=4;c[b+3372>>2]=6;c[b+3376>>2]=18;c[b+3380>>2]=4;c[b+3540>>2]=0;a=b;return a|0}function Ob(a){a=a|0;return}function Pb(a){a=a|0;return}function Qb(a){a=a|0;return}function Rb(){return}function Sb(a){a=a|0;return}function Tb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return}function Ub(a){a=a|0;return}function Vb(a){a=a|0;if((c[a>>2]|0)!=0){Wb(a,0)}Rc(a);return}function Wb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=a|0;e=c[d>>2]|0;if((e|0)==(b|0)){return}f=a+3376|0;g=a+12|0;h=a+156|0;i=a+152|0;j=a+8|0;k=a+3540|0;l=a+4|0;m=e;while(1){do{if(m>>>0<b>>>0){if((m|0)==0){e=c[f>>2]|0;if((e|0)==18){Oa[c[g>>2]&31](100151)}else{Pa[e&31](100151,c[k>>2]|0)}if((c[d>>2]|0)!=0){Wb(a,0)}c[d>>2]=1;c[h>>2]=0;c[i>>2]=0;c[j>>2]=0;c[k>>2]=0;n=1;break}else if((m|0)!=1){n=m;break}e=c[f>>2]|0;if((e|0)==18){Oa[c[g>>2]&31](100152)}else{Pa[e&31](100152,c[k>>2]|0)}if((c[d>>2]|0)!=1){Wb(a,1)}c[d>>2]=2;c[l>>2]=0;if((c[h>>2]|0)<=0){n=2;break}c[i>>2]=1;n=2}else{if((m|0)==2){e=c[f>>2]|0;if((e|0)==18){Oa[c[g>>2]&31](100154)}else{Pa[e&31](100154,c[k>>2]|0)}if((c[d>>2]|0)!=2){Wb(a,2)}c[d>>2]=1;n=1;break}else if((m|0)==1){e=c[f>>2]|0;if((e|0)==18){Oa[c[g>>2]&31](100153)}else{Pa[e&31](100153,c[k>>2]|0)}e=c[j>>2]|0;if((e|0)!=0){yb(e)}c[d>>2]=0;c[l>>2]=0;c[j>>2]=0;n=0;break}else{n=m;break}}}while(0);if((n|0)==(b|0)){break}else{m=n}}return}function Xb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;switch(b|0){case 100105:{if((d|0)==0){e=2}else{e=d}c[a+116>>2]=e;return};case 100103:{if((d|0)==0){f=18}else{f=d}c[a+12>>2]=f;return};case 100109:{if((d|0)==0){g=18}else{g=d}c[a+3376>>2]=g;return};case 100100:{if((d|0)==0){h=14}else{h=d}c[a+132>>2]=h;return};case 100111:{if((d|0)==0){i=4}else{i=d}c[a+3380>>2]=i;return};case 100107:{if((d|0)==0){j=4}else{j=d}c[a+3368>>2]=j;return};case 100101:{if((d|0)==0){k=20}else{k=d}c[a+140>>2]=k;return};case 100106:{if((d|0)==0){l=28}else{l=d}c[a+3360>>2]=l;return};case 100112:{if((d|0)==0){m=12}else{m=d}c[a+148>>2]=m;return};case 100104:{if((d|0)==0){n=16}else{n=d}c[a+136>>2]=n;c[a+120>>2]=(d|0)!=0;return};case 100102:{c[a+144>>2]=(d|0)==0?2:d;return};case 100108:{if((d|0)==0){o=6}else{o=d}c[a+3372>>2]=o;return};case 100110:{if((d|0)==0){p=22}else{p=d}c[a+3364>>2]=p;c[a+120>>2]=(d|0)!=0;return};default:{d=c[a+3376>>2]|0;if((d|0)==18){Oa[c[a+12>>2]&31](100900);return}else{Pa[d&31](100900,c[a+3540>>2]|0);return}}}}function Yb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0,v=0.0,w=0,x=0,y=0;if((c[a>>2]|0)!=2){Wb(a,2)}e=a+152|0;a:do{if((c[e>>2]|0)!=0){f=xb()|0;g=a+8|0;c[g>>2]=f;b:do{if((f|0)!=0){i=a+156|0;j=c[i>>2]|0;k=a+160+(j<<5)|0;if((j|0)>0){j=a+4|0;l=a+160|0;m=c[j>>2]|0;while(1){n=l|0;o=c[l+24>>2]|0;if((m|0)==0){p=qb(c[g>>2]|0)|0;if((p|0)==0){break b}if((rb(p,c[p+4>>2]|0)|0)==0){break b}else{q=p}}else{if((ub(m)|0)==0){break b}q=c[m+12>>2]|0}p=q+16|0;c[(c[p>>2]|0)+12>>2]=o;o=c[p>>2]|0;h[o+16>>3]=+h[n>>3];h[o+24>>3]=+h[l+8>>3];h[o+32>>3]=+h[l+16>>3];c[q+28>>2]=1;c[(c[q+4>>2]|0)+28>>2]=-1;c[j>>2]=q;o=l+32|0;if(o>>>0<k>>>0){l=o;m=q}else{r=j;break}}}else{r=a+4|0}c[i>>2]=0;c[e>>2]=0;c[r>>2]=0;break a}}while(0);g=c[a+3376>>2]|0;if((g|0)==18){Oa[c[a+12>>2]&31](100902);return}else{Pa[g&31](100902,c[a+3540>>2]|0);return}}}while(0);s=+h[b>>3];r=s<-1.0e+150;t=r?-1.0e+150:s;q=t>1.0e+150;s=q?1.0e+150:t;t=+h[b+8>>3];g=t<-1.0e+150;u=g?-1.0e+150:t;f=u>1.0e+150;t=f?1.0e+150:u;u=+h[b+16>>3];b=u<-1.0e+150;v=b?-1.0e+150:u;j=v>1.0e+150;u=j?1.0e+150:v;do{if(r|q|g|f|b|j){m=c[a+3376>>2]|0;if((m|0)==18){Oa[c[a+12>>2]&31](100155);break}else{Pa[m&31](100155,c[a+3540>>2]|0);break}}}while(0);j=a+8|0;c:do{if((c[j>>2]|0)==0){b=a+156|0;f=c[b>>2]|0;if((f|0)<100){c[a+160+(f<<5)+24>>2]=d;h[a+160+(f<<5)>>3]=s;h[a+160+(f<<5)+8>>3]=t;h[a+160+(f<<5)+16>>3]=u;c[b>>2]=f+1;return}f=xb()|0;c[j>>2]=f;d:do{if((f|0)!=0){g=c[b>>2]|0;q=a+160+(g<<5)|0;if((g|0)>0){g=a+4|0;r=a+160|0;m=c[g>>2]|0;while(1){l=r|0;k=c[r+24>>2]|0;if((m|0)==0){o=qb(c[j>>2]|0)|0;if((o|0)==0){break d}if((rb(o,c[o+4>>2]|0)|0)==0){break d}else{w=o}}else{if((ub(m)|0)==0){break d}w=c[m+12>>2]|0}o=w+16|0;c[(c[o>>2]|0)+12>>2]=k;k=c[o>>2]|0;h[k+16>>3]=+h[l>>3];h[k+24>>3]=+h[r+8>>3];h[k+32>>3]=+h[r+16>>3];c[w+28>>2]=1;c[(c[w+4>>2]|0)+28>>2]=-1;c[g>>2]=w;k=r+32|0;if(k>>>0<q>>>0){r=k;m=w}else{break}}}c[b>>2]=0;c[e>>2]=0;break c}}while(0);b=c[a+3376>>2]|0;if((b|0)==18){Oa[c[a+12>>2]&31](100902);return}else{Pa[b&31](100902,c[a+3540>>2]|0);return}}}while(0);e=a+4|0;w=c[e>>2]|0;do{if((w|0)==0){b=qb(c[j>>2]|0)|0;if((b|0)==0){break}if((rb(b,c[b+4>>2]|0)|0)!=0){x=b;y=43}}else{if((ub(w)|0)==0){break}x=c[w+12>>2]|0;y=43}}while(0);if((y|0)==43){y=x+16|0;c[(c[y>>2]|0)+12>>2]=d;d=c[y>>2]|0;h[d+16>>3]=s;h[d+24>>3]=t;h[d+32>>3]=u;c[x+28>>2]=1;c[(c[x+4>>2]|0)+28>>2]=-1;c[e>>2]=x;return}x=c[a+3376>>2]|0;if((x|0)==18){Oa[c[a+12>>2]&31](100902);return}else{Pa[x&31](100902,c[a+3540>>2]|0);return}}function Zb(a,b){a=a|0;b=b|0;var d=0;d=a|0;if((c[d>>2]|0)!=0){Wb(a,0)}c[d>>2]=1;c[a+156>>2]=0;c[a+152>>2]=0;c[a+8>>2]=0;c[a+3540>>2]=b;return}function _b(a){a=a|0;var b=0;b=a|0;if((c[b>>2]|0)!=1){Wb(a,1)}c[b>>2]=2;c[a+4>>2]=0;if((c[a+156>>2]|0)<=0){return}c[a+152>>2]=1;return}function $b(a){a=a|0;var b=0;b=a|0;if((c[b>>2]|0)!=2){Wb(a,2)}c[b>>2]=1;return}function ac(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;b=1;d=0;e=i;i=i+168|0;c[e>>2]=0;while(1)switch(b|0){case 1:f=a+3384|0;g=Wc(f|0,b,e)|0;b=46;break;case 46:if((g|0)==0){b=5;break}else{b=2;break};case 2:j=c[a+3376>>2]|0;if((j|0)==18){b=4;break}else{b=3;break};case 3:ha(j|0,100902,c[a+3540>>2]|0);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;b=45;break;case 4:ga(c[a+12>>2]|0,100902);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;b=45;break;case 5:k=a|0;if((c[k>>2]|0)==1){b=7;break}else{b=6;break};case 6:ha(26,a|0,1);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;b=7;break;case 7:c[k>>2]=0;l=a+8|0;if((c[l>>2]|0)==0){b=8;break}else{b=23;break};case 8:if((c[a+120>>2]|0)==0){b=9;break}else{b=12;break};case 9:if((c[a+148>>2]|0)==12){b=10;break}else{b=12;break};case 10:m=ja(2,a|0)|0;if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;if((m|0)==0){b=12;break}else{b=11;break};case 11:c[a+3540>>2]=0;b=45;break;case 12:m=fa(2)|0;if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;c[l>>2]=m;if((m|0)==0){b=22;break}else{b=13;break};case 13:n=a+156|0;m=c[n>>2]|0;o=a+160+(m<<5)|0;if((m|0)>0){b=14;break}else{b=21;break};case 14:r=a+4|0;s=a+160|0;t=c[r>>2]|0;b=15;break;case 15:u=s|0;v=c[s+24>>2]|0;if((t|0)==0){b=16;break}else{b=18;break};case 16:w=ja(8,c[l>>2]|0)|0;if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;if((w|0)==0){b=22;break}else{b=17;break};case 17:m=ma(2,w|0,c[w+4>>2]|0)|0;if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;if((m|0)==0){b=22;break}else{x=w;b=20;break};case 18:m=ja(10,t|0)|0;if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;if((m|0)==0){b=22;break}else{b=19;break};case 19:x=c[t+12>>2]|0;b=20;break;case 20:m=x+16|0;c[(c[m>>2]|0)+12>>2]=v;y=c[m>>2]|0;h[y+16>>3]=+h[u>>3];h[y+24>>3]=+h[s+8>>3];h[y+32>>3]=+h[s+16>>3];c[x+28>>2]=1;c[(c[x+4>>2]|0)+28>>2]=-1;c[r>>2]=x;y=s+32|0;if(y>>>0<o>>>0){s=y;t=x;b=15;break}else{b=21;break};case 21:c[n>>2]=0;c[a+152>>2]=0;b=23;break;case 22:ha(10,f|0,1);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;;case 23:ga(10,a|0);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;y=ja(6,a|0)|0;if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;if((y|0)==0){b=24;break}else{b=25;break};case 24:ha(10,f|0,1);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;;case 25:z=c[l>>2]|0;if((c[a+100>>2]|0)==0){b=26;break}else{b=44;break};case 26:A=a+124|0;if((c[A>>2]|0)==0){b=28;break}else{b=27;break};case 27:y=ia(4,z|0,1,1)|0;if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;B=y;b=29;break;case 28:y=ja(4,z|0)|0;if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;B=y;b=29;break;case 29:if((B|0)==0){b=30;break}else{b=31;break};case 30:ha(10,f|0,1);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;;case 31:ga(2,z|0);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;if((c[a+132>>2]|0)==14){b=32;break}else{b=39;break};case 32:if((c[a+144>>2]|0)==2){b=33;break}else{b=39;break};case 33:if((c[a+140>>2]|0)==20){b=34;break}else{b=39;break};case 34:if((c[a+136>>2]|0)==16){b=35;break}else{b=39;break};case 35:if((c[a+3360>>2]|0)==28){b=36;break}else{b=39;break};case 36:if((c[a+3372>>2]|0)==6){b=37;break}else{b=39;break};case 37:if((c[a+3368>>2]|0)==4){b=38;break}else{b=39;break};case 38:if((c[a+3364>>2]|0)==22){b=42;break}else{b=39;break};case 39:if((c[A>>2]|0)==0){b=41;break}else{b=40;break};case 40:ha(12,a|0,z|0);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;b=42;break;case 41:ha(16,a|0,z|0);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;b=42;break;case 42:C=a+148|0;if((c[C>>2]|0)==12){b=44;break}else{b=43;break};case 43:ga(4,z|0);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;ga(c[C>>2]|0,z|0);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;c[l>>2]=0;c[a+3540>>2]=0;b=45;break;case 44:ga(8,z|0);if((p|0)!=0&(q|0)!=0){d=Xc(c[p>>2]|0,e)|0;if((d|0)>0){b=-1;break}else return}p=q=0;c[a+3540>>2]=0;c[l>>2]=0;b=45;break;case 45:return;case-1:if((d|0)==1){g=q;b=46}p=q=0;break}}function bc(a,b){a=a|0;b=b|0;var c=0.0,d=0.0,e=0;c=+h[a+40>>3];d=+h[b+40>>3];if(c<d){e=1;return e|0}if(!(c==d)){e=0;return e|0}e=+h[a+48>>3]<=+h[b+48>>3]|0;return e|0}function cc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0.0,e=0.0,f=0,g=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0;d=+h[a+40>>3];e=+h[b+40>>3];do{if(d<e){f=4}else{if(!(d==e)){break}if(!(+h[a+48>>3]>+h[b+48>>3])){f=4}}}while(0);do{if((f|0)==4){g=+h[c+40>>3];if(!(e<g)){if(!(e==g)){break}if(+h[b+48>>3]>+h[c+48>>3]){break}}i=e-d;j=g-e;g=i+j;if(!(g>0.0)){k=0.0;return+k}l=+h[b+48>>3];if(i<j){m=+h[a+48>>3];k=l-m+(m- +h[c+48>>3])*(i/g);return+k}else{i=+h[c+48>>3];k=l-i+(i- +h[a+48>>3])*(j/g);return+k}}}while(0);pa(720,1392,61,1984);return 0.0}function dc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0.0,e=0.0,f=0,g=0.0,i=0.0,j=0.0,k=0.0;d=+h[a+40>>3];e=+h[b+40>>3];do{if(d<e){f=4}else{if(!(d==e)){break}if(!(+h[a+48>>3]>+h[b+48>>3])){f=4}}}while(0);do{if((f|0)==4){g=+h[c+40>>3];if(!(e<g)){if(!(e==g)){break}if(+h[b+48>>3]>+h[c+48>>3]){break}}i=e-d;j=g-e;if(!(i+j>0.0)){k=0.0;return+k}g=+h[b+48>>3];k=i*(g- +h[c+48>>3])+j*(g- +h[a+48>>3]);return+k}}while(0);pa(720,1392,85,1968);return 0.0}function ec(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0.0,g=0.0,i=0,j=0,k=0,l=0,m=0.0,n=0,o=0,p=0,q=0,r=0.0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0,J=0,K=0,L=0,M=0.0,N=0,O=0,P=0,Q=0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0;f=+h[a+40>>3];g=+h[b+40>>3];do{if(f<g){i=a;j=b}else{if(f==g){if(!(+h[a+48>>3]>+h[b+48>>3])){i=a;j=b;break}}i=b;j=a}}while(0);g=+h[c+40>>3];f=+h[d+40>>3];do{if(g<f){k=c;l=d;m=g}else{if(g==f){if(!(+h[c+48>>3]>+h[d+48>>3])){k=c;l=d;m=g;break}}k=d;l=c;m=f}}while(0);f=+h[i+40>>3];do{if(f<m){n=i;o=j;p=k;q=l;r=m}else{if(f==m){if(!(+h[i+48>>3]>+h[k+48>>3])){n=i;o=j;p=k;q=l;r=m;break}}n=k;o=l;p=i;q=j;r=f}}while(0);j=p+40|0;i=o+40|0;f=+h[i>>3];l=r<f;do{if(l){s=17}else{if(r==f){if(!(+h[p+48>>3]>+h[o+48>>3])){s=17;break}}h[e+40>>3]=(r+f)*.5}}while(0);a:do{if((s|0)==17){m=+h[q+40>>3];k=f<m;do{if(!k){c=f==m;if(c){if(!(+h[o+48>>3]>+h[q+48>>3])){break}}g=+h[n+40>>3];do{if(!(g<r)){if(!(g==r)){pa(720,1392,85,1968)}if(!(+h[n+48>>3]>+h[p+48>>3])){break}pa(720,1392,85,1968)}}while(0);do{if(!l){if(!(r==f)){pa(720,1392,85,1968)}if(!(+h[p+48>>3]>+h[o+48>>3])){break}pa(720,1392,85,1968)}}while(0);t=r-g;u=f-r;if(t+u>0.0){v=+h[p+48>>3];w=t*(v- +h[o+48>>3])+u*(v- +h[n+48>>3])}else{w=0.0}do{if(!(g<m)){if(!(g==m)){pa(720,1392,85,1968)}if(!(+h[n+48>>3]>+h[q+48>>3])){break}pa(720,1392,85,1968)}}while(0);do{if(!(m<f)){if(!c){pa(720,1392,85,1968)}if(!(+h[q+48>>3]>+h[o+48>>3])){break}pa(720,1392,85,1968)}}while(0);v=m-g;u=f-m;if(v+u>0.0){t=+h[q+48>>3];x=v*(t- +h[o+48>>3])+u*(t- +h[n+48>>3])}else{x=0.0}if(w-x<0.0){y=-0.0-w;z=x}else{y=w;z=-0.0-x}t=y<0.0?0.0:y;u=z<0.0?0.0:z;do{if(t>u){A=m+(r-m)*(u/(u+t))}else{if(u==0.0){A=(r+m)*.5;break}else{A=r+(m-r)*(t/(u+t));break}}}while(0);h[e+40>>3]=A;break a}}while(0);t=+h[n+40>>3];do{if(!(t<r)){if(!(t==r)){pa(720,1392,61,1984)}if(!(+h[n+48>>3]>+h[p+48>>3])){break}pa(720,1392,61,1984)}}while(0);do{if(!l){if(!(r==f)){pa(720,1392,61,1984)}if(!(+h[p+48>>3]>+h[o+48>>3])){break}pa(720,1392,61,1984)}}while(0);u=r-t;g=f-r;v=u+g;do{if(v>0.0){B=+h[p+48>>3];if(u<g){C=+h[n+48>>3];D=B-C+(C- +h[o+48>>3])*(u/v);break}else{C=+h[o+48>>3];D=B-C+(C- +h[n+48>>3])*(g/v);break}}else{D=0.0}}while(0);do{if(!l){if(!(r==f)){pa(720,1392,61,1984)}if(!(+h[p+48>>3]>+h[o+48>>3])){break}pa(720,1392,61,1984)}}while(0);do{if(!k){if(!(f==m)){pa(720,1392,61,1984)}if(!(+h[o+48>>3]>+h[q+48>>3])){break}pa(720,1392,61,1984)}}while(0);v=m-f;u=g+v;do{if(u>0.0){t=+h[o+48>>3];if(g<v){C=+h[p+48>>3];E=t-C+(C- +h[q+48>>3])*(g/u);break}else{C=+h[q+48>>3];E=t-C+(C- +h[p+48>>3])*(v/u);break}}else{E=0.0}}while(0);if(D+E<0.0){F=-0.0-D;G=-0.0-E}else{F=D;G=E}u=F<0.0?0.0:F;v=G<0.0?0.0:G;do{if(u>v){H=f+(r-f)*(v/(v+u))}else{if(v==0.0){H=(r+f)*.5;break}else{H=r+g*(u/(v+u));break}}}while(0);h[e+40>>3]=H}}while(0);H=+h[n+48>>3];r=+h[o+48>>3];do{if(H<r){I=n;J=o}else{if(H==r){if(!(+h[n+40>>3]>+h[i>>3])){I=n;J=o;break}}I=o;J=n}}while(0);r=+h[p+48>>3];H=+h[q+48>>3];do{if(r<H){K=p;L=q;M=r}else{if(r==H){if(!(+h[j>>3]>+h[q+40>>3])){K=p;L=q;M=r;break}}K=q;L=p;M=H}}while(0);H=+h[I+48>>3];do{if(H<M){N=I;O=J;P=K;Q=L}else{if(H==M){if(!(+h[I+40>>3]>+h[K+40>>3])){N=I;O=J;P=K;Q=L;break}}N=K;O=L;P=I;Q=J}}while(0);M=+h[P+48>>3];H=+h[O+48>>3];J=M<H;do{if(!J){if(M==H){if(!(+h[P+40>>3]>+h[O+40>>3])){break}}h[e+48>>3]=(M+H)*.5;return}}while(0);r=+h[Q+48>>3];I=H<r;do{if(!I){L=H==r;if(L){if(!(+h[O+40>>3]>+h[Q+40>>3])){break}}f=+h[N+48>>3];do{if(!(f<M)){if(!(f==M)){pa(880,1392,140,1720)}if(!(+h[N+40>>3]>+h[P+40>>3])){break}pa(880,1392,140,1720)}}while(0);do{if(!J){if(!(M==H)){pa(880,1392,140,1720)}if(!(+h[P+40>>3]>+h[O+40>>3])){break}pa(880,1392,140,1720)}}while(0);G=M-f;F=H-M;if(G+F>0.0){E=+h[P+40>>3];R=G*(E- +h[O+40>>3])+F*(E- +h[N+40>>3])}else{R=0.0}do{if(!(f<r)){if(!(f==r)){pa(880,1392,140,1720)}if(!(+h[N+40>>3]>+h[Q+40>>3])){break}pa(880,1392,140,1720)}}while(0);do{if(!(r<H)){if(!L){pa(880,1392,140,1720)}if(!(+h[Q+40>>3]>+h[O+40>>3])){break}pa(880,1392,140,1720)}}while(0);E=r-f;F=H-r;if(E+F>0.0){G=+h[Q+40>>3];S=E*(G- +h[O+40>>3])+F*(G- +h[N+40>>3])}else{S=0.0}if(R-S<0.0){T=-0.0-R;U=S}else{T=R;U=-0.0-S}G=T<0.0?0.0:T;F=U<0.0?0.0:U;do{if(G>F){V=r+(M-r)*(F/(F+G))}else{if(F==0.0){V=(M+r)*.5;break}else{V=M+(r-M)*(G/(F+G));break}}}while(0);h[e+48>>3]=V;return}}while(0);V=+h[N+48>>3];do{if(!(V<M)){if(!(V==M)){pa(880,1392,116,1736)}if(!(+h[N+40>>3]>+h[P+40>>3])){break}pa(880,1392,116,1736)}}while(0);do{if(!J){if(!(M==H)){pa(880,1392,116,1736)}if(!(+h[P+40>>3]>+h[O+40>>3])){break}pa(880,1392,116,1736)}}while(0);U=M-V;V=H-M;T=U+V;do{if(T>0.0){S=+h[P+40>>3];if(U<V){R=+h[N+40>>3];W=S-R+(R- +h[O+40>>3])*(U/T);break}else{R=+h[O+40>>3];W=S-R+(R- +h[N+40>>3])*(V/T);break}}else{W=0.0}}while(0);do{if(!J){if(!(M==H)){pa(880,1392,116,1736)}if(!(+h[P+40>>3]>+h[O+40>>3])){break}pa(880,1392,116,1736)}}while(0);do{if(!I){if(!(H==r)){pa(880,1392,116,1736)}if(!(+h[O+40>>3]>+h[Q+40>>3])){break}pa(880,1392,116,1736)}}while(0);T=r-H;r=V+T;do{if(r>0.0){U=+h[O+40>>3];if(V<T){R=+h[P+40>>3];X=U-R+(R- +h[Q+40>>3])*(V/r);break}else{R=+h[Q+40>>3];X=U-R+(R- +h[P+40>>3])*(T/r);break}}else{X=0.0}}while(0);if(W+X<0.0){Y=-0.0-W;Z=-0.0-X}else{Y=W;Z=X}X=Y<0.0?0.0:Y;Y=Z<0.0?0.0:Z;do{if(X>Y){_=H+(M-H)*(Y/(Y+X))}else{if(Y==0.0){_=(M+H)*.5;break}else{_=M+V*(X/(Y+X));break}}}while(0);h[e+48>>3]=_;return}function fc(a){a=a|0;return 1}function gc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0.0,p=0,q=0.0,r=0,s=0.0,t=0,u=0,v=0.0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ba=0.0,ca=0.0,da=0,ea=0.0,fa=0,ga=0,ha=0,ia=0.0,ja=0.0,ka=0.0,la=0.0,ma=0.0,na=0.0,oa=0.0,pa=0.0,qa=0.0,ra=0.0,sa=0.0,ta=0.0,ua=0.0,va=0.0,wa=0.0,xa=0,ya=0,za=0,Aa=0.0;b=i;i=i+128|0;d=b|0;e=b+24|0;f=b+48|0;g=b+72|0;j=b+88|0;k=b+104|0;l=a+8|0;m=c[l>>2]|0;n=m|0;o=+h[a+16>>3];p=k|0;h[p>>3]=o;q=+h[a+24>>3];r=k+8|0;h[r>>3]=q;s=+h[a+32>>3];t=k+16|0;h[t>>3]=s;do{if(o==0.0){if(!(q==0.0&s==0.0)){u=0;v=q;w=34;break}x=d+16|0;h[x>>3]=-2.0e+150;y=d+8|0;h[y>>3]=-2.0e+150;z=d|0;h[z>>3]=-2.0e+150;A=e+16|0;h[A>>3]=2.0e+150;B=e+8|0;h[B>>3]=2.0e+150;C=e|0;h[C>>3]=2.0e+150;D=c[m>>2]|0;E=(D|0)==(n|0);if(E){F=-2.0e+150;G=2.0e+150;H=-2.0e+150;I=2.0e+150;J=-2.0e+150;K=2.0e+150}else{L=j|0;M=g|0;N=j+4|0;O=g+4|0;P=j+8|0;Q=g+8|0;R=D;S=2.0e+150;T=-2.0e+150;U=2.0e+150;V=-2.0e+150;W=2.0e+150;X=-2.0e+150;while(1){Y=+h[R+16>>3];if(Y<S){h[C>>3]=Y;c[L>>2]=R;Z=Y}else{Z=S}if(Y>T){h[z>>3]=Y;c[M>>2]=R;_=Y}else{_=T}Y=+h[R+24>>3];if(Y<U){h[B>>3]=Y;c[N>>2]=R;$=Y}else{$=U}if(Y>V){h[y>>3]=Y;c[O>>2]=R;aa=Y}else{aa=V}Y=+h[R+32>>3];if(Y<W){h[A>>3]=Y;c[P>>2]=R;ba=Y}else{ba=W}if(Y>X){h[x>>3]=Y;c[Q>>2]=R;ca=Y}else{ca=X}da=c[R>>2]|0;if((da|0)==(n|0)){F=aa;G=$;H=_;I=Z;J=ca;K=ba;break}else{R=da;S=Z;T=_;U=$;V=aa;W=ba;X=ca}}}R=F-G>H-I|0;Q=J-K>+h[d+(R<<3)>>3]- +h[e+(R<<3)>>3]?2:R;if(!(+h[e+(Q<<3)>>3]<+h[d+(Q<<3)>>3])){Vc(k|0,0,16)|0;h[t>>3]=1.0;ea=0.0;fa=1;ga=a+40|0;ha=a+64|0;break}R=c[j+(Q<<2)>>2]|0;x=c[g+(Q<<2)>>2]|0;X=+h[x+16>>3];W=+h[R+16>>3]-X;h[f>>3]=W;V=+h[x+24>>3];U=+h[R+24>>3]-V;h[f+8>>3]=U;T=+h[x+32>>3];S=+h[R+32>>3]-T;h[f+16>>3]=S;if(!E){Y=0.0;R=D;ia=q;while(1){ja=+h[R+16>>3]-X;ka=+h[R+24>>3]-V;la=+h[R+32>>3]-T;ma=U*la-S*ka;na=S*ja-W*la;la=W*ka-U*ja;ja=la*la+(ma*ma+na*na);if(ja>Y){h[p>>3]=ma;h[r>>3]=na;h[t>>3]=la;oa=ja;pa=na}else{oa=Y;pa=ia}x=c[R>>2]|0;if((x|0)==(n|0)){break}else{Y=oa;R=x;ia=pa}}if(oa>0.0){u=1;v=pa;w=34;break}}Vc(k|0,0,24)|0;if(U<0.0){qa=-0.0-U}else{qa=U}if(W<0.0){ra=-0.0-W}else{ra=W}R=qa>ra|0;if(S<0.0){sa=-0.0-S}else{sa=S}ia=+h[f+(R<<3)>>3];if(ia<0.0){ta=-0.0-ia}else{ta=ia}h[k+((sa>ta?2:R)<<3)>>3]=1.0;u=1;v=+h[r>>3];w=34}else{u=0;v=q;w=34}}while(0);do{if((w|0)==34){r=a+40|0;f=a+64|0;if(!(v<0.0)){ea=v;fa=u;ga=r;ha=f;break}ea=-0.0-v;fa=u;ga=r;ha=f}}while(0);v=+h[p>>3];if(v<0.0){ua=-0.0-v}else{ua=v}p=ea>ua|0;ua=+h[t>>3];if(ua<0.0){va=-0.0-ua}else{va=ua}ua=+h[k+(p<<3)>>3];if(ua<0.0){wa=-0.0-ua}else{wa=ua}t=va>wa?2:p;h[a+40+(t<<3)>>3]=0.0;p=((t+1|0)>>>0)%3|0;h[a+40+(p<<3)>>3]=1.0;u=((t+2|0)>>>0)%3|0;h[a+40+(u<<3)>>3]=0.0;h[a+64+(t<<3)>>3]=0.0;w=+h[k+(t<<3)>>3]>0.0;h[a+64+(p<<3)>>3]=w?-0.0:0.0;h[a+64+(u<<3)>>3]=w?1.0:-1.0;w=c[m>>2]|0;if((w|0)!=(n|0)){m=a+48|0;u=a+56|0;p=a+72|0;t=a+80|0;k=w;do{wa=+h[k+16>>3];va=+h[k+24>>3];ua=+h[k+32>>3];h[k+40>>3]=wa*+h[ga>>3]+va*+h[m>>3]+ua*+h[u>>3];h[k+48>>3]=wa*+h[ha>>3]+va*+h[p>>3]+ua*+h[t>>3];k=c[k>>2]|0;}while((k|0)!=(n|0))}if((fa|0)==0){i=b;return}fa=c[l>>2]|0;l=fa+64|0;ua=0.0;n=l;a:while(1){k=n;while(1){xa=c[k>>2]|0;if((xa|0)==(l|0)){break a}ya=c[xa+8>>2]|0;if((c[ya+28>>2]|0)<1){k=xa}else{za=ya;Aa=ua;break}}while(1){k=c[za+16>>2]|0;t=c[(c[za+4>>2]|0)+16>>2]|0;S=Aa+(+h[k+40>>3]- +h[t+40>>3])*(+h[k+48>>3]+ +h[t+48>>3]);t=c[za+12>>2]|0;if((t|0)==(ya|0)){ua=S;n=xa;continue a}else{za=t;Aa=S}}}za=fa|0;if(!(ua<0.0)){i=b;return}xa=c[fa>>2]|0;if((xa|0)!=(za|0)){fa=xa;do{xa=fa+48|0;h[xa>>3]=-0.0- +h[xa>>3];fa=c[fa>>2]|0;}while((fa|0)!=(za|0))}h[ha>>3]=-0.0- +h[ha>>3];ha=a+72|0;h[ha>>3]=-0.0- +h[ha>>3];ha=a+80|0;h[ha>>3]=-0.0- +h[ha>>3];i=b;return}function hc(a){a=a|0;var b=0,d=0,e=0,f=0;b=Qc(28)|0;if((b|0)==0){d=0;return d|0}c[b+8>>2]=0;c[b+12>>2]=32;e=Qc(132)|0;c[b>>2]=e;if((e|0)==0){Rc(b);d=0;return d|0}f=Qc(264)|0;c[b+4>>2]=f;if((f|0)==0){Rc(e);Rc(b);d=0;return d|0}else{c[b+20>>2]=0;c[b+16>>2]=0;c[b+24>>2]=a;c[e+4>>2]=1;c[f+8>>2]=0;d=b;return d|0}return 0}function ic(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0.0,o=0,p=0.0,q=0,r=0;d=c[a>>2]|0;e=c[a+4>>2]|0;f=c[d+(b<<2)>>2]|0;g=a+8|0;i=a+12|0;a=e+(f<<3)|0;j=b;while(1){b=j<<1;k=c[g>>2]|0;do{if((b|0)<(k|0)){l=b|1;m=c[e+(c[d+(l<<2)>>2]<<3)>>2]|0;n=+h[m+40>>3];o=c[e+(c[d+(b<<2)>>2]<<3)>>2]|0;p=+h[o+40>>3];if(!(n<p)){if(!(n==p)){q=b;break}if(+h[m+48>>3]>+h[o+48>>3]){q=b;break}}q=l}else{q=b}}while(0);if((q|0)>(c[i>>2]|0)){r=8;break}b=c[d+(q<<2)>>2]|0;if((q|0)>(k|0)){r=13;break}l=c[a>>2]|0;p=+h[l+40>>3];o=c[e+(b<<3)>>2]|0;n=+h[o+40>>3];if(p<n){r=13;break}if(p==n){if(!(+h[l+48>>3]>+h[o+48>>3])){r=13;break}}c[d+(j<<2)>>2]=b;c[e+(b<<3)+4>>2]=j;j=q}if((r|0)==8){pa(104,1328,112,2088)}else if((r|0)==13){c[d+(j<<2)>>2]=f;c[e+(f<<3)+4>>2]=j;return}}function jc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0.0,q=0.0;d=a+8|0;e=(c[d>>2]|0)+1|0;c[d>>2]=e;d=a+12|0;f=c[d>>2]|0;do{if((e<<1|0)>(f|0)){g=a|0;i=c[g>>2]|0;j=a+4|0;k=c[j>>2]|0;c[d>>2]=f<<1;l=Sc(i,f<<3|4)|0;c[g>>2]=l;if((l|0)==0){c[g>>2]=i;m=2147483647;return m|0}i=Sc(c[j>>2]|0,(c[d>>2]<<3)+8|0)|0;c[j>>2]=i;if((i|0)!=0){break}c[j>>2]=k;m=2147483647;return m|0}}while(0);d=a+16|0;f=c[d>>2]|0;k=c[a+4>>2]|0;if((f|0)==0){n=e}else{c[d>>2]=c[k+(f<<3)+4>>2];n=f}f=a|0;c[(c[f>>2]|0)+(e<<2)>>2]=n;c[k+(n<<3)+4>>2]=e;c[k+(n<<3)>>2]=b;if((c[a+20>>2]|0)!=0){b=c[f>>2]|0;f=c[a+4>>2]|0;a=c[b+(e<<2)>>2]|0;k=e>>1;a:do{if((k|0)==0){o=e}else{d=c[f+(a<<3)>>2]|0;p=+h[d+40>>3];j=d+48|0;d=e;i=k;while(1){g=c[b+(i<<2)>>2]|0;l=c[f+(g<<3)>>2]|0;q=+h[l+40>>3];if(q<p){o=d;break a}if(q==p){if(!(+h[l+48>>3]>+h[j>>3])){o=d;break a}}c[b+(d<<2)>>2]=g;c[f+(g<<3)+4>>2]=d;g=i>>1;if((g|0)==0){o=i;break}else{d=i;i=g}}}}while(0);c[b+(o<<2)>>2]=a;c[f+(a<<3)+4>>2]=o}if((n|0)==2147483647){pa(640,1328,207,1864);return 0}else{m=n;return m|0}return 0}function kc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0.0,q=0,r=0,s=0.0,t=0,u=0,v=0,w=0,x=0,y=0,z=0.0,A=0,B=0,C=0;d=c[a>>2]|0;e=c[a+4>>2]|0;if((b|0)<=0){pa(824,1328,241,1888)}if((c[a+12>>2]|0)<(b|0)){pa(824,1328,241,1888)}f=e+(b<<3)|0;if((c[f>>2]|0)==0){pa(824,1328,241,1888)}g=e+(b<<3)+4|0;i=c[g>>2]|0;j=a+8|0;k=c[d+(c[j>>2]<<2)>>2]|0;l=d+(i<<2)|0;c[l>>2]=k;c[e+(k<<3)+4>>2]=i;k=(c[j>>2]|0)-1|0;c[j>>2]=k;if((i|0)>(k|0)){c[f>>2]=0;m=a+16|0;n=c[m>>2]|0;c[g>>2]=n;c[m>>2]=b;return}do{if((i|0)>=2){k=i>>1;j=c[d+(k<<2)>>2]|0;o=c[e+(j<<3)>>2]|0;p=+h[o+40>>3];q=c[l>>2]|0;r=c[e+(q<<3)>>2]|0;s=+h[r+40>>3];if(p<s){break}if(p==s){if(!(+h[o+48>>3]>+h[r+48>>3])){break}}a:do{if((k|0)==0){t=i}else{u=r+48|0;v=i;w=k;x=j;y=o;z=p;while(1){if(z<s){t=v;break a}if(z==s){if(!(+h[y+48>>3]>+h[u>>3])){t=v;break a}}c[d+(v<<2)>>2]=x;c[e+(x<<3)+4>>2]=v;A=w>>1;if((A|0)==0){t=w;break a}B=c[d+(A<<2)>>2]|0;C=c[e+(B<<3)>>2]|0;v=w;w=A;x=B;y=C;z=+h[C+40>>3]}}}while(0);c[d+(t<<2)>>2]=q;c[e+(q<<3)+4>>2]=t;c[f>>2]=0;m=a+16|0;n=c[m>>2]|0;c[g>>2]=n;c[m>>2]=b;return}}while(0);ic(a,i);c[f>>2]=0;m=a+16|0;n=c[m>>2]|0;c[g>>2]=n;c[m>>2]=b;return}function lc(a){a=a|0;var b=0,d=0,e=0,f=0;b=Qc(28)|0;if((b|0)==0){d=0;return d|0}e=hc(a)|0;c[b>>2]=e;if((e|0)==0){Rc(b);d=0;return d|0}f=Qc(128)|0;c[b+4>>2]=f;if((f|0)==0){Rc(c[e+4>>2]|0);Rc(c[e>>2]|0);Rc(e);Rc(b);d=0;return d|0}else{c[b+12>>2]=0;c[b+16>>2]=32;c[b+20>>2]=0;c[b+24>>2]=a;d=b;return d|0}return 0}function mc(a){a=a|0;var b=0,d=0;if((a|0)==0){pa(688,592,78,1808)}b=c[a>>2]|0;if((b|0)!=0){Rc(c[b+4>>2]|0);Rc(c[b>>2]|0);Rc(b)}b=c[a+8>>2]|0;if((b|0)!=0){Rc(b)}b=c[a+4>>2]|0;if((b|0)==0){d=a;Rc(d);return}Rc(b);d=a;Rc(d);return}function nc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0.0,H=0,I=0.0,J=0,K=0,L=0,M=0,N=0,O=0,P=0.0,Q=0,R=0,S=0,T=0,U=0.0,V=0,W=0,X=0,Y=0,Z=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0;b=i;i=i+400|0;d=b|0;e=d|0;f=a+12|0;g=c[f>>2]|0;j=Qc((g<<2)+4|0)|0;k=j;l=a+8|0;c[l>>2]=k;if((j|0)==0){m=0;i=b;return m|0}j=k+(g-1<<2)|0;if(!(k>>>0>j>>>0)){n=k;o=c[a+4>>2]|0;while(1){c[n>>2]=o;p=n+4|0;if(p>>>0>j>>>0){break}else{n=p;o=o+4|0}}}c[d>>2]=k;c[d+4>>2]=j;j=d+8|0;d=2016473283;k=e;while(1){o=c[k>>2]|0;n=c[j-8+4>>2]|0;a:do{if(n>>>0>(o+40|0)>>>0){p=n;q=k;r=d;s=o;while(1){t=p;u=p+4|0;v=q;w=r;x=s;while(1){y=(_(w,1539415821)|0)+1|0;z=x;A=x+(((y>>>0)%(((t-z>>2)+1|0)>>>0)|0)<<2)|0;B=c[A>>2]|0;c[A>>2]=c[x>>2];c[x>>2]=B;A=u;C=x-4|0;while(1){D=C+4|0;E=c[D>>2]|0;F=c[E>>2]|0;G=+h[F+40>>3];H=c[B>>2]|0;I=+h[H+40>>3];b:do{if(G<I){J=C;K=D;L=E}else{M=C;N=D;O=F;P=G;Q=E;while(1){if(P==I){if(!(+h[O+48>>3]>+h[H+48>>3])){J=M;K=N;L=Q;break b}}R=N+4|0;S=c[R>>2]|0;T=c[S>>2]|0;U=+h[T+40>>3];if(U<I){J=N;K=R;L=S;break}else{M=N;N=R;O=T;P=U;Q=S}}}}while(0);E=A-4|0;F=c[E>>2]|0;D=c[F>>2]|0;G=+h[D+40>>3];c:do{if(I<G){V=A;W=E;X=F}else{Q=A;O=E;N=D;P=G;M=F;while(1){if(I==P){if(!(+h[H+48>>3]>+h[N+48>>3])){V=Q;W=O;X=M;break c}}S=O-4|0;T=c[S>>2]|0;R=c[T>>2]|0;U=+h[R+40>>3];if(I<U){V=O;W=S;X=T;break}else{Q=O;O=S;N=R;P=U;M=T}}}}while(0);c[K>>2]=X;c[W>>2]=L;if(K>>>0<W>>>0){A=W;C=K}else{break}}C=c[K>>2]|0;c[K>>2]=L;c[W>>2]=C;Y=v|0;if((K-z|0)<(t-W|0)){break}c[Y>>2]=x;c[v+4>>2]=J;C=v+8|0;if(p>>>0>(V+40|0)>>>0){v=C;w=y;x=V}else{Z=C;$=y;aa=V;ba=p;break a}}c[Y>>2]=V;c[v+4>>2]=p;w=v+8|0;if(J>>>0>(x+40|0)>>>0){p=J;q=w;r=y;s=x}else{Z=w;$=y;aa=x;ba=J;break}}}else{Z=k;$=d;aa=o;ba=n}}while(0);n=aa+4|0;if(!(n>>>0>ba>>>0)){o=n;do{n=c[o>>2]|0;d:do{if(o>>>0>aa>>>0){s=o;while(1){r=c[n>>2]|0;I=+h[r+40>>3];q=s-4|0;p=c[q>>2]|0;w=c[p>>2]|0;G=+h[w+40>>3];if(I<G){ca=s;break d}if(I==G){if(!(+h[r+48>>3]>+h[w+48>>3])){ca=s;break d}}c[s>>2]=p;if(q>>>0>aa>>>0){s=q}else{ca=q;break}}}else{ca=o}}while(0);c[ca>>2]=n;o=o+4|0;}while(!(o>>>0>ba>>>0))}o=Z-8|0;if(o>>>0<e>>>0){break}else{j=Z;d=$;k=o}}c[a+16>>2]=g;c[a+20>>2]=1;k=c[a>>2]|0;a=c[k+8>>2]|0;if((a|0)>0){$=a;do{ic(k,$);$=$-1|0;}while(($|0)>0);da=c[f>>2]|0}else{da=g}c[k+20>>2]=1;k=c[l>>2]|0;l=da-1|0;da=k+(l<<2)|0;if((l|0)<=0){m=1;i=b;return m|0}l=c[c[k>>2]>>2]|0;g=k;k=l;G=+h[l+40>>3];while(1){l=g+4|0;f=c[c[l>>2]>>2]|0;I=+h[f+40>>3];if(!(I<G)){if(!(I==G)){ea=38;break}if(+h[f+48>>3]>+h[k+48>>3]){ea=38;break}}if(l>>>0<da>>>0){g=l;k=f;G=I}else{m=1;ea=39;break}}if((ea|0)==38){pa(496,592,164,1792);return 0}else if((ea|0)==39){i=b;return m|0}return 0}function oc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;if((c[a+20>>2]|0)!=0){d=jc(c[a>>2]|0,b)|0;return d|0}e=a+12|0;f=c[e>>2]|0;g=f+1|0;c[e>>2]=g;e=a+16|0;h=c[e>>2]|0;do{if((g|0)>=(h|0)){i=a+4|0;j=c[i>>2]|0;c[e>>2]=h<<1;k=Sc(j,h<<3)|0;c[i>>2]=k;if((k|0)!=0){break}c[i>>2]=j;d=2147483647;return d|0}}while(0);if((f|0)==2147483647){pa(432,592,194,1768);return 0}c[(c[a+4>>2]|0)+(f<<2)>>2]=b;d=~f;return d|0}function pc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0.0,t=0,u=0;b=a+12|0;d=c[b>>2]|0;if((d|0)==0){e=c[a>>2]|0;f=c[e>>2]|0;g=c[e+4>>2]|0;i=f+4|0;j=c[i>>2]|0;k=g+(j<<3)|0;l=c[k>>2]|0;m=e+8|0;n=c[m>>2]|0;if((n|0)<=0){o=l;return o|0}p=c[f+(n<<2)>>2]|0;c[i>>2]=p;c[g+(p<<3)+4>>2]=1;c[k>>2]=0;k=e+16|0;c[g+(j<<3)+4>>2]=c[k>>2];c[k>>2]=j;j=(c[m>>2]|0)-1|0;c[m>>2]=j;if((j|0)<=0){o=l;return o|0}ic(e,1);o=l;return o|0}l=c[a+8>>2]|0;e=c[c[l+(d-1<<2)>>2]>>2]|0;j=c[a>>2]|0;a=j+8|0;m=c[a>>2]|0;do{if((m|0)==0){q=d}else{k=c[j>>2]|0;g=k+4|0;p=c[g>>2]|0;i=c[j+4>>2]|0;n=i+(p<<3)|0;f=c[n>>2]|0;r=+h[f+40>>3];s=+h[e+40>>3];if(!(r<s)){if(!(r==s)){q=d;break}if(+h[f+48>>3]>+h[e+48>>3]){q=d;break}}if((m|0)<=0){o=f;return o|0}t=c[k+(m<<2)>>2]|0;c[g>>2]=t;c[i+(t<<3)+4>>2]=1;c[n>>2]=0;n=j+16|0;c[i+(p<<3)+4>>2]=c[n>>2];c[n>>2]=p;p=(c[a>>2]|0)-1|0;c[a>>2]=p;if((p|0)<=0){o=f;return o|0}ic(j,1);o=f;return o|0}}while(0);while(1){u=q-1|0;if((u|0)<=0){break}if((c[c[l+(q-2<<2)>>2]>>2]|0)==0){q=u}else{break}}c[b>>2]=u;o=e;return o|0}function qc(a){a=a|0;var b=0,d=0,e=0,f=0.0,g=0.0;b=c[a+12>>2]|0;if((b|0)==0){d=c[a>>2]|0;e=c[(c[d+4>>2]|0)+(c[(c[d>>2]|0)+4>>2]<<3)>>2]|0;return e|0}d=c[c[(c[a+8>>2]|0)+(b-1<<2)>>2]>>2]|0;b=c[a>>2]|0;do{if((c[b+8>>2]|0)!=0){a=c[(c[b+4>>2]|0)+(c[(c[b>>2]|0)+4>>2]<<3)>>2]|0;f=+h[a+40>>3];g=+h[d+40>>3];if(f<g){e=a;return e|0}if(!(f==g)){break}if(+h[a+48>>3]>+h[d+48>>3]){break}else{e=a}return e|0}}while(0);e=d;return e|0}function rc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;if((b|0)>-1){kc(c[a>>2]|0,b);return}d=~b;if((c[a+16>>2]|0)<=(d|0)){pa(240,592,254,1840)}b=(c[a+4>>2]|0)+(d<<2)|0;if((c[b>>2]|0)==0){pa(240,592,254,1840)}c[b>>2]=0;b=a+12|0;d=c[b>>2]|0;if((d|0)<=0){return}e=c[a+8>>2]|0;a=d;while(1){d=a-1|0;if((c[c[e+(d<<2)>>2]>>2]|0)!=0){f=10;break}c[b>>2]=d;if((d|0)>0){a=d}else{f=10;break}}if((f|0)==10){return}}function sc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;b=i;i=i+80|0;d=b|0;e=b+24|0;f=b+48|0;g=b+64|0;c[a+100>>2]=0;j=a+8|0;k=(c[j>>2]|0)+92|0;l=c[k>>2]|0;a:do{if((l|0)!=(k|0)){m=f;n=g;o=f|0;p=f+4|0;q=g|0;r=e|0;s=e+8|0;t=e+16|0;u=a+3380|0;v=a+116|0;w=a+3540|0;x=l;b:while(1){y=c[x>>2]|0;z=c[x+12>>2]|0;A=x+16|0;B=c[A>>2]|0;C=c[(c[x+4>>2]|0)+16>>2]|0;do{if(+h[B+40>>3]==+h[C+40>>3]){if(!(+h[B+48>>3]==+h[C+48>>3])){D=x;E=z;break}F=z+12|0;if((c[F>>2]|0)==(x|0)){D=x;E=z;break}Vc(m|0,0,16)|0;c[n>>2]=c[560];c[n+4>>2]=c[561];c[n+8>>2]=c[562];c[n+12>>2]=c[563];G=c[z+16>>2]|0;H=G+12|0;c[o>>2]=c[H>>2];c[p>>2]=c[(c[A>>2]|0)+12>>2];h[r>>3]=+h[G+16>>3];h[s>>3]=+h[G+24>>3];h[t>>3]=+h[G+32>>3];c[H>>2]=0;G=c[u>>2]|0;if((G|0)==4){Va[c[v>>2]&3](r,o,q,H)}else{Ma[G&7](r,o,q,H,c[w>>2]|0)}if((c[H>>2]|0)==0){c[H>>2]=c[o>>2]}if((rb(z,x)|0)==0){I=12;break b}if((sb(x)|0)==0){I=14;break b}D=z;E=c[F>>2]|0}else{D=x;E=z}}while(0);if((c[E+12>>2]|0)==(D|0)){if((E|0)==(D|0)){J=y}else{if((E|0)==(y|0)){I=20}else{if((E|0)==(c[y+4>>2]|0)){I=20}else{K=y}}if((I|0)==20){I=0;K=c[y>>2]|0}if((sb(E)|0)==0){I=22;break}else{J=K}}if((D|0)==(J|0)){I=25}else{if((D|0)==(c[J+4>>2]|0)){I=25}else{L=J}}if((I|0)==25){I=0;L=c[J>>2]|0}if((sb(D)|0)==0){I=28;break}else{M=L}}else{M=y}if((M|0)==(k|0)){break a}else{x=M}}if((I|0)==12){za(a+3384|0,1);return 0}else if((I|0)==14){za(a+3384|0,1);return 0}else if((I|0)==22){za(a+3384|0,1);return 0}else if((I|0)==28){za(a+3384|0,1);return 0}}}while(0);M=lc(4)|0;k=a+108|0;c[k>>2]=M;if((M|0)==0){N=0;i=b;return N|0}L=c[j>>2]|0;D=L|0;J=L|0;while(1){L=c[J>>2]|0;if((L|0)==(D|0)){I=33;break}K=oc(M,L)|0;c[L+56>>2]=K;if((K|0)==2147483647){break}else{J=L|0}}do{if((I|0)==33){if((nc(M)|0)==0){break}J=lb(a,2)|0;D=a+104|0;c[D>>2]=J;if((J|0)==0){za(a+3384|0,1);return 0}Cc(a,-4.0e+150);Cc(a,4.0e+150);J=pc(c[k>>2]|0)|0;c:do{if((J|0)!=0){L=f;K=g;E=f|0;l=f+4|0;e=g|0;x=d|0;o=d+8|0;w=d+16|0;q=a+3380|0;r=a+116|0;v=a+3540|0;u=J;d:while(1){t=u;s=u+40|0;p=u+48|0;n=u+8|0;while(1){m=qc(c[k>>2]|0)|0;if((m|0)==0){break}if(!(+h[m+40>>3]==+h[s>>3])){break}if(!(+h[m+48>>3]==+h[p>>3])){break}m=pc(c[k>>2]|0)|0;z=c[n>>2]|0;A=c[m+8>>2]|0;Vc(L|0,0,16)|0;c[K>>2]=c[560];c[K+4>>2]=c[561];c[K+8>>2]=c[562];c[K+12>>2]=c[563];m=c[z+16>>2]|0;C=m+12|0;c[E>>2]=c[C>>2];c[l>>2]=c[(c[A+16>>2]|0)+12>>2];h[x>>3]=+h[m+16>>3];h[o>>3]=+h[m+24>>3];h[w>>3]=+h[m+32>>3];c[C>>2]=0;m=c[q>>2]|0;if((m|0)==4){Va[c[r>>2]&3](x,E,e,C)}else{Ma[m&7](x,E,e,C,c[v>>2]|0)}if((c[C>>2]|0)==0){c[C>>2]=c[E>>2]}if((rb(z,A)|0)==0){break d}}tc(a,t);u=pc(c[k>>2]|0)|0;if((u|0)==0){break c}}za(a+3384|0,1);return 0}}while(0);J=c[D>>2]|0;u=J+4|0;c[a+112>>2]=c[(c[c[c[u>>2]>>2]>>2]|0)+16>>2];E=c[c[u>>2]>>2]|0;e:do{if((E|0)==0){O=J}else{u=0;v=E;while(1){if((c[v+16>>2]|0)==0){if((c[v+24>>2]|0)==0){I=54;break}if((u|0)==0){P=1}else{I=56;break}}else{P=u}if((c[v+8>>2]|0)!=0){I=58;break}e=c[v>>2]|0;if((c[v+24>>2]|0)!=0){if((c[e+28>>2]|0)!=0){I=61;break}}c[e+24>>2]=0;ob(c[D>>2]|0,c[v+4>>2]|0);Rc(v);e=c[D>>2]|0;x=c[c[e+4>>2]>>2]|0;if((x|0)==0){O=e;break e}else{u=P;v=x}}if((I|0)==54){pa(800,1128,1188,2120);return 0}else if((I|0)==56){pa(664,1128,1189,2120);return 0}else if((I|0)==58){pa(568,1128,1191,2120);return 0}else if((I|0)==61){pa(472,1128,158,2136);return 0}}}while(0);mb(O);mc(c[k>>2]|0);D=c[j>>2]|0;E=D+64|0;J=c[E>>2]|0;do{if((J|0)==(E|0)){Q=D}else{v=J;while(1){u=c[v>>2]|0;x=c[v+8>>2]|0;e=c[x+12>>2]|0;if((e|0)==(x|0)){I=65;break}if((c[e+12>>2]|0)==(x|0)){e=c[x+8>>2]|0;r=e+28|0;c[r>>2]=(c[r>>2]|0)+(c[x+28>>2]|0);r=(c[e+4>>2]|0)+28|0;c[r>>2]=(c[r>>2]|0)+(c[(c[x+4>>2]|0)+28>>2]|0);if((sb(x)|0)==0){N=0;I=71;break}}if((u|0)==(E|0)){I=69;break}else{v=u}}if((I|0)==65){pa(552,1128,1290,2048);return 0}else if((I|0)==69){Q=c[j>>2]|0;break}else if((I|0)==71){i=b;return N|0}}}while(0);zb(Q);N=1;i=b;return N|0}}while(0);mc(c[k>>2]|0);c[k>>2]=0;N=0;i=b;return N|0}function tc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0.0,u=0,v=0.0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0.0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;d=i;i=i+32|0;e=d|0;f=a+112|0;c[f>>2]=b;g=b+8|0;j=c[g>>2]|0;k=j;while(1){l=c[k+24>>2]|0;if((l|0)!=0){break}m=c[k+8>>2]|0;if((m|0)==(j|0)){n=4;break}else{k=m}}if((n|0)==4){c[e>>2]=c[j+4>>2];j=a+104|0;k=c[(pb(c[j>>2]|0,e)|0)>>2]|0;e=k;m=k+4|0;o=c[c[(c[m>>2]|0)+8>>2]>>2]|0;p=o;q=c[k>>2]|0;r=c[o>>2]|0;o=q+4|0;if(+dc(c[(c[o>>2]|0)+16>>2]|0,b,c[q+16>>2]|0)==0.0){Ac(a,e,b);i=d;return}s=c[r+4>>2]|0;r=c[s+16>>2]|0;t=+h[r+40>>3];u=c[(c[o>>2]|0)+16>>2]|0;v=+h[u+40>>3];do{if(t<v){w=e}else{if(t==v){if(!(+h[r+48>>3]>+h[u+48>>3])){w=e;break}}w=p}}while(0);do{if((c[k+12>>2]|0)==0){if((c[w+24>>2]|0)!=0){break}p=c[g>>2]|0;vc(a,e,p,p,0,1);i=d;return}}while(0);do{if((w|0)==(e|0)){k=vb(c[(c[g>>2]|0)+4>>2]|0,c[q+12>>2]|0)|0;if((k|0)!=0){x=k;break}za(a+3384|0,1)}else{k=vb(c[(c[s+8>>2]|0)+4>>2]|0,c[g>>2]|0)|0;if((k|0)==0){za(a+3384|0,1)}else{x=c[k+4>>2]|0;break}}}while(0);g=w+24|0;do{if((c[g>>2]|0)==0){s=Qc(28)|0;if((s|0)==0){za(a+3384|0,1)}q=s;c[q>>2]=x;e=nb(c[j>>2]|0,c[m>>2]|0,s)|0;k=s+4|0;c[k>>2]=e;if((e|0)==0){za(a+3384|0,1)}c[s+24>>2]=0;c[s+16>>2]=0;c[s+20>>2]=0;c[x+24>>2]=s;e=(c[(c[q>>2]|0)+28>>2]|0)+(c[(c[c[(c[k>>2]|0)+4>>2]>>2]|0)+8>>2]|0)|0;c[s+8>>2]=e;a:do{switch(c[a+96>>2]|0){case 100130:{y=e&1;break};case 100131:{y=(e|0)!=0|0;break};case 100134:{if((e|0)>1){y=1;break a}y=(e|0)<-1|0;break};case 100132:{y=(e|0)>0|0;break};case 100133:{y=e>>>31;break};default:{pa(976,1128,253,2072)}}}while(0);c[s+12>>2]=y}else{e=w|0;if((sb(c[e>>2]|0)|0)==0){za(a+3384|0,1)}else{c[g>>2]=0;c[e>>2]=x;c[x+24>>2]=w;break}}}while(0);tc(a,b);i=d;return}b=c[(c[l>>2]|0)+16>>2]|0;w=l;do{z=c[c[(c[w+4>>2]|0)+4>>2]>>2]|0;w=z;A=z;B=c[A>>2]|0;}while((c[B+16>>2]|0)==(b|0));b=z+24|0;do{if((c[b>>2]|0)==0){C=w}else{l=z+4|0;x=vb(c[(c[c[c[(c[l>>2]|0)+8>>2]>>2]>>2]|0)+4>>2]|0,c[B+12>>2]|0)|0;if((x|0)==0){D=a+3384|0;za(D|0,1)}if((c[b>>2]|0)==0){pa(800,1128,171,2104)}if((sb(c[A>>2]|0)|0)==0){D=a+3384|0;za(D|0,1)}else{c[b>>2]=0;c[A>>2]=x;c[x+24>>2]=w;C=c[c[(c[l>>2]|0)+4>>2]>>2]|0;break}}}while(0);if((C|0)==0){D=a+3384|0;za(D|0,1)}D=C+4|0;w=c[c[(c[D>>2]|0)+8>>2]>>2]|0;A=c[w>>2]|0;b=uc(a,w,0)|0;w=b+8|0;B=c[w>>2]|0;if((B|0)!=(A|0)){vc(a,C,B,A,A,1);i=d;return}B=c[c[(c[D>>2]|0)+8>>2]>>2]|0;D=B;z=C|0;l=c[z>>2]|0;x=c[B>>2]|0;B=x+4|0;if((c[(c[l+4>>2]|0)+16>>2]|0)!=(c[(c[B>>2]|0)+16>>2]|0)){yc(a,C)|0}g=l+16|0;y=c[g>>2]|0;m=c[f>>2]|0;v=+h[m+40>>3];do{if(+h[y+40>>3]==v){if(!(+h[y+48>>3]==+h[m+48>>3])){E=0;F=C;G=A;H=m;I=v;break}if((rb(c[(c[A+4>>2]|0)+12>>2]|0,l)|0)==0){za(a+3384|0,1)}j=c[(c[z>>2]|0)+16>>2]|0;e=C;do{J=c[c[(c[e+4>>2]|0)+4>>2]>>2]|0;e=J;K=J;L=c[K>>2]|0;}while((c[L+16>>2]|0)==(j|0));j=J+24|0;do{if((c[j>>2]|0)==0){M=e}else{s=J+4|0;k=vb(c[(c[c[c[(c[s>>2]|0)+8>>2]>>2]>>2]|0)+4>>2]|0,c[L+12>>2]|0)|0;if((k|0)==0){N=a+3384|0;za(N|0,1)}if((c[j>>2]|0)==0){pa(800,1128,171,2104)}if((sb(c[K>>2]|0)|0)==0){N=a+3384|0;za(N|0,1)}else{c[j>>2]=0;c[K>>2]=k;c[k+24>>2]=e;M=c[c[(c[s>>2]|0)+4>>2]>>2]|0;break}}}while(0);if((M|0)==0){N=a+3384|0;za(N|0,1)}else{e=c[c[(c[M+4>>2]|0)+8>>2]>>2]|0;j=c[e>>2]|0;uc(a,e,D)|0;e=c[f>>2]|0;E=1;F=M;G=j;H=e;I=+h[e+40>>3];break}}else{E=0;F=C;G=A;H=m;I=v}}while(0);m=c[x+16>>2]|0;v=+h[m+40>>3];do{if(v==I){if(!(+h[m+48>>3]==+h[H+48>>3])){n=70;break}if((rb(b,c[(c[B>>2]|0)+12>>2]|0)|0)==0){za(a+3384|0,1)}else{O=uc(a,D,0)|0;break}}else{n=70}}while(0);do{if((n|0)==70){if((E|0)!=0){O=b;break}D=c[g>>2]|0;I=+h[D+40>>3];do{if(v<I){n=75}else{if(!(v==I)){P=l;break}if(+h[m+48>>3]>+h[D+48>>3]){P=l}else{n=75}}}while(0);if((n|0)==75){P=c[(c[B>>2]|0)+12>>2]|0}D=vb(c[(c[w>>2]|0)+4>>2]|0,P)|0;if((D|0)==0){za(a+3384|0,1)}H=c[D+8>>2]|0;vc(a,F,D,H,H,0);c[(c[(c[D+4>>2]|0)+24>>2]|0)+24>>2]=1;xc(a,F);i=d;return}}while(0);vc(a,F,c[O+8>>2]|0,G,G,1);i=d;return}function uc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;e=c[b>>2]|0;if((b|0)==(d|0)){f=e;return f|0}g=a+104|0;h=b;b=e;while(1){i=h+24|0;c[i>>2]=0;j=h+4|0;e=c[c[(c[j>>2]|0)+8>>2]>>2]|0;k=e;l=e;m=c[l>>2]|0;if((c[m+16>>2]|0)==(c[b+16>>2]|0)){n=m;o=b+8|0}else{p=e+24|0;if((c[p>>2]|0)==0){q=6;break}e=b+8|0;r=vb(c[(c[e>>2]|0)+4>>2]|0,c[m+4>>2]|0)|0;if((r|0)==0){q=11;break}if((c[p>>2]|0)==0){q=13;break}if((sb(c[l>>2]|0)|0)==0){q=16;break}c[p>>2]=0;c[l>>2]=r;c[r+24>>2]=k;n=r;o=e}if((c[o>>2]|0)!=(n|0)){if((rb(c[(c[n+4>>2]|0)+12>>2]|0,n)|0)==0){q=19;break}if((rb(b,n)|0)==0){q=21;break}}e=h|0;r=c[e>>2]|0;p=c[r+20>>2]|0;c[p+24>>2]=c[h+12>>2];c[p+8>>2]=r;r=c[e>>2]|0;if((c[i>>2]|0)!=0){if((c[r+28>>2]|0)!=0){q=24;break}}c[r+24>>2]=0;ob(c[g>>2]|0,c[j>>2]|0);Rc(h);r=c[l>>2]|0;if((k|0)==(d|0)){f=r;q=26;break}else{h=k;b=r}}if((q|0)==6){d=h|0;n=c[d>>2]|0;o=c[n+20>>2]|0;c[o+24>>2]=c[h+12>>2];c[o+8>>2]=n;n=c[d>>2]|0;do{if((c[i>>2]|0)!=0){if((c[n+28>>2]|0)==0){break}pa(472,1128,158,2136);return 0}}while(0);c[n+24>>2]=0;ob(c[g>>2]|0,c[j>>2]|0);Rc(h);f=b;return f|0}else if((q|0)==11){za(a+3384|0,1);return 0}else if((q|0)==13){pa(800,1128,171,2104);return 0}else if((q|0)==16){za(a+3384|0,1);return 0}else if((q|0)==19){za(a+3384|0,1);return 0}else if((q|0)==21){za(a+3384|0,1);return 0}else if((q|0)==24){pa(472,1128,158,2136);return 0}else if((q|0)==26){return f|0}return 0}function vc(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var i=0,j=0,k=0,l=0.0,m=0,n=0,o=0.0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;i=a+104|0;j=b+4|0;k=d;while(1){d=c[k+16>>2]|0;l=+h[d+40>>3];m=c[k+4>>2]|0;n=c[m+16>>2]|0;o=+h[n+40>>3];if(!(l<o)){if(!(l==o)){p=5;break}if(+h[d+48>>3]>+h[n+48>>3]){p=5;break}}n=Qc(28)|0;if((n|0)==0){p=7;break}c[n>>2]=m;d=nb(c[i>>2]|0,c[j>>2]|0,n)|0;c[n+4>>2]=d;if((d|0)==0){p=9;break}c[n+24>>2]=0;c[n+16>>2]=0;c[n+20>>2]=0;c[m+24>>2]=n;n=c[k+8>>2]|0;if((n|0)==(e|0)){p=11;break}else{k=n}}if((p|0)==5){pa(400,1128,361,2224)}else if((p|0)==7){za(a+3384|0,1)}else if((p|0)==9){za(a+3384|0,1)}else if((p|0)==11){k=c[c[(c[j>>2]|0)+8>>2]>>2]|0;e=c[(c[k>>2]|0)+4>>2]|0;if((f|0)==0){q=c[e+8>>2]|0}else{q=f}a:do{if((c[e+16>>2]|0)==(c[q+16>>2]|0)){f=a+96|0;n=b;m=q;d=1;r=j;s=k;t=e;b:while(1){u=s;if((c[t+8>>2]|0)!=(m|0)){if((rb(c[(c[t+4>>2]|0)+12>>2]|0,t)|0)==0){p=17;break}if((rb(c[(c[m+4>>2]|0)+12>>2]|0,t)|0)==0){p=19;break}}v=c[n+8>>2]|0;w=t+28|0;x=c[w>>2]|0;y=v-x|0;c[s+8>>2]=y;c:do{switch(c[f>>2]|0){case 100130:{z=y&1;break};case 100133:{z=y>>>31;break};case 100132:{z=(y|0)>0|0;break};case 100134:{if((y|0)>1){z=1;break c}z=(y|0)<-1|0;break};case 100131:{z=(v|0)!=(x|0)|0;break};default:{p=27;break b}}}while(0);c[s+12>>2]=z;c[n+20>>2]=1;do{if((d|0)==0){if((wc(a,n)|0)==0){break}c[w>>2]=(c[w>>2]|0)+(c[m+28>>2]|0);x=(c[t+4>>2]|0)+28|0;c[x>>2]=(c[x>>2]|0)+(c[(c[m+4>>2]|0)+28>>2]|0);x=c[n>>2]|0;if((c[n+24>>2]|0)!=0){if((c[x+28>>2]|0)!=0){p=32;break b}}c[x+24>>2]=0;ob(c[i>>2]|0,c[r>>2]|0);Rc(n);if((sb(m)|0)==0){p=35;break b}}}while(0);w=s+4|0;x=c[c[(c[w>>2]|0)+8>>2]>>2]|0;v=c[(c[x>>2]|0)+4>>2]|0;if((c[v+16>>2]|0)==(c[t+16>>2]|0)){n=u;m=t;d=0;r=w;s=x;t=v}else{A=u;B=x;C=v;break a}}if((p|0)==17){za(a+3384|0,1)}else if((p|0)==19){za(a+3384|0,1)}else if((p|0)==27){pa(976,1128,253,2072)}else if((p|0)==32){pa(472,1128,158,2136)}else if((p|0)==35){za(a+3384|0,1)}}else{A=b;B=k;C=e}}while(0);c[A+20>>2]=1;if(((c[A+8>>2]|0)-(c[C+28>>2]|0)|0)!=(c[B+8>>2]|0)){pa(152,1128,403,2224)}if((g|0)==0){return}xc(a,A);return}}function wc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0.0,q=0,r=0,s=0.0,t=0,u=0,v=0,w=0,x=0;d=i;i=i+56|0;e=d|0;f=d+24|0;g=d+40|0;j=b+4|0;k=c[c[(c[j>>2]|0)+8>>2]>>2]|0;l=c[b>>2]|0;m=c[k>>2]|0;n=l+16|0;o=c[n>>2]|0;p=+h[o+40>>3];q=m+16|0;r=c[q>>2]|0;s=+h[r+40>>3];do{if(!(p<s)){if(p==s){if(!(+h[o+48>>3]>+h[r+48>>3])){break}}t=l+4|0;if(+dc(c[(c[t>>2]|0)+16>>2]|0,r,o)<0.0){u=0;i=d;return u|0}c[b+20>>2]=1;c[(c[c[(c[j>>2]|0)+4>>2]>>2]|0)+20>>2]=1;if((ub(c[t>>2]|0)|0)==0){za(a+3384|0,1);return 0}if((rb(c[(c[m+4>>2]|0)+12>>2]|0,l)|0)==0){za(a+3384|0,1);return 0}else{u=1;i=d;return u|0}}}while(0);j=m+4|0;if(+dc(c[(c[j>>2]|0)+16>>2]|0,o,r)>0.0){u=0;i=d;return u|0}r=c[n>>2]|0;o=c[q>>2]|0;do{if(+h[r+40>>3]==+h[o+40>>3]){if(!(+h[r+48>>3]==+h[o+48>>3])){break}if((r|0)==(o|0)){u=1;i=d;return u|0}rc(c[a+108>>2]|0,c[r+56>>2]|0);q=c[(c[j>>2]|0)+12>>2]|0;m=g;Vc(f|0,0,16)|0;c[m>>2]=c[560];c[m+4>>2]=c[561];c[m+8>>2]=c[562];c[m+12>>2]=c[563];m=c[q+16>>2]|0;t=m+12|0;v=f|0;c[v>>2]=c[t>>2];c[f+4>>2]=c[(c[n>>2]|0)+12>>2];w=g|0;x=e|0;h[x>>3]=+h[m+16>>3];h[e+8>>3]=+h[m+24>>3];h[e+16>>3]=+h[m+32>>3];c[t>>2]=0;m=c[a+3380>>2]|0;if((m|0)==4){Va[c[a+116>>2]&3](x,v,w,t)}else{Ma[m&7](x,v,w,t,c[a+3540>>2]|0)}if((c[t>>2]|0)==0){c[t>>2]=c[v>>2]}if((rb(q,l)|0)==0){za(a+3384|0,1);return 0}else{u=1;i=d;return u|0}}}while(0);if((ub(c[j>>2]|0)|0)==0){za(a+3384|0,1);return 0}if((rb(l,c[(c[j>>2]|0)+12>>2]|0)|0)==0){za(a+3384|0,1);return 0}c[k+20>>2]=1;c[b+20>>2]=1;u=1;i=d;return u|0}function xc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0.0,y=0,z=0,A=0.0,B=0,C=0;d=a+104|0;e=a+112|0;f=c[c[(c[b+4>>2]|0)+8>>2]>>2]|0;g=b;a:while(1){if((c[f+20>>2]|0)!=0){g=f;f=c[c[(c[f+4>>2]|0)+8>>2]>>2]|0;continue}if((c[g+20>>2]|0)==0){b=c[c[(c[g+4>>2]|0)+4>>2]>>2]|0;if((b|0)==0){i=53;break}if((c[b+20>>2]|0)==0){i=53;break}else{j=g;k=b}}else{j=f;k=g}b=k+20|0;c[b>>2]=0;l=k|0;m=c[l>>2]|0;n=j|0;o=c[n>>2]|0;p=c[(c[m+4>>2]|0)+16>>2]|0;b:do{if((p|0)==(c[(c[o+4>>2]|0)+16>>2]|0)){q=o;r=m;s=j;t=k}else{u=k+4|0;v=c[c[(c[u>>2]|0)+8>>2]>>2]|0;w=c[v>>2]|0;x=+h[p+40>>3];y=w+4|0;z=c[(c[y>>2]|0)+16>>2]|0;A=+h[z+40>>3];B=x==A;if(B){if(+h[p+48>>3]==+h[z+48>>3]){i=10;break a}}do{if(x<A){i=14}else{if(B){if(!(+h[p+48>>3]>+h[z+48>>3])){i=14;break}}if(+dc(z,p,c[w+16>>2]|0)>0.0){q=o;r=m;s=j;t=k;break b}c[v+20>>2]=1;c[b>>2]=1;C=ub(w)|0;if((C|0)==0){i=22;break a}if((rb(c[m+12>>2]|0,c[y>>2]|0)|0)==0){i=24;break a}c[(c[(c[C+4>>2]|0)+20>>2]|0)+24>>2]=c[k+12>>2]}}while(0);if((i|0)==14){i=0;if(+dc(p,z,c[m+16>>2]|0)<0.0){q=o;r=m;s=j;t=k;break}c[b>>2]=1;c[(c[c[(c[u>>2]|0)+4>>2]>>2]|0)+20>>2]=1;w=ub(m)|0;if((w|0)==0){i=16;break a}if((rb(c[y>>2]|0,w)|0)==0){i=18;break a}c[(c[w+20>>2]|0)+24>>2]=c[k+12>>2]}if((c[j+24>>2]|0)!=0){w=c[n>>2]|0;if((c[w+28>>2]|0)!=0){i=28;break a}c[w+24>>2]=0;ob(c[d>>2]|0,c[j+4>>2]|0);Rc(j);if((sb(o)|0)==0){i=30;break a}w=c[c[(c[u>>2]|0)+8>>2]>>2]|0;q=c[w>>2]|0;r=m;s=w;t=k;break}if((c[k+24>>2]|0)==0){q=o;r=m;s=j;t=k;break}w=c[l>>2]|0;if((c[w+28>>2]|0)!=0){i=34;break a}c[w+24>>2]=0;ob(c[d>>2]|0,c[u>>2]|0);Rc(k);if((sb(m)|0)==0){i=36;break a}w=c[c[(c[j+4>>2]|0)+4>>2]>>2]|0;q=o;r=c[w>>2]|0;s=j;t=w}}while(0);o=r+16|0;m=q+16|0;c:do{if((c[o>>2]|0)!=(c[m>>2]|0)){l=c[(c[r+4>>2]|0)+16>>2]|0;n=c[(c[q+4>>2]|0)+16>>2]|0;do{if((l|0)!=(n|0)){if((c[t+24>>2]|0)!=0){break}if((c[s+24>>2]|0)!=0){break}b=c[e>>2]|0;if(!((l|0)==(b|0)|(n|0)==(b|0))){break}if((yc(a,t)|0)==0){break c}else{i=53;break a}}}while(0);wc(a,t)|0}}while(0);if((c[o>>2]|0)!=(c[m>>2]|0)){f=s;g=t;continue}n=c[r+4>>2]|0;l=c[q+4>>2]|0;if((c[n+16>>2]|0)!=(c[l+16>>2]|0)){f=s;g=t;continue}u=q+28|0;c[u>>2]=(c[u>>2]|0)+(c[r+28>>2]|0);u=l+28|0;c[u>>2]=(c[u>>2]|0)+(c[n+28>>2]|0);n=c[t>>2]|0;if((c[t+24>>2]|0)!=0){if((c[n+28>>2]|0)!=0){i=49;break}}c[n+24>>2]=0;ob(c[d>>2]|0,c[t+4>>2]|0);Rc(t);if((sb(r)|0)==0){i=51;break}f=s;g=c[c[(c[s+4>>2]|0)+4>>2]>>2]|0}if((i|0)==10){pa(984,1128,581,2176)}else if((i|0)==16){za(a+3384|0,1)}else if((i|0)==18){za(a+3384|0,1)}else if((i|0)==22){za(a+3384|0,1)}else if((i|0)==24){za(a+3384|0,1)}else if((i|0)==28){pa(472,1128,158,2136)}else if((i|0)==30){za(a+3384|0,1)}else if((i|0)==34){pa(472,1128,158,2136)}else if((i|0)==36){za(a+3384|0,1)}else if((i|0)==49){pa(472,1128,158,2136)}else if((i|0)==51){za(a+3384|0,1)}else if((i|0)==53){return}}function yc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0.0,D=0,E=0.0,F=0,G=0.0,H=0,I=0.0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0.0,R=0,S=0.0,T=0.0,U=0.0,V=0.0,W=0,X=0,Y=0.0,Z=0,_=0.0,$=0.0,aa=0.0,ba=0,ca=0.0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0;d=i;i=i+120|0;e=d|0;f=d+24|0;g=d+40|0;j=d+56|0;k=b+4|0;l=c[c[(c[k>>2]|0)+8>>2]>>2]|0;m=l;n=b|0;o=c[n>>2]|0;p=c[l>>2]|0;q=o+16|0;r=c[q>>2]|0;s=p+16|0;t=c[s>>2]|0;u=o+4|0;v=c[(c[u>>2]|0)+16>>2]|0;w=p+4|0;p=c[(c[w>>2]|0)+16>>2]|0;x=p+40|0;y=v+40|0;do{if(+h[x>>3]==+h[y>>3]){if(!(+h[p+48>>3]==+h[v+48>>3])){break}pa(72,1128,628,2200);return 0}}while(0);z=a+112|0;if(+dc(v,c[z>>2]|0,r)>0.0){pa(8,1128,629,2200);return 0}if(+dc(p,c[z>>2]|0,t)<0.0){pa(1576,1128,630,2200);return 0}A=c[z>>2]|0;if((r|0)==(A|0)|(t|0)==(A|0)){pa(1496,1128,631,2200);return 0}if((c[b+24>>2]|0)!=0){pa(1416,1128,632,2200);return 0}if((c[l+24>>2]|0)!=0){pa(1416,1128,632,2200);return 0}if((r|0)==(t|0)){B=0;i=d;return B|0}A=r+48|0;C=+h[A>>3];D=v+48|0;E=+h[D>>3];F=t+48|0;G=+h[F>>3];H=p+48|0;I=+h[H>>3];if((C>E?E:C)>(G<I?I:G)){B=0;i=d;return B|0}J=r+40|0;I=+h[J>>3];K=t+40|0;E=+h[K>>3];do{if(I<E){L=17}else{if(!(I!=E|C>G)){L=17;break}if(+dc(v,t,r)<0.0){B=0}else{break}i=d;return B|0}}while(0);do{if((L|0)==17){if(+dc(p,r,t)>0.0){B=0}else{break}i=d;return B|0}}while(0);ec(v,r,p,t,j);G=+h[A>>3];C=+h[D>>3];M=j+48|0;E=+h[M>>3];if((G>C?C:G)>E){pa(1352,1128,651,2200);return 0}G=+h[F>>3];C=+h[H>>3];if(E>(G<C?C:G)){pa(1136,1128,652,2200);return 0}G=+h[x>>3];C=+h[y>>3];N=j+40|0;I=+h[N>>3];if((G>C?C:G)>I){pa(1072,1128,653,2200);return 0}G=+h[K>>3];C=+h[J>>3];if(I>(G<C?C:G)){pa(1032,1128,654,2200);return 0}O=c[z>>2]|0;P=O+40|0;Q=+h[P>>3];do{if(I<Q){R=O+48|0;L=31}else{if(!(I==Q)){S=C;T=G;U=I;V=E;break}W=O+48|0;if(E>+h[W>>3]){S=C;T=G;U=I;V=E}else{R=W;L=31}}}while(0);if((L|0)==31){h[N>>3]=Q;E=+h[R>>3];h[M>>3]=E;S=+h[J>>3];T=+h[K>>3];U=Q;V=E}do{if(S<T){X=r;Y=S}else{if(S==T){if(!(+h[A>>3]>+h[F>>3])){X=r;Y=S;break}}X=t;Y=T}}while(0);do{if(Y<U){Z=X+48|0;L=40}else{if(!(Y==U)){_=U;$=S;aa=V;break}R=X+48|0;if(+h[R>>3]>V){_=U;$=S;aa=V}else{Z=R;L=40}}}while(0);if((L|0)==40){h[N>>3]=Y;V=+h[Z>>3];h[M>>3]=V;_=Y;$=+h[J>>3];aa=V}if(_==$){if(!(aa==+h[A>>3])){L=43}}else{L=43}do{if((L|0)==43){if(_==+h[K>>3]){if(aa==+h[F>>3]){break}}$=+h[P>>3];if(+h[y>>3]==$){if(+h[D>>3]==+h[O+48>>3]){ba=O;ca=$;L=50}else{L=48}}else{L=48}do{if((L|0)==48){if(!(+dc(v,O,j)<0.0)){break}A=c[z>>2]|0;ba=A;ca=+h[A+40>>3];L=50}}while(0);do{if((L|0)==50){if(+h[x>>3]==ca){if(!(+h[H>>3]==+h[ba+48>>3])){L=52}}else{L=52}if((L|0)==52){if(!(+dc(p,ba,j)>0.0)){break}}if((ub(c[u>>2]|0)|0)==0){za(a+3384|0,1);return 0}if((ub(c[w>>2]|0)|0)==0){za(a+3384|0,1);return 0}if((rb(c[(c[w>>2]|0)+12>>2]|0,o)|0)==0){za(a+3384|0,1);return 0}A=c[q>>2]|0;h[A+40>>3]=+h[N>>3];h[A+48>>3]=+h[M>>3];J=a+108|0;Z=oc(c[J>>2]|0,A)|0;A=c[q>>2]|0;c[A+56>>2]=Z;if((Z|0)==2147483647){mc(c[J>>2]|0);c[J>>2]=0;za(a+3384|0,1);return 0}J=f|0;c[J>>2]=c[r+12>>2];c[f+4>>2]=c[v+12>>2];c[f+8>>2]=c[t+12>>2];c[f+12>>2]=c[p+12>>2];Z=A+16|0;X=g|0;Vc(Z|0,0,24)|0;zc(A,r,v,X);zc(A,t,p,g+8|0);R=e|0;h[R>>3]=+h[Z>>3];h[e+8>>3]=+h[A+24>>3];h[e+16>>3]=+h[A+32>>3];Z=A+12|0;c[Z>>2]=0;A=c[a+3380>>2]|0;if((A|0)==4){Va[c[a+116>>2]&3](R,J,X,Z)}else{Ma[A&7](R,J,X,Z,c[a+3540>>2]|0)}do{if((c[Z>>2]|0)==0){X=a+100|0;if((c[X>>2]|0)!=0){break}J=c[a+3376>>2]|0;if((J|0)==18){Oa[c[a+12>>2]&31](100156)}else{Pa[J&31](100156,c[a+3540>>2]|0)}c[X>>2]=1}}while(0);c[l+20>>2]=1;c[b+20>>2]=1;c[(c[c[(c[k>>2]|0)+4>>2]>>2]|0)+20>>2]=1;B=0;i=d;return B|0}}while(0);Z=c[z>>2]|0;if((p|0)==(Z|0)){if((ub(c[u>>2]|0)|0)==0){za(a+3384|0,1);return 0}if((rb(c[w>>2]|0,o)|0)==0){za(a+3384|0,1);return 0}X=c[(c[n>>2]|0)+16>>2]|0;J=b;do{da=c[c[(c[J+4>>2]|0)+4>>2]>>2]|0;J=da;ea=da;fa=c[ea>>2]|0;}while((c[fa+16>>2]|0)==(X|0));X=da+24|0;do{if((c[X>>2]|0)==0){ga=J}else{R=da+4|0;A=vb(c[(c[c[c[(c[R>>2]|0)+8>>2]>>2]>>2]|0)+4>>2]|0,c[fa+12>>2]|0)|0;if((A|0)==0){ha=a+3384|0;za(ha|0,1);return 0}if((c[X>>2]|0)==0){pa(800,1128,171,2104);return 0}if((sb(c[ea>>2]|0)|0)==0){ha=a+3384|0;za(ha|0,1);return 0}else{c[X>>2]=0;c[ea>>2]=A;c[A+24>>2]=J;ga=c[c[(c[R>>2]|0)+4>>2]>>2]|0;break}}}while(0);if((ga|0)==0){ha=a+3384|0;za(ha|0,1);return 0}J=c[c[(c[ga+4>>2]|0)+8>>2]>>2]|0;X=c[J>>2]|0;uc(a,J,m)|0;vc(a,ga,c[(c[X+4>>2]|0)+12>>2]|0,X,X,1);B=1;i=d;return B|0}if((v|0)==(Z|0)){if((ub(c[w>>2]|0)|0)==0){za(a+3384|0,1);return 0}if((rb(c[o+12>>2]|0,c[(c[w>>2]|0)+12>>2]|0)|0)==0){za(a+3384|0,1);return 0}X=c[(c[(c[n>>2]|0)+4>>2]|0)+16>>2]|0;J=b;do{ia=c[c[(c[J+4>>2]|0)+4>>2]>>2]|0;J=ia;}while((c[(c[(c[ia>>2]|0)+4>>2]|0)+16>>2]|0)==(X|0));X=c[(c[(c[c[c[(c[ia+4>>2]|0)+8>>2]>>2]>>2]|0)+4>>2]|0)+8>>2]|0;c[n>>2]=c[(c[w>>2]|0)+12>>2];R=c[(uc(a,b,0)|0)+8>>2]|0;vc(a,J,R,c[(c[u>>2]|0)+8>>2]|0,X,1);B=1;i=d;return B|0}do{if(+dc(v,Z,j)<0.0){ja=c[z>>2]|0}else{c[b+20>>2]=1;c[(c[c[(c[k>>2]|0)+4>>2]>>2]|0)+20>>2]=1;if((ub(c[u>>2]|0)|0)==0){za(a+3384|0,1);return 0}else{X=c[z>>2]|0;R=c[q>>2]|0;h[R+40>>3]=+h[X+40>>3];h[R+48>>3]=+h[X+48>>3];ja=X;break}}}while(0);if(+dc(p,ja,j)>0.0){B=0;i=d;return B|0}c[l+20>>2]=1;c[b+20>>2]=1;if((ub(c[w>>2]|0)|0)==0){za(a+3384|0,1);return 0}Z=c[z>>2]|0;J=c[s>>2]|0;h[J+40>>3]=+h[Z+40>>3];h[J+48>>3]=+h[Z+48>>3];B=0;i=d;return B|0}}while(0);wc(a,b)|0;B=0;i=d;return B|0}function zc(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0.0,f=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0;e=+h[a+40>>3];f=+h[b+40>>3]-e;if(f<0.0){i=-0.0-f}else{i=f}f=+h[a+48>>3];j=+h[b+48>>3]-f;if(j<0.0){k=-0.0-j}else{k=j}j=i+k;k=+h[c+40>>3]-e;if(k<0.0){l=-0.0-k}else{l=k}k=+h[c+48>>3]-f;if(k<0.0){m=-0.0-k}else{m=k}k=l+m;m=j+k;l=k*.5/m;g[d>>2]=l;k=j*.5/m;g[d+4>>2]=k;m=l;l=k;d=a+16|0;h[d>>3]=+h[d>>3]+(m*+h[b+16>>3]+l*+h[c+16>>3]);d=a+24|0;h[d>>3]=+h[d>>3]+(m*+h[b+24>>3]+l*+h[c+24>>3]);d=a+32|0;h[d>>3]=+h[d>>3]+(m*+h[b+32>>3]+l*+h[c+32>>3]);return}function Ac(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0.0,i=0;e=c[b>>2]|0;f=c[e+16>>2]|0;g=+h[d+40>>3];do{if(+h[f+40>>3]==g){if(!(+h[f+48>>3]==+h[d+48>>3])){break}pa(952,1128,957,2152)}}while(0);f=c[e+4>>2]|0;i=c[f+16>>2]|0;do{if(+h[i+40>>3]==g){if(!(+h[i+48>>3]==+h[d+48>>3])){break}pa(952,1128,978,2152)}}while(0);if((ub(f)|0)==0){za(a+3384|0,1)}f=b+24|0;do{if((c[f>>2]|0)!=0){if((sb(c[e+8>>2]|0)|0)==0){za(a+3384|0,1)}else{c[f>>2]=0;break}}}while(0);if((rb(c[d+8>>2]|0,e)|0)==0){za(a+3384|0,1)}else{tc(a,d);return}}function Bc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,i=0,j=0,k=0,l=0,m=0.0,n=0.0;e=c[a+112>>2]|0;a=c[b>>2]|0;b=c[d>>2]|0;d=c[(c[a+4>>2]|0)+16>>2]|0;f=b+4|0;g=c[(c[f>>2]|0)+16>>2]|0;i=(g|0)==(e|0);if((d|0)!=(e|0)){j=c[a+16>>2]|0;if(i){k=+dc(d,e,j)>=0.0;l=k&1;return l|0}else{m=+cc(d,e,j);k=m>=+cc(c[(c[f>>2]|0)+16>>2]|0,e,c[b+16>>2]|0);l=k&1;return l|0}}if(!i){k=+dc(g,e,c[b+16>>2]|0)<=0.0;l=k&1;return l|0}g=c[a+16>>2]|0;m=+h[g+40>>3];a=c[b+16>>2]|0;n=+h[a+40>>3];do{if(!(m<n)){if(m==n){if(!(+h[g+48>>3]>+h[a+48>>3])){break}}k=+dc(e,a,g)>=0.0;l=k&1;return l|0}}while(0);k=+dc(e,g,a)<=0.0;l=k&1;return l|0}function Cc(a,b){a=a|0;b=+b;var d=0,e=0,f=0;d=Qc(28)|0;if((d|0)==0){za(a+3384|0,1)}e=qb(c[a+8>>2]|0)|0;if((e|0)==0){za(a+3384|0,1)}f=c[e+16>>2]|0;h[f+40>>3]=4.0e+150;h[f+48>>3]=b;f=c[(c[e+4>>2]|0)+16>>2]|0;h[f+40>>3]=-4.0e+150;h[f+48>>3]=b;c[a+112>>2]=f;c[d>>2]=e;c[d+8>>2]=0;c[d+12>>2]=0;c[d+24>>2]=0;c[d+16>>2]=1;c[d+20>>2]=0;e=c[a+104>>2]|0;f=nb(e,e|0,d)|0;c[d+4>>2]=f;if((f|0)==0){za(a+3384|0,1)}else{return}}function Dc(a){a=a|0;var b=0,d=0,e=0.0,f=0.0,g=0,i=0,j=0.0,k=0,l=0.0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;b=c[a+8>>2]|0;a=c[b+12>>2]|0;if((a|0)==(b|0)){pa(352,1016,82,1912);return 0}if((c[a+12>>2]|0)==(b|0)){pa(352,1016,82,1912);return 0}else{d=b}while(1){b=c[(c[d+4>>2]|0)+16>>2]|0;e=+h[b+40>>3];a=c[d+16>>2]|0;f=+h[a+40>>3];if(!(e<f)){if(!(e==f)){g=d;i=a;j=f;k=b;l=e;break}if(+h[b+48>>3]>+h[a+48>>3]){g=d;i=a;j=f;k=b;l=e;break}}d=c[(c[d+8>>2]|0)+4>>2]|0}while(1){if(!(j<l)){if(!(j==l)){break}if(+h[i+48>>3]>+h[k+48>>3]){break}}d=c[g+12>>2]|0;b=c[d+16>>2]|0;a=c[(c[d+4>>2]|0)+16>>2]|0;g=d;i=b;j=+h[b+40>>3];k=a;l=+h[a+40>>3]}k=c[(c[g+8>>2]|0)+4>>2]|0;a:do{if((c[g+12>>2]|0)==(k|0)){m=g;n=k}else{i=k;a=g;b:while(1){b=i+16|0;d=i+12|0;o=a;while(1){p=c[(c[o+4>>2]|0)+16>>2]|0;l=+h[p+40>>3];q=c[b>>2]|0;j=+h[q+40>>3];if(l<j){break}if(l==j){if(!(+h[p+48>>3]>+h[q+48>>3])){break}}c:do{if((c[d>>2]|0)==(o|0)){r=o}else{q=o;while(1){p=q+8|0;s=c[(c[p>>2]|0)+4>>2]|0;t=c[s+16>>2]|0;j=+h[t+40>>3];u=c[(c[s+4>>2]|0)+16>>2]|0;l=+h[u+40>>3];do{if(j<l){v=s}else{if(j==l){if(!(+h[t+48>>3]>+h[u+48>>3])){v=s;break}}if(+dc(c[(c[q+4>>2]|0)+16>>2]|0,c[q+16>>2]|0,t)<0.0){r=q;break c}v=c[(c[p>>2]|0)+4>>2]|0}}while(0);p=vb(q,v)|0;if((p|0)==0){w=0;x=40;break b}t=c[p+4>>2]|0;if((c[d>>2]|0)==(t|0)){r=t;break}else{q=t}}}}while(0);q=c[r+12>>2]|0;if((c[q+12>>2]|0)==(i|0)){m=q;n=i;break a}else{o=q}}b=c[d>>2]|0;d:do{if((b|0)==(o|0)){y=i}else{q=i;t=d;p=b;while(1){s=c[(c[p+4>>2]|0)+16>>2]|0;l=+h[s+40>>3];u=c[p+16>>2]|0;j=+h[u+40>>3];do{if(l<j){z=p}else{if(l==j){if(!(+h[s+48>>3]>+h[u+48>>3])){z=p;break}}if(+dc(c[q+16>>2]|0,c[(c[q+4>>2]|0)+16>>2]|0,s)>0.0){y=q;break d}z=c[t>>2]|0}}while(0);s=vb(z,q)|0;if((s|0)==0){w=0;x=40;break b}u=c[s+4>>2]|0;s=u+12|0;A=c[s>>2]|0;if((A|0)==(o|0)){y=u;break}else{q=u;t=s;p=A}}}}while(0);b=c[(c[y+8>>2]|0)+4>>2]|0;if((c[o+12>>2]|0)==(b|0)){m=o;n=b;break a}else{i=b;a=o}}if((x|0)==40){return w|0}}}while(0);y=c[n+12>>2]|0;if((y|0)==(m|0)){pa(784,1016,118,1912);return 0}if((c[y+12>>2]|0)==(m|0)){w=1;return w|0}else{B=n;C=y}while(1){y=vb(C,B)|0;if((y|0)==0){w=0;x=40;break}n=c[y+4>>2]|0;y=c[n+12>>2]|0;if((c[y+12>>2]|0)==(m|0)){w=1;x=40;break}else{B=n;C=y}}if((x|0)==40){return w|0}return 0}function Ec(a){a=a|0;var b=0,d=0,e=0,f=0;b=a+64|0;a=c[b>>2]|0;if((a|0)==(b|0)){d=1;return d|0}else{e=a}while(1){a=c[e>>2]|0;if((c[e+24>>2]|0)!=0){if((Dc(e)|0)==0){d=0;f=5;break}}if((a|0)==(b|0)){d=1;f=5;break}else{e=a}}if((f|0)==5){return d|0}return 0}function Fc(a){a=a|0;var b=0,d=0;b=a+64|0;a=c[b>>2]|0;if((a|0)==(b|0)){return}else{d=a}while(1){a=c[d>>2]|0;if((c[d+24>>2]|0)==0){wb(d)}if((a|0)==(b|0)){break}else{d=a}}return}function Gc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;e=a+92|0;a=c[e>>2]|0;if((a|0)==(e|0)){f=1;return f|0}g=-b|0;if((d|0)==0){d=a;while(1){h=c[d>>2]|0;i=c[(c[d+20>>2]|0)+24>>2]|0;if((c[(c[(c[d+4>>2]|0)+20>>2]|0)+24>>2]|0)==(i|0)){c[d+28>>2]=0}else{c[d+28>>2]=(i|0)!=0?b:g}if((h|0)==(e|0)){f=1;break}else{d=h}}return f|0}else{j=a}while(1){a=c[j>>2]|0;d=c[(c[j+20>>2]|0)+24>>2]|0;if((c[(c[(c[j+4>>2]|0)+20>>2]|0)+24>>2]|0)==(d|0)){if((sb(j)|0)==0){f=0;k=11;break}}else{c[j+28>>2]=(d|0)!=0?b:g}if((a|0)==(e|0)){f=1;k=11;break}else{j=a}}if((k|0)==11){return f|0}return 0}function Hc(a,b){a=a|0;b=b|0;return}function Ic(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0;d=b+12|0;e=c[d>>2]|0;if((e|0)==0){c[d>>2]=a;return}d=b+8|0;f=c[d>>2]|0;if((f|0)==0){c[d>>2]=a;return}else{g=c[e+24>>2]|0;e=c[f+24>>2]|0;f=c[a+24>>2]|0;h=Qc(16)|0;i=b|0;c[h+12>>2]=c[i>>2];c[h>>2]=g;c[h+4>>2]=e;c[h+8>>2]=f;f=b+4|0;c[f>>2]=(c[f>>2]|0)+1;c[i>>2]=h;c[d>>2]=a;return}}function Jc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=b+8|0;e=c[d>>2]|0;if((e|0)==0){c[d>>2]=a;return}f=b+12|0;g=c[f>>2]|0;if((g|0)==0){c[f>>2]=a;return}h=b+24|0;i=(c[h>>2]|0)==0;if(i){j=c[e+24>>2]|0;k=c[g+24>>2]|0;l=c[a+24>>2]|0;m=Qc(16)|0;n=b|0;c[m+12>>2]=c[n>>2];c[m>>2]=j;c[m+4>>2]=k;c[m+8>>2]=l;l=b+4|0;c[l>>2]=(c[l>>2]|0)+1;c[n>>2]=m}else{m=c[g+24>>2]|0;n=c[e+24>>2]|0;e=c[a+24>>2]|0;l=Qc(16)|0;k=b|0;c[l+12>>2]=c[k>>2];c[l>>2]=m;c[l+4>>2]=n;c[l+8>>2]=e;e=b+4|0;c[e>>2]=(c[e>>2]|0)+1;c[k>>2]=l}c[h>>2]=i&1;c[d>>2]=g;c[f>>2]=a;return}function Kc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0;d=b+12|0;e=c[d>>2]|0;if((e|0)==0){c[d>>2]=a;return}f=b+8|0;g=c[f>>2]|0;if((g|0)==0){c[f>>2]=a;return}else{h=c[e+24>>2]|0;e=c[g+24>>2]|0;g=c[a+24>>2]|0;a=Qc(16)|0;i=b|0;c[a+12>>2]=c[i>>2];c[a>>2]=h;c[a+4>>2]=e;c[a+8>>2]=g;g=b+4|0;c[g>>2]=(c[g>>2]|0)+1;c[i>>2]=a;c[d>>2]=0;c[f>>2]=0;return}}function Lc(a,b){a=a|0;b=b|0;Pa[c[b+28>>2]&31](a,b);return}function Mc(a,b){a=a|0;b=b|0;var d=0,e=0;d=i;c[b+12>>2]=0;c[b+8>>2]=0;c[b+24>>2]=0;if((a|0)==4){c[b+28>>2]=8;i=d;return}else if((a|0)==5){c[b+28>>2]=20;i=d;return}else if((a|0)==6){c[b+28>>2]=14;i=d;return}else{ra(c[m>>2]|0,216,(e=i,i=i+8|0,c[e>>2]=a,e)|0)|0;i=e;c[b+28>>2]=6;i=d;return}}function Nc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0.0,i=0.0;g=+h[a>>3];i=+h[a+8>>3];a=Qc(32)|0;d=a;b=f+16|0;f=c[b>>2]|0;c[a+28>>2]=f;h[a>>3]=g;h[a+8>>3]=i;h[a+16>>3]=0.0;if((f|0)==0){c[a+24>>2]=0;c[b>>2]=d;c[e>>2]=a;return}else{c[a+24>>2]=(c[f+24>>2]|0)+1;c[b>>2]=d;c[e>>2]=a;return}}function Oc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,i=0,j=0,k=0,l=0,m=0;g=a+16|0;i=(c[(c[g>>2]|0)+24>>2]|0)+1|0;c[e>>2]=i;e=a+4|0;j=c[e>>2]|0;c[f>>2]=j;c[b>>2]=Qc(i<<4)|0;i=c[e>>2]|0;if((i|0)==0){k=0}else{k=Qc(i*12|0)|0}c[d>>2]=k;k=c[g>>2]|0;if((k|0)!=0){i=k;while(1){k=c[i+24>>2]<<1;e=c[b>>2]|0;h[e+(k<<3)>>3]=+h[i>>3];h[e+((k|1)<<3)>>3]=+h[i+8>>3];k=c[i+28>>2]|0;Rc(i);c[g>>2]=k;if((k|0)==0){break}else{i=k}}}i=a|0;a=c[i>>2]|0;if((a|0)==0){return}else{l=j;m=a}while(1){a=l*3|0;j=c[d>>2]|0;c[j+(a-3<<2)>>2]=c[m>>2];c[j+(a-2<<2)>>2]=c[m+4>>2];c[j+(a-1<<2)>>2]=c[m+8>>2];a=c[m+12>>2]|0;Rc(m);c[i>>2]=a;if((a|0)==0){break}l=l-1|0;m=a}return}function Pc(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0.0,q=0.0,r=0,s=0;i=Nb()|0;j=Qc(32)|0;Vc(j|0,0,20)|0;c[j+28>>2]=6;c[j+24>>2]=0;Xb(i,100107,24);Xb(i,100106,2);Xb(i,100111,2);Zb(i,j);k=g-4|0;g=j+16|0;l=f;while(1){f=l+4|0;m=c[l>>2]|0;n=c[f>>2]|0;_b(i);if((m|0)!=(n|0)){o=m;do{p=+h[o>>3];q=+h[o+8>>3];m=Qc(32)|0;r=c[g>>2]|0;c[m+28>>2]=r;s=m;h[s>>3]=p;h[m+8>>3]=q;h[m+16>>3]=0.0;if((r|0)==0){c[m+24>>2]=0}else{c[m+24>>2]=(c[r+24>>2]|0)+1}c[g>>2]=m;o=o+16|0;Yb(i,s,m);}while((o|0)!=(n|0))}$b(i);if((f|0)==(k|0)){break}else{l=f}}ac(i);Oc(j,a,d,b,e);Rc(j);Vb(i);return}function Qc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,ra=0,sa=0,ta=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ia=0,Ja=0,La=0;do{if(a>>>0<245>>>0){if(a>>>0<11>>>0){b=16}else{b=a+11&-8}d=b>>>3;e=c[570]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=2320+(h<<2)|0;j=2320+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[570]=e&~(1<<g)}else{if(l>>>0<(c[574]|0)>>>0){qa();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{qa();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(!(b>>>0>(c[572]|0)>>>0)){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=2320+(p<<2)|0;m=2320+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[570]=e&~(1<<r)}else{if(l>>>0<(c[574]|0)>>>0){qa();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{qa();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[572]|0;if((l|0)!=0){q=c[575]|0;d=l>>>3;l=d<<1;f=2320+(l<<2)|0;k=c[570]|0;h=1<<d;do{if((k&h|0)==0){c[570]=k|h;s=f;t=2320+(l+2<<2)|0}else{d=2320+(l+2<<2)|0;g=c[d>>2]|0;if(!(g>>>0<(c[574]|0)>>>0)){s=g;t=d;break}qa();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[572]=m;c[575]=e;n=i;return n|0}l=c[571]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[2584+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[574]|0;if(r>>>0<i>>>0){qa();return 0}e=r+b|0;m=e;if(!(r>>>0<e>>>0)){qa();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break}else{w=l;x=k}}else{w=g;x=q}while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){qa();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){qa();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){qa();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{qa();return 0}}}while(0);a:do{if((e|0)!=0){f=c[d+28>>2]|0;i=2584+(f<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[571]=c[571]&~(1<<f);break a}else{if(e>>>0<(c[574]|0)>>>0){qa();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break a}}}while(0);if(v>>>0<(c[574]|0)>>>0){qa();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[574]|0)>>>0){qa();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[574]|0)>>>0){qa();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16>>>0){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b)>>2]=p;f=c[572]|0;if((f|0)!=0){e=c[575]|0;i=f>>>3;f=i<<1;q=2320+(f<<2)|0;k=c[570]|0;g=1<<i;do{if((k&g|0)==0){c[570]=k|g;y=q;z=2320+(f+2<<2)|0}else{i=2320+(f+2<<2)|0;l=c[i>>2]|0;if(!(l>>>0<(c[574]|0)>>>0)){y=l;z=i;break}qa();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[572]=p;c[575]=m}f=d+8|0;if((f|0)==0){o=b;break}else{n=f}return n|0}else{if(a>>>0>4294967231>>>0){o=-1;break}f=a+11|0;g=f&-8;k=c[571]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215>>>0){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=14-(h|f|l)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[2584+(A<<2)>>2]|0;b:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break b}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[2584+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break}else{p=r;m=i;q=e}}}if((K|0)==0){o=g;break}if(!(J>>>0<((c[572]|0)-g|0)>>>0)){o=g;break}q=K;m=c[574]|0;if(q>>>0<m>>>0){qa();return 0}p=q+g|0;k=p;if(!(q>>>0<p>>>0)){qa();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break}else{M=B;N=j}}else{M=d;N=r}while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<m>>>0){qa();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<m>>>0){qa();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){qa();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{qa();return 0}}}while(0);c:do{if((e|0)!=0){i=c[K+28>>2]|0;m=2584+(i<<2)|0;do{if((K|0)==(c[m>>2]|0)){c[m>>2]=L;if((L|0)!=0){break}c[571]=c[571]&~(1<<i);break c}else{if(e>>>0<(c[574]|0)>>>0){qa();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break c}}}while(0);if(L>>>0<(c[574]|0)>>>0){qa();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[574]|0)>>>0){qa();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[574]|0)>>>0){qa();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);do{if(J>>>0<16>>>0){e=J+g|0;c[K+4>>2]=e|3;i=q+(e+4)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[q+(g|4)>>2]=J|1;c[q+(J+g)>>2]=J;i=J>>>3;if(J>>>0<256>>>0){e=i<<1;m=2320+(e<<2)|0;r=c[570]|0;j=1<<i;do{if((r&j|0)==0){c[570]=r|j;O=m;P=2320+(e+2<<2)|0}else{i=2320+(e+2<<2)|0;d=c[i>>2]|0;if(!(d>>>0<(c[574]|0)>>>0)){O=d;P=i;break}qa();return 0}}while(0);c[P>>2]=k;c[O+12>>2]=k;c[q+(g+8)>>2]=O;c[q+(g+12)>>2]=m;break}e=p;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215>>>0){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=14-(d|r|i)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=2584+(Q<<2)|0;c[q+(g+28)>>2]=Q;c[q+(g+20)>>2]=0;c[q+(g+16)>>2]=0;m=c[571]|0;l=1<<Q;if((m&l|0)==0){c[571]=m|l;c[j>>2]=e;c[q+(g+24)>>2]=j;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}l=J<<R;m=c[j>>2]|0;while(1){if((c[m+4>>2]&-8|0)==(J|0)){break}S=m+16+(l>>>31<<2)|0;j=c[S>>2]|0;if((j|0)==0){T=151;break}else{l=l<<1;m=j}}if((T|0)==151){if(S>>>0<(c[574]|0)>>>0){qa();return 0}else{c[S>>2]=e;c[q+(g+24)>>2]=m;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}}l=m+8|0;j=c[l>>2]|0;i=c[574]|0;if(m>>>0<i>>>0){qa();return 0}if(j>>>0<i>>>0){qa();return 0}else{c[j+12>>2]=e;c[l>>2]=e;c[q+(g+8)>>2]=j;c[q+(g+12)>>2]=m;c[q+(g+24)>>2]=0;break}}}while(0);q=K+8|0;if((q|0)==0){o=g;break}else{n=q}return n|0}}while(0);K=c[572]|0;if(!(o>>>0>K>>>0)){S=K-o|0;J=c[575]|0;if(S>>>0>15>>>0){R=J;c[575]=R+o;c[572]=S;c[R+(o+4)>>2]=S|1;c[R+K>>2]=S;c[J+4>>2]=o|3}else{c[572]=0;c[575]=0;c[J+4>>2]=K|3;S=J+(K+4)|0;c[S>>2]=c[S>>2]|1}n=J+8|0;return n|0}J=c[573]|0;if(o>>>0<J>>>0){S=J-o|0;c[573]=S;J=c[576]|0;K=J;c[576]=K+o;c[K+(o+4)>>2]=S|1;c[J+4>>2]=o|3;n=J+8|0;return n|0}do{if((c[564]|0)==0){J=ua(30)|0;if((J-1&J|0)==0){c[566]=J;c[565]=J;c[567]=-1;c[568]=-1;c[569]=0;c[681]=0;c[564]=(Ka(0)|0)&-16^1431655768;break}else{qa();return 0}}}while(0);J=o+48|0;S=c[566]|0;K=o+47|0;R=S+K|0;Q=-S|0;S=R&Q;if(!(S>>>0>o>>>0)){n=0;return n|0}O=c[680]|0;do{if((O|0)!=0){P=c[678]|0;L=P+S|0;if(L>>>0<=P>>>0|L>>>0>O>>>0){n=0}else{break}return n|0}}while(0);d:do{if((c[681]&4|0)==0){O=c[576]|0;e:do{if((O|0)==0){T=181}else{L=O;P=2728;while(1){U=P|0;M=c[U>>2]|0;if(!(M>>>0>L>>>0)){V=P+4|0;if((M+(c[V>>2]|0)|0)>>>0>L>>>0){break}}M=c[P+8>>2]|0;if((M|0)==0){T=181;break e}else{P=M}}if((P|0)==0){T=181;break}L=R-(c[573]|0)&Q;if(!(L>>>0<2147483647>>>0)){W=0;break}m=Ga(L|0)|0;e=(m|0)==((c[U>>2]|0)+(c[V>>2]|0)|0);X=e?m:-1;Y=e?L:0;Z=m;_=L;T=190}}while(0);do{if((T|0)==181){O=Ga(0)|0;if((O|0)==-1){W=0;break}g=O;L=c[565]|0;m=L-1|0;if((m&g|0)==0){$=S}else{$=S-g+(m+g&-L)|0}L=c[678]|0;g=L+$|0;if(!($>>>0>o>>>0&$>>>0<2147483647>>>0)){W=0;break}m=c[680]|0;if((m|0)!=0){if(g>>>0<=L>>>0|g>>>0>m>>>0){W=0;break}}m=Ga($|0)|0;g=(m|0)==(O|0);X=g?O:-1;Y=g?$:0;Z=m;_=$;T=190}}while(0);f:do{if((T|0)==190){m=-_|0;if(!((X|0)==-1)){aa=Y;ba=X;T=201;break d}do{if((Z|0)!=-1&_>>>0<2147483647>>>0&_>>>0<J>>>0){g=c[566]|0;O=K-_+g&-g;if(!(O>>>0<2147483647>>>0)){ca=_;break}if((Ga(O|0)|0)==-1){Ga(m|0)|0;W=Y;break f}else{ca=O+_|0;break}}else{ca=_}}while(0);if((Z|0)==-1){W=Y}else{aa=ca;ba=Z;T=201;break d}}}while(0);c[681]=c[681]|4;da=W;T=198}else{da=0;T=198}}while(0);do{if((T|0)==198){if(!(S>>>0<2147483647>>>0)){break}W=Ga(S|0)|0;Z=Ga(0)|0;if(!((Z|0)!=-1&(W|0)!=-1&W>>>0<Z>>>0)){break}ca=Z-W|0;Z=ca>>>0>(o+40|0)>>>0;Y=Z?W:-1;if(!((Y|0)==-1)){aa=Z?ca:da;ba=Y;T=201}}}while(0);do{if((T|0)==201){da=(c[678]|0)+aa|0;c[678]=da;if(da>>>0>(c[679]|0)>>>0){c[679]=da}da=c[576]|0;g:do{if((da|0)==0){S=c[574]|0;if((S|0)==0|ba>>>0<S>>>0){c[574]=ba}c[682]=ba;c[683]=aa;c[685]=0;c[579]=c[564];c[578]=-1;S=0;do{Y=S<<1;ca=2320+(Y<<2)|0;c[2320+(Y+3<<2)>>2]=ca;c[2320+(Y+2<<2)>>2]=ca;S=S+1|0;}while(S>>>0<32>>>0);S=ba+8|0;if((S&7|0)==0){ea=0}else{ea=-S&7}S=aa-40-ea|0;c[576]=ba+ea;c[573]=S;c[ba+(ea+4)>>2]=S|1;c[ba+(aa-36)>>2]=40;c[577]=c[568]}else{S=2728;while(1){fa=c[S>>2]|0;ga=S+4|0;ha=c[ga>>2]|0;if((ba|0)==(fa+ha|0)){T=213;break}ca=c[S+8>>2]|0;if((ca|0)==0){break}else{S=ca}}do{if((T|0)==213){if((c[S+12>>2]&8|0)!=0){break}ca=da;if(!(ca>>>0>=fa>>>0&ca>>>0<ba>>>0)){break}c[ga>>2]=ha+aa;Y=(c[573]|0)+aa|0;Z=da+8|0;if((Z&7|0)==0){ia=0}else{ia=-Z&7}Z=Y-ia|0;c[576]=ca+ia;c[573]=Z;c[ca+(ia+4)>>2]=Z|1;c[ca+(Y+4)>>2]=40;c[577]=c[568];break g}}while(0);if(ba>>>0<(c[574]|0)>>>0){c[574]=ba}S=ba+aa|0;Y=2728;while(1){ja=Y|0;if((c[ja>>2]|0)==(S|0)){T=223;break}ca=c[Y+8>>2]|0;if((ca|0)==0){break}else{Y=ca}}do{if((T|0)==223){if((c[Y+12>>2]&8|0)!=0){break}c[ja>>2]=ba;S=Y+4|0;c[S>>2]=(c[S>>2]|0)+aa;S=ba+8|0;if((S&7|0)==0){ka=0}else{ka=-S&7}S=ba+(aa+8)|0;if((S&7|0)==0){la=0}else{la=-S&7}S=ba+(la+aa)|0;ca=S;Z=ka+o|0;W=ba+Z|0;_=W;K=S-(ba+ka)-o|0;c[ba+(ka+4)>>2]=o|3;do{if((ca|0)==(c[576]|0)){J=(c[573]|0)+K|0;c[573]=J;c[576]=_;c[ba+(Z+4)>>2]=J|1}else{if((ca|0)==(c[575]|0)){J=(c[572]|0)+K|0;c[572]=J;c[575]=_;c[ba+(Z+4)>>2]=J|1;c[ba+(J+Z)>>2]=J;break}J=aa+4|0;X=c[ba+(J+la)>>2]|0;if((X&3|0)==1){$=X&-8;V=X>>>3;h:do{if(X>>>0<256>>>0){U=c[ba+((la|8)+aa)>>2]|0;Q=c[ba+(aa+12+la)>>2]|0;R=2320+(V<<1<<2)|0;do{if((U|0)!=(R|0)){if(U>>>0<(c[574]|0)>>>0){qa();return 0}if((c[U+12>>2]|0)==(ca|0)){break}qa();return 0}}while(0);if((Q|0)==(U|0)){c[570]=c[570]&~(1<<V);break}do{if((Q|0)==(R|0)){ma=Q+8|0}else{if(Q>>>0<(c[574]|0)>>>0){qa();return 0}m=Q+8|0;if((c[m>>2]|0)==(ca|0)){ma=m;break}qa();return 0}}while(0);c[U+12>>2]=Q;c[ma>>2]=U}else{R=S;m=c[ba+((la|24)+aa)>>2]|0;P=c[ba+(aa+12+la)>>2]|0;do{if((P|0)==(R|0)){O=la|16;g=ba+(J+O)|0;L=c[g>>2]|0;if((L|0)==0){e=ba+(O+aa)|0;O=c[e>>2]|0;if((O|0)==0){na=0;break}else{oa=O;pa=e}}else{oa=L;pa=g}while(1){g=oa+20|0;L=c[g>>2]|0;if((L|0)!=0){oa=L;pa=g;continue}g=oa+16|0;L=c[g>>2]|0;if((L|0)==0){break}else{oa=L;pa=g}}if(pa>>>0<(c[574]|0)>>>0){qa();return 0}else{c[pa>>2]=0;na=oa;break}}else{g=c[ba+((la|8)+aa)>>2]|0;if(g>>>0<(c[574]|0)>>>0){qa();return 0}L=g+12|0;if((c[L>>2]|0)!=(R|0)){qa();return 0}e=P+8|0;if((c[e>>2]|0)==(R|0)){c[L>>2]=P;c[e>>2]=g;na=P;break}else{qa();return 0}}}while(0);if((m|0)==0){break}P=c[ba+(aa+28+la)>>2]|0;U=2584+(P<<2)|0;do{if((R|0)==(c[U>>2]|0)){c[U>>2]=na;if((na|0)!=0){break}c[571]=c[571]&~(1<<P);break h}else{if(m>>>0<(c[574]|0)>>>0){qa();return 0}Q=m+16|0;if((c[Q>>2]|0)==(R|0)){c[Q>>2]=na}else{c[m+20>>2]=na}if((na|0)==0){break h}}}while(0);if(na>>>0<(c[574]|0)>>>0){qa();return 0}c[na+24>>2]=m;R=la|16;P=c[ba+(R+aa)>>2]|0;do{if((P|0)!=0){if(P>>>0<(c[574]|0)>>>0){qa();return 0}else{c[na+16>>2]=P;c[P+24>>2]=na;break}}}while(0);P=c[ba+(J+R)>>2]|0;if((P|0)==0){break}if(P>>>0<(c[574]|0)>>>0){qa();return 0}else{c[na+20>>2]=P;c[P+24>>2]=na;break}}}while(0);ra=ba+(($|la)+aa)|0;sa=$+K|0}else{ra=ca;sa=K}J=ra+4|0;c[J>>2]=c[J>>2]&-2;c[ba+(Z+4)>>2]=sa|1;c[ba+(sa+Z)>>2]=sa;J=sa>>>3;if(sa>>>0<256>>>0){V=J<<1;X=2320+(V<<2)|0;P=c[570]|0;m=1<<J;do{if((P&m|0)==0){c[570]=P|m;ta=X;va=2320+(V+2<<2)|0}else{J=2320+(V+2<<2)|0;U=c[J>>2]|0;if(!(U>>>0<(c[574]|0)>>>0)){ta=U;va=J;break}qa();return 0}}while(0);c[va>>2]=_;c[ta+12>>2]=_;c[ba+(Z+8)>>2]=ta;c[ba+(Z+12)>>2]=X;break}V=W;m=sa>>>8;do{if((m|0)==0){wa=0}else{if(sa>>>0>16777215>>>0){wa=31;break}P=(m+1048320|0)>>>16&8;$=m<<P;J=($+520192|0)>>>16&4;U=$<<J;$=(U+245760|0)>>>16&2;Q=14-(J|P|$)+(U<<$>>>15)|0;wa=sa>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=2584+(wa<<2)|0;c[ba+(Z+28)>>2]=wa;c[ba+(Z+20)>>2]=0;c[ba+(Z+16)>>2]=0;X=c[571]|0;Q=1<<wa;if((X&Q|0)==0){c[571]=X|Q;c[m>>2]=V;c[ba+(Z+24)>>2]=m;c[ba+(Z+12)>>2]=V;c[ba+(Z+8)>>2]=V;break}if((wa|0)==31){xa=0}else{xa=25-(wa>>>1)|0}Q=sa<<xa;X=c[m>>2]|0;while(1){if((c[X+4>>2]&-8|0)==(sa|0)){break}ya=X+16+(Q>>>31<<2)|0;m=c[ya>>2]|0;if((m|0)==0){T=296;break}else{Q=Q<<1;X=m}}if((T|0)==296){if(ya>>>0<(c[574]|0)>>>0){qa();return 0}else{c[ya>>2]=V;c[ba+(Z+24)>>2]=X;c[ba+(Z+12)>>2]=V;c[ba+(Z+8)>>2]=V;break}}Q=X+8|0;m=c[Q>>2]|0;$=c[574]|0;if(X>>>0<$>>>0){qa();return 0}if(m>>>0<$>>>0){qa();return 0}else{c[m+12>>2]=V;c[Q>>2]=V;c[ba+(Z+8)>>2]=m;c[ba+(Z+12)>>2]=X;c[ba+(Z+24)>>2]=0;break}}}while(0);n=ba+(ka|8)|0;return n|0}}while(0);Y=da;Z=2728;while(1){za=c[Z>>2]|0;if(!(za>>>0>Y>>>0)){Aa=c[Z+4>>2]|0;Ba=za+Aa|0;if(Ba>>>0>Y>>>0){break}}Z=c[Z+8>>2]|0}Z=za+(Aa-39)|0;if((Z&7|0)==0){Ca=0}else{Ca=-Z&7}Z=za+(Aa-47+Ca)|0;W=Z>>>0<(da+16|0)>>>0?Y:Z;Z=W+8|0;_=ba+8|0;if((_&7|0)==0){Da=0}else{Da=-_&7}_=aa-40-Da|0;c[576]=ba+Da;c[573]=_;c[ba+(Da+4)>>2]=_|1;c[ba+(aa-36)>>2]=40;c[577]=c[568];c[W+4>>2]=27;c[Z>>2]=c[682];c[Z+4>>2]=c[683];c[Z+8>>2]=c[684];c[Z+12>>2]=c[685];c[682]=ba;c[683]=aa;c[685]=0;c[684]=Z;Z=W+28|0;c[Z>>2]=7;if((W+32|0)>>>0<Ba>>>0){_=Z;while(1){Z=_+4|0;c[Z>>2]=7;if((_+8|0)>>>0<Ba>>>0){_=Z}else{break}}}if((W|0)==(Y|0)){break}_=W-da|0;Z=Y+(_+4)|0;c[Z>>2]=c[Z>>2]&-2;c[da+4>>2]=_|1;c[Y+_>>2]=_;Z=_>>>3;if(_>>>0<256>>>0){K=Z<<1;ca=2320+(K<<2)|0;S=c[570]|0;m=1<<Z;do{if((S&m|0)==0){c[570]=S|m;Ea=ca;Fa=2320+(K+2<<2)|0}else{Z=2320+(K+2<<2)|0;Q=c[Z>>2]|0;if(!(Q>>>0<(c[574]|0)>>>0)){Ea=Q;Fa=Z;break}qa();return 0}}while(0);c[Fa>>2]=da;c[Ea+12>>2]=da;c[da+8>>2]=Ea;c[da+12>>2]=ca;break}K=da;m=_>>>8;do{if((m|0)==0){Ia=0}else{if(_>>>0>16777215>>>0){Ia=31;break}S=(m+1048320|0)>>>16&8;Y=m<<S;W=(Y+520192|0)>>>16&4;Z=Y<<W;Y=(Z+245760|0)>>>16&2;Q=14-(W|S|Y)+(Z<<Y>>>15)|0;Ia=_>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=2584+(Ia<<2)|0;c[da+28>>2]=Ia;c[da+20>>2]=0;c[da+16>>2]=0;ca=c[571]|0;Q=1<<Ia;if((ca&Q|0)==0){c[571]=ca|Q;c[m>>2]=K;c[da+24>>2]=m;c[da+12>>2]=da;c[da+8>>2]=da;break}if((Ia|0)==31){Ja=0}else{Ja=25-(Ia>>>1)|0}Q=_<<Ja;ca=c[m>>2]|0;while(1){if((c[ca+4>>2]&-8|0)==(_|0)){break}La=ca+16+(Q>>>31<<2)|0;m=c[La>>2]|0;if((m|0)==0){T=331;break}else{Q=Q<<1;ca=m}}if((T|0)==331){if(La>>>0<(c[574]|0)>>>0){qa();return 0}else{c[La>>2]=K;c[da+24>>2]=ca;c[da+12>>2]=da;c[da+8>>2]=da;break}}Q=ca+8|0;_=c[Q>>2]|0;m=c[574]|0;if(ca>>>0<m>>>0){qa();return 0}if(_>>>0<m>>>0){qa();return 0}else{c[_+12>>2]=K;c[Q>>2]=K;c[da+8>>2]=_;c[da+12>>2]=ca;c[da+24>>2]=0;break}}}while(0);da=c[573]|0;if(!(da>>>0>o>>>0)){break}_=da-o|0;c[573]=_;da=c[576]|0;Q=da;c[576]=Q+o;c[Q+(o+4)>>2]=_|1;c[da+4>>2]=o|3;n=da+8|0;return n|0}}while(0);c[(Ha()|0)>>2]=12;n=0;return n|0}function Rc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[574]|0;if(b>>>0<e>>>0){qa()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){qa()}h=f&-8;i=a+(h-8)|0;j=i;a:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){qa()}if((n|0)==(c[575]|0)){p=a+(h-4)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[572]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256>>>0){k=c[a+(l+8)>>2]|0;s=c[a+(l+12)>>2]|0;t=2320+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){qa()}if((c[k+12>>2]|0)==(n|0)){break}qa()}}while(0);if((s|0)==(k|0)){c[570]=c[570]&~(1<<p);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){qa()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}qa()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24)>>2]|0;v=c[a+(l+12)>>2]|0;do{if((v|0)==(t|0)){w=a+(l+20)|0;x=c[w>>2]|0;if((x|0)==0){y=a+(l+16)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break}else{B=z;C=y}}else{B=x;C=w}while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){qa()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8)>>2]|0;if(w>>>0<e>>>0){qa()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){qa()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{qa()}}}while(0);if((p|0)==0){q=n;r=o;break}v=c[a+(l+28)>>2]|0;m=2584+(v<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[571]=c[571]&~(1<<v);q=n;r=o;break a}else{if(p>>>0<(c[574]|0)>>>0){qa()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break a}}}while(0);if(A>>>0<(c[574]|0)>>>0){qa()}c[A+24>>2]=p;t=c[a+(l+16)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[574]|0)>>>0){qa()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[574]|0)>>>0){qa()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(!(d>>>0<i>>>0)){qa()}A=a+(h-4)|0;e=c[A>>2]|0;if((e&1|0)==0){qa()}do{if((e&2|0)==0){if((j|0)==(c[576]|0)){B=(c[573]|0)+r|0;c[573]=B;c[576]=q;c[q+4>>2]=B|1;if((q|0)!=(c[575]|0)){return}c[575]=0;c[572]=0;return}if((j|0)==(c[575]|0)){B=(c[572]|0)+r|0;c[572]=B;c[575]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;b:do{if(e>>>0<256>>>0){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=2320+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[574]|0)>>>0){qa()}if((c[u+12>>2]|0)==(j|0)){break}qa()}}while(0);if((g|0)==(u|0)){c[570]=c[570]&~(1<<C);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[574]|0)>>>0){qa()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}qa()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16)>>2]|0;t=c[a+(h|4)>>2]|0;do{if((t|0)==(b|0)){p=a+(h+12)|0;v=c[p>>2]|0;if((v|0)==0){m=a+(h+8)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break}else{F=k;G=m}}else{F=v;G=p}while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[574]|0)>>>0){qa()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[574]|0)>>>0){qa()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){qa()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{qa()}}}while(0);if((f|0)==0){break}t=c[a+(h+20)>>2]|0;u=2584+(t<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[571]=c[571]&~(1<<t);break b}else{if(f>>>0<(c[574]|0)>>>0){qa()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break b}}}while(0);if(E>>>0<(c[574]|0)>>>0){qa()}c[E+24>>2]=f;b=c[a+(h+8)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[574]|0)>>>0){qa()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[574]|0)>>>0){qa()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[575]|0)){H=B;break}c[572]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256>>>0){d=r<<1;e=2320+(d<<2)|0;A=c[570]|0;E=1<<r;do{if((A&E|0)==0){c[570]=A|E;I=e;J=2320+(d+2<<2)|0}else{r=2320+(d+2<<2)|0;h=c[r>>2]|0;if(!(h>>>0<(c[574]|0)>>>0)){I=h;J=r;break}qa()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215>>>0){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=14-(E|J|d)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=2584+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[571]|0;d=1<<K;do{if((r&d|0)==0){c[571]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{if((K|0)==31){L=0}else{L=25-(K>>>1)|0}A=H<<L;J=c[I>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(H|0)){break}M=J+16+(A>>>31<<2)|0;E=c[M>>2]|0;if((E|0)==0){N=129;break}else{A=A<<1;J=E}}if((N|0)==129){if(M>>>0<(c[574]|0)>>>0){qa()}else{c[M>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break}}A=J+8|0;B=c[A>>2]|0;E=c[574]|0;if(J>>>0<E>>>0){qa()}if(B>>>0<E>>>0){qa()}else{c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=J;c[q+24>>2]=0;break}}}while(0);q=(c[578]|0)-1|0;c[578]=q;if((q|0)==0){O=2736}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[578]=-1;return}function Sc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;if((a|0)==0){d=Qc(b)|0;return d|0}if(b>>>0>4294967231>>>0){c[(Ha()|0)>>2]=12;d=0;return d|0}if(b>>>0<11>>>0){e=16}else{e=b+11&-8}f=Tc(a-8|0,e)|0;if((f|0)!=0){d=f+8|0;return d|0}f=Qc(b)|0;if((f|0)==0){d=0;return d|0}e=c[a-4>>2]|0;g=(e&-8)-((e&3|0)==0?8:4)|0;Yc(f|0,a|0,g>>>0<b>>>0?g:b)|0;Rc(a);d=f;return d|0}function Tc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;d=a+4|0;e=c[d>>2]|0;f=e&-8;g=a;h=g+f|0;i=h;j=c[574]|0;if(g>>>0<j>>>0){qa();return 0}k=e&3;if(!((k|0)!=1&g>>>0<h>>>0)){qa();return 0}l=g+(f|4)|0;m=c[l>>2]|0;if((m&1|0)==0){qa();return 0}if((k|0)==0){if(b>>>0<256>>>0){n=0;return n|0}do{if(!(f>>>0<(b+4|0)>>>0)){if((f-b|0)>>>0>c[566]<<1>>>0){break}else{n=a}return n|0}}while(0);n=0;return n|0}if(!(f>>>0<b>>>0)){k=f-b|0;if(!(k>>>0>15>>>0)){n=a;return n|0}c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=k|3;c[l>>2]=c[l>>2]|1;Uc(g+b|0,k);n=a;return n|0}if((i|0)==(c[576]|0)){k=(c[573]|0)+f|0;if(!(k>>>0>b>>>0)){n=0;return n|0}l=k-b|0;c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=l|1;c[576]=g+b;c[573]=l;n=a;return n|0}if((i|0)==(c[575]|0)){l=(c[572]|0)+f|0;if(l>>>0<b>>>0){n=0;return n|0}k=l-b|0;if(k>>>0>15>>>0){c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=k|1;c[g+l>>2]=k;o=g+(l+4)|0;c[o>>2]=c[o>>2]&-2;p=g+b|0;q=k}else{c[d>>2]=e&1|l|2;e=g+(l+4)|0;c[e>>2]=c[e>>2]|1;p=0;q=0}c[572]=q;c[575]=p;n=a;return n|0}if((m&2|0)!=0){n=0;return n|0}p=(m&-8)+f|0;if(p>>>0<b>>>0){n=0;return n|0}q=p-b|0;e=m>>>3;a:do{if(m>>>0<256>>>0){l=c[g+(f+8)>>2]|0;k=c[g+(f+12)>>2]|0;o=2320+(e<<1<<2)|0;do{if((l|0)!=(o|0)){if(l>>>0<j>>>0){qa();return 0}if((c[l+12>>2]|0)==(i|0)){break}qa();return 0}}while(0);if((k|0)==(l|0)){c[570]=c[570]&~(1<<e);break}do{if((k|0)==(o|0)){r=k+8|0}else{if(k>>>0<j>>>0){qa();return 0}s=k+8|0;if((c[s>>2]|0)==(i|0)){r=s;break}qa();return 0}}while(0);c[l+12>>2]=k;c[r>>2]=l}else{o=h;s=c[g+(f+24)>>2]|0;t=c[g+(f+12)>>2]|0;do{if((t|0)==(o|0)){u=g+(f+20)|0;v=c[u>>2]|0;if((v|0)==0){w=g+(f+16)|0;x=c[w>>2]|0;if((x|0)==0){y=0;break}else{z=x;A=w}}else{z=v;A=u}while(1){u=z+20|0;v=c[u>>2]|0;if((v|0)!=0){z=v;A=u;continue}u=z+16|0;v=c[u>>2]|0;if((v|0)==0){break}else{z=v;A=u}}if(A>>>0<j>>>0){qa();return 0}else{c[A>>2]=0;y=z;break}}else{u=c[g+(f+8)>>2]|0;if(u>>>0<j>>>0){qa();return 0}v=u+12|0;if((c[v>>2]|0)!=(o|0)){qa();return 0}w=t+8|0;if((c[w>>2]|0)==(o|0)){c[v>>2]=t;c[w>>2]=u;y=t;break}else{qa();return 0}}}while(0);if((s|0)==0){break}t=c[g+(f+28)>>2]|0;l=2584+(t<<2)|0;do{if((o|0)==(c[l>>2]|0)){c[l>>2]=y;if((y|0)!=0){break}c[571]=c[571]&~(1<<t);break a}else{if(s>>>0<(c[574]|0)>>>0){qa();return 0}k=s+16|0;if((c[k>>2]|0)==(o|0)){c[k>>2]=y}else{c[s+20>>2]=y}if((y|0)==0){break a}}}while(0);if(y>>>0<(c[574]|0)>>>0){qa();return 0}c[y+24>>2]=s;o=c[g+(f+16)>>2]|0;do{if((o|0)!=0){if(o>>>0<(c[574]|0)>>>0){qa();return 0}else{c[y+16>>2]=o;c[o+24>>2]=y;break}}}while(0);o=c[g+(f+20)>>2]|0;if((o|0)==0){break}if(o>>>0<(c[574]|0)>>>0){qa();return 0}else{c[y+20>>2]=o;c[o+24>>2]=y;break}}}while(0);if(q>>>0<16>>>0){c[d>>2]=p|c[d>>2]&1|2;y=g+(p|4)|0;c[y>>2]=c[y>>2]|1;n=a;return n|0}else{c[d>>2]=c[d>>2]&1|b|2;c[g+(b+4)>>2]=q|3;d=g+(p|4)|0;c[d>>2]=c[d>>2]|1;Uc(g+b|0,q);n=a;return n|0}return 0}function Uc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;d=a;e=d+b|0;f=e;g=c[a+4>>2]|0;a:do{if((g&1|0)==0){h=c[a>>2]|0;if((g&3|0)==0){return}i=d+(-h|0)|0;j=i;k=h+b|0;l=c[574]|0;if(i>>>0<l>>>0){qa()}if((j|0)==(c[575]|0)){m=d+(b+4)|0;if((c[m>>2]&3|0)!=3){n=j;o=k;break}c[572]=k;c[m>>2]=c[m>>2]&-2;c[d+(4-h)>>2]=k|1;c[e>>2]=k;return}m=h>>>3;if(h>>>0<256>>>0){p=c[d+(8-h)>>2]|0;q=c[d+(12-h)>>2]|0;r=2320+(m<<1<<2)|0;do{if((p|0)!=(r|0)){if(p>>>0<l>>>0){qa()}if((c[p+12>>2]|0)==(j|0)){break}qa()}}while(0);if((q|0)==(p|0)){c[570]=c[570]&~(1<<m);n=j;o=k;break}do{if((q|0)==(r|0)){s=q+8|0}else{if(q>>>0<l>>>0){qa()}t=q+8|0;if((c[t>>2]|0)==(j|0)){s=t;break}qa()}}while(0);c[p+12>>2]=q;c[s>>2]=p;n=j;o=k;break}r=i;m=c[d+(24-h)>>2]|0;t=c[d+(12-h)>>2]|0;do{if((t|0)==(r|0)){u=16-h|0;v=d+(u+4)|0;w=c[v>>2]|0;if((w|0)==0){x=d+u|0;u=c[x>>2]|0;if((u|0)==0){y=0;break}else{z=u;A=x}}else{z=w;A=v}while(1){v=z+20|0;w=c[v>>2]|0;if((w|0)!=0){z=w;A=v;continue}v=z+16|0;w=c[v>>2]|0;if((w|0)==0){break}else{z=w;A=v}}if(A>>>0<l>>>0){qa()}else{c[A>>2]=0;y=z;break}}else{v=c[d+(8-h)>>2]|0;if(v>>>0<l>>>0){qa()}w=v+12|0;if((c[w>>2]|0)!=(r|0)){qa()}x=t+8|0;if((c[x>>2]|0)==(r|0)){c[w>>2]=t;c[x>>2]=v;y=t;break}else{qa()}}}while(0);if((m|0)==0){n=j;o=k;break}t=c[d+(28-h)>>2]|0;l=2584+(t<<2)|0;do{if((r|0)==(c[l>>2]|0)){c[l>>2]=y;if((y|0)!=0){break}c[571]=c[571]&~(1<<t);n=j;o=k;break a}else{if(m>>>0<(c[574]|0)>>>0){qa()}i=m+16|0;if((c[i>>2]|0)==(r|0)){c[i>>2]=y}else{c[m+20>>2]=y}if((y|0)==0){n=j;o=k;break a}}}while(0);if(y>>>0<(c[574]|0)>>>0){qa()}c[y+24>>2]=m;r=16-h|0;t=c[d+r>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[574]|0)>>>0){qa()}else{c[y+16>>2]=t;c[t+24>>2]=y;break}}}while(0);t=c[d+(r+4)>>2]|0;if((t|0)==0){n=j;o=k;break}if(t>>>0<(c[574]|0)>>>0){qa()}else{c[y+20>>2]=t;c[t+24>>2]=y;n=j;o=k;break}}else{n=a;o=b}}while(0);a=c[574]|0;if(e>>>0<a>>>0){qa()}y=d+(b+4)|0;z=c[y>>2]|0;do{if((z&2|0)==0){if((f|0)==(c[576]|0)){A=(c[573]|0)+o|0;c[573]=A;c[576]=n;c[n+4>>2]=A|1;if((n|0)!=(c[575]|0)){return}c[575]=0;c[572]=0;return}if((f|0)==(c[575]|0)){A=(c[572]|0)+o|0;c[572]=A;c[575]=n;c[n+4>>2]=A|1;c[n+A>>2]=A;return}A=(z&-8)+o|0;s=z>>>3;b:do{if(z>>>0<256>>>0){g=c[d+(b+8)>>2]|0;t=c[d+(b+12)>>2]|0;h=2320+(s<<1<<2)|0;do{if((g|0)!=(h|0)){if(g>>>0<a>>>0){qa()}if((c[g+12>>2]|0)==(f|0)){break}qa()}}while(0);if((t|0)==(g|0)){c[570]=c[570]&~(1<<s);break}do{if((t|0)==(h|0)){B=t+8|0}else{if(t>>>0<a>>>0){qa()}m=t+8|0;if((c[m>>2]|0)==(f|0)){B=m;break}qa()}}while(0);c[g+12>>2]=t;c[B>>2]=g}else{h=e;m=c[d+(b+24)>>2]|0;l=c[d+(b+12)>>2]|0;do{if((l|0)==(h|0)){i=d+(b+20)|0;p=c[i>>2]|0;if((p|0)==0){q=d+(b+16)|0;v=c[q>>2]|0;if((v|0)==0){C=0;break}else{D=v;E=q}}else{D=p;E=i}while(1){i=D+20|0;p=c[i>>2]|0;if((p|0)!=0){D=p;E=i;continue}i=D+16|0;p=c[i>>2]|0;if((p|0)==0){break}else{D=p;E=i}}if(E>>>0<a>>>0){qa()}else{c[E>>2]=0;C=D;break}}else{i=c[d+(b+8)>>2]|0;if(i>>>0<a>>>0){qa()}p=i+12|0;if((c[p>>2]|0)!=(h|0)){qa()}q=l+8|0;if((c[q>>2]|0)==(h|0)){c[p>>2]=l;c[q>>2]=i;C=l;break}else{qa()}}}while(0);if((m|0)==0){break}l=c[d+(b+28)>>2]|0;g=2584+(l<<2)|0;do{if((h|0)==(c[g>>2]|0)){c[g>>2]=C;if((C|0)!=0){break}c[571]=c[571]&~(1<<l);break b}else{if(m>>>0<(c[574]|0)>>>0){qa()}t=m+16|0;if((c[t>>2]|0)==(h|0)){c[t>>2]=C}else{c[m+20>>2]=C}if((C|0)==0){break b}}}while(0);if(C>>>0<(c[574]|0)>>>0){qa()}c[C+24>>2]=m;h=c[d+(b+16)>>2]|0;do{if((h|0)!=0){if(h>>>0<(c[574]|0)>>>0){qa()}else{c[C+16>>2]=h;c[h+24>>2]=C;break}}}while(0);h=c[d+(b+20)>>2]|0;if((h|0)==0){break}if(h>>>0<(c[574]|0)>>>0){qa()}else{c[C+20>>2]=h;c[h+24>>2]=C;break}}}while(0);c[n+4>>2]=A|1;c[n+A>>2]=A;if((n|0)!=(c[575]|0)){F=A;break}c[572]=A;return}else{c[y>>2]=z&-2;c[n+4>>2]=o|1;c[n+o>>2]=o;F=o}}while(0);o=F>>>3;if(F>>>0<256>>>0){z=o<<1;y=2320+(z<<2)|0;C=c[570]|0;b=1<<o;do{if((C&b|0)==0){c[570]=C|b;G=y;H=2320+(z+2<<2)|0}else{o=2320+(z+2<<2)|0;d=c[o>>2]|0;if(!(d>>>0<(c[574]|0)>>>0)){G=d;H=o;break}qa()}}while(0);c[H>>2]=n;c[G+12>>2]=n;c[n+8>>2]=G;c[n+12>>2]=y;return}y=n;G=F>>>8;do{if((G|0)==0){I=0}else{if(F>>>0>16777215>>>0){I=31;break}H=(G+1048320|0)>>>16&8;z=G<<H;b=(z+520192|0)>>>16&4;C=z<<b;z=(C+245760|0)>>>16&2;o=14-(b|H|z)+(C<<z>>>15)|0;I=F>>>((o+7|0)>>>0)&1|o<<1}}while(0);G=2584+(I<<2)|0;c[n+28>>2]=I;c[n+20>>2]=0;c[n+16>>2]=0;o=c[571]|0;z=1<<I;if((o&z|0)==0){c[571]=o|z;c[G>>2]=y;c[n+24>>2]=G;c[n+12>>2]=n;c[n+8>>2]=n;return}if((I|0)==31){J=0}else{J=25-(I>>>1)|0}I=F<<J;J=c[G>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(F|0)){break}K=J+16+(I>>>31<<2)|0;G=c[K>>2]|0;if((G|0)==0){L=126;break}else{I=I<<1;J=G}}if((L|0)==126){if(K>>>0<(c[574]|0)>>>0){qa()}c[K>>2]=y;c[n+24>>2]=J;c[n+12>>2]=n;c[n+8>>2]=n;return}K=J+8|0;L=c[K>>2]|0;I=c[574]|0;if(J>>>0<I>>>0){qa()}if(L>>>0<I>>>0){qa()}c[L+12>>2]=y;c[K>>2]=y;c[n+8>>2]=L;c[n+12>>2]=J;c[n+24>>2]=0;return}function Vc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b+e|0;if((e|0)>=20){d=d&255;g=b&3;h=d|d<<8|d<<16|d<<24;i=f&~3;if(g){g=b+4-g|0;while((b|0)<(g|0)){a[b]=d;b=b+1|0}}while((b|0)<(i|0)){c[b>>2]=h;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}return b-e|0}function Wc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;r=r+1|0;c[a>>2]=r;while((e|0)<40){if((c[d+(e<<2)>>2]|0)==0){c[d+(e<<2)>>2]=r;c[d+((e<<2)+4)>>2]=b;c[d+((e<<2)+8)>>2]=0;return 0}e=e+2|0}Fa(116);Fa(111);Fa(111);Fa(32);Fa(109);Fa(97);Fa(110);Fa(121);Fa(32);Fa(115);Fa(101);Fa(116);Fa(106);Fa(109);Fa(112);Fa(115);Fa(32);Fa(105);Fa(110);Fa(32);Fa(97);Fa(32);Fa(102);Fa(117);Fa(110);Fa(99);Fa(116);Fa(105);Fa(111);Fa(110);Fa(32);Fa(99);Fa(97);Fa(108);Fa(108);Fa(44);Fa(32);Fa(98);Fa(117);Fa(105);Fa(108);Fa(100);Fa(32);Fa(119);Fa(105);Fa(116);Fa(104);Fa(32);Fa(97);Fa(32);Fa(104);Fa(105);Fa(103);Fa(104);Fa(101);Fa(114);Fa(32);Fa(118);Fa(97);Fa(108);Fa(117);Fa(101);Fa(32);Fa(102);Fa(111);Fa(114);Fa(32);Fa(77);Fa(65);Fa(88);Fa(95);Fa(83);Fa(69);Fa(84);Fa(74);Fa(77);Fa(80);Fa(83);Fa(10);$(0);return 0}function Xc(a,b){a=a|0;b=b|0;var d=0,e=0;while((d|0)<20){e=c[b+(d<<2)>>2]|0;if((e|0)==0)break;if((e|0)==(a|0)){return c[b+((d<<2)+4)>>2]|0}d=d+2|0}return 0}function Yc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;if((e|0)>=4096)return Ca(b|0,d|0,e|0)|0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function Zc(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function _c(a,b){a=a|0;b=b|0;za(a|0,b|0)}function $c(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;Ma[a&7](b|0,c|0,d|0,e|0,f|0)}function ad(a){a=a|0;return Na[a&3]()|0}function bd(a,b){a=a|0;b=b|0;Oa[a&31](b|0)}function cd(a,b,c){a=a|0;b=b|0;c=c|0;Pa[a&31](b|0,c|0)}function dd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return Qa[a&7](b|0,c|0,d|0)|0}function ed(a,b){a=a|0;b=b|0;return Ra[a&15](b|0)|0}function fd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;Sa[a&7](b|0,c|0,d|0)}function gd(a){a=a|0;Ta[a&3]()}function hd(a,b,c){a=a|0;b=b|0;c=c|0;return Ua[a&7](b|0,c|0)|0}function id(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;Va[a&3](b|0,c|0,d|0,e|0)}function jd(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;$(0)}function kd(){$(1);return 0}function ld(a){a=a|0;$(2)}function md(a,b){a=a|0;b=b|0;$(3)}function nd(a,b,c){a=a|0;b=b|0;c=c|0;$(4);return 0}function od(a){a=a|0;$(5);return 0}function pd(a,b,c){a=a|0;b=b|0;c=c|0;$(6)}function qd(){$(7)}function rd(a,b){a=a|0;b=b|0;$(8);return 0}function sd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;$(9)}




// EMSCRIPTEN_END_FUNCS
var Ma=[jd,jd,Nc,jd,Mb,jd,jd,jd];var Na=[kd,kd,xb,kd];var Oa=[ld,ld,zb,ld,Fc,ld,Kb,ld,yb,ld,gc,ld,Ub,ld,Ob,ld,Pb,ld,Sb,ld,Qb,ld,ld,ld,ld,ld,ld,ld,ld,ld,ld,ld];var Pa=[md,md,Mc,md,Jb,md,Hc,md,Kc,md,_c,md,Bb,md,Ic,md,Ab,md,Lb,md,Jc,md,Ib,md,Lc,md,Wb,md,Hb,md,md,md];var Qa=[nd,nd,Bc,nd,Gc,nd,nd,nd];var Ra=[od,od,Cb,od,Ec,od,sc,od,qb,od,ub,od,od,od,od,od];var Sa=[pd,pd,Db,pd,Gb,pd,Fb,pd];var Ta=[qd,qd,Rb,qd];var Ua=[rd,rd,rb,rd,bc,rd,rd,rd];var Va=[sd,sd,Tb,sd];return{_testSetjmp:Xc,_strlen:Zc,_free:Rc,_realloc:Sc,_tessellate:Pc,_memset:Vc,_malloc:Qc,_saveSetjmp:Wc,_memcpy:Yc,runPostSets:kb,stackAlloc:Wa,stackSave:Xa,stackRestore:Ya,setThrew:Za,setTempRet0:ab,setTempRet1:bb,setTempRet2:cb,setTempRet3:db,setTempRet4:eb,setTempRet5:fb,setTempRet6:gb,setTempRet7:hb,setTempRet8:ib,setTempRet9:jb,dynCall_viiiii:$c,dynCall_i:ad,dynCall_vi:bd,dynCall_vii:cd,dynCall_iiii:dd,dynCall_ii:ed,dynCall_viii:fd,dynCall_v:gd,dynCall_iii:hd,dynCall_viiii:id}})


// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_viiiii": invoke_viiiii, "invoke_i": invoke_i, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_iiii": invoke_iiii, "invoke_ii": invoke_ii, "invoke_viii": invoke_viii, "invoke_v": invoke_v, "invoke_iii": invoke_iii, "invoke_viiii": invoke_viiii, "_llvm_lifetime_end": _llvm_lifetime_end, "___assert_fail": ___assert_fail, "_abort": _abort, "_fprintf": _fprintf, "_fflush": _fflush, "_fputc": _fputc, "_sysconf": _sysconf, "___setErrNo": ___setErrNo, "_fwrite": _fwrite, "_write": _write, "_send": _send, "_longjmp": _longjmp, "__reallyNegative": __reallyNegative, "__formatString": __formatString, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_fileno": _fileno, "_pwrite": _pwrite, "_putchar": _putchar, "_sbrk": _sbrk, "___errno_location": ___errno_location, "_llvm_lifetime_start": _llvm_lifetime_start, "_mkport": _mkport, "_time": _time, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "NaN": NaN, "Infinity": Infinity, "_stderr": _stderr }, buffer);
var _testSetjmp = Module["_testSetjmp"] = asm["_testSetjmp"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _tessellate = Module["_tessellate"] = asm["_tessellate"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _saveSetjmp = Module["_saveSetjmp"] = asm["_saveSetjmp"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_i = Module["dynCall_i"] = asm["dynCall_i"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];

Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };

// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;

// === Auto-generated postamble setup entry stuff ===

if (memoryInitializer) {
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module['readBinary'](memoryInitializer);
    HEAPU8.set(data, STATIC_BASE);
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      HEAPU8.set(data, STATIC_BASE);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}

function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  args = args || [];

  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);

  initialStackTop = STACKTOP;

  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}




function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    ensureInitRuntime();

    preMain();

    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;

function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;

  // exit the runtime
  exitRuntime();

  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371

  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;

function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }

  ABORT = true;
  EXITSTATUS = 1;

  throw 'abort() at ' + stackTrace();
}
Module['abort'] = Module.abort = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}


run();

// {{POST_RUN_ADDITIONS}}






// {{MODULE_ADDITIONS}}






};
new emscriptenate(Module);


var tessellate = {};

tessellate.tessellate = (function() {

var c_tessellate = Module.cwrap('tessellate', 'void', ['number', 'number', 'number', 
                                                       'number', 'number', 'number']);
var tessellate = function(loops)
{
    var i;
    if (loops.length === 0)
        throw "Expected at least one loop";

    var vertices = [];
    var boundaries = [0];

    for (var l=0; l<loops.length; ++l) {
        var loop = loops[l];
        if (loop.length % 2 !== 0)
            throw "Expected even number of coordinates";
        vertices.push.apply(vertices, loop);
        boundaries.push(vertices.length);
    }

    var p = Module._malloc(vertices.length * 8);

    for (i=0; i<vertices.length; ++i)
        Module.setValue(p+i*8, vertices[i], "double");

    var contours = Module._malloc(boundaries.length * 4);
    for (i=0; i<boundaries.length; ++i)
        Module.setValue(contours + 4 * i, p + 8 * boundaries[i], 'i32');

    var ppcoordinates_out = Module._malloc(4);
    var pptris_out = Module._malloc(4);
    var pnverts = Module._malloc(4);
    var pntris = Module._malloc(4);

    c_tessellate(ppcoordinates_out, pnverts, pptris_out, pntris, 
                 contours, contours+4*boundaries.length);

    var pcoordinates_out = Module.getValue(ppcoordinates_out, 'i32');
    var ptris_out = Module.getValue(pptris_out, 'i32');

    var nverts = Module.getValue(pnverts, 'i32');
    var ntris = Module.getValue(pntris, 'i32');

    var result_vertices = new Float64Array(nverts * 2);
    var result_triangles = new Int32Array(ntris * 3);

    for (i=0; i<2*nverts; ++i) {
        result_vertices[i] = Module.getValue(pcoordinates_out + i*8, 'double');
    }
    for (i=0; i<3*ntris; ++i) {
        result_triangles[i] = Module.getValue(ptris_out + i*4, 'i32');
    }
    Module._free(pnverts);
    Module._free(pntris);
    Module._free(ppcoordinates_out);
    Module._free(pptris_out);
    Module._free(pcoordinates_out);
    Module._free(ptris_out);
    Module._free(p);
    Module._free(contours);
    return {
        vertices: result_vertices,
        triangles: result_triangles
    };
};

return tessellate;

})();
    if (typeof define === "function" && define.amd) {
        define(tessellate);
    } else if (typeof module === "object" && module.exports) {
        module.exports = tessellate;
    } else {
        this.tessellate = tessellate;
    }
}).apply(this);
