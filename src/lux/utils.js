import { Lux } from '../lux.js';

function glEnumTypedArrayMap(type)
{
  var ctx = Lux._globals.ctx;
  var map = {
    'float': {
      webglEnum: ctx.FLOAT,
      typedArrayCtor: Float32Array,
      size: 4
    },
    'short': {
      webglEnum: ctx.SHORT,
      typedArrayCtor: Int16Array,
      size: 2
    },
    'ushort': {
      webglEnum: ctx.UNSIGNED_SHORT,
      typedArrayCtor: Uint16Array,
      size: 2
    },
    'byte': {
      webglEnum: ctx.BYTE,
      typedArrayCtor: Int8Array,
      size: 1
    },
    'ubyte': {
      webglEnum: ctx.UNSIGNED_BYTE,
      typedArrayCtor: Uint8Array,
      size: 1
    }
  };
  return map[type];
}

exports.glEnumTypedArrayMap = glEnumTypedArrayMap;
