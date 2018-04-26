/*
 * Lux.attributeBufferView builds an attributeBuffer object from an
 * Lux.buffer object, instead of an array (or typed array). The main
 * use case for attributeBufferView is to allow one to build
 * several attributeBufferViews over the same Lux.buffer, for efficient
 * strided attribute buffers (which share the same buffer)
 *
 * The main difference between calling Lux.attributeBufferView and
 * Lux.attribute is that attributeBufferView takes a "buffer"
 * parameter instead of an "array" parameter.
 *
 */

import { LuxError } from './luxError.js';
import { setContext } from './setContext.js';

function attributeBufferView(opts)
{
  var ctx = Lux._globals.ctx;
  opts = _.defaults(opts, {
    itemSize: 3,
    itemType: 'float',
    normalized: false,
    keepArray: false,
    stride: 0,
    offset: 0
  });

  if (_.isUndefined(opts.buffer)) {
    throw new LuxError('opts.buffer must be defined');
  }

  var itemSize = opts.itemSize;
  if ([1,2,3,4].indexOf(itemSize) === -1) {
    throw new LuxError('opts.itemSize must be one of 1, 2, 3, or 4');
  }

  var normalized = opts.normalized;
  if (typeof normalized !== 'boolean') {
    throw new Error('opts.normalized must be boolean');
  }

  var glEnumTypedArrayMap = {
    'float': { webglEnum: ctx.FLOAT, typedArrayCtor: Float32Array, size: 4 },
    'short': { webglEnum: ctx.SHORT, typedArrayCtor: Int16Array, size: 2 },
    'ushort': { webglEnum: ctx.UNSIGNED_SHORT, typedArrayCtor: Uint16Array, size: 2 },
    'byte': { webglEnum: ctx.BYTE, typedArrayCtor: Int8Array, size: 1 },
    'ubyte': { webglEnum: ctx.UNSIGNED_BYTE, typedArrayCtor: Uint8Array, size: 1 }
  };

  var itemType = glEnumTypedArrayMap[opts.itemType];
  if (_.isUndefined(itemType)) {
    throw new LuxError('opts.itemType must be \'float\', \'short\', \'ushort\', \'byte\' or \'ubyte\'');
  }

  function convertArray(array) {
    var numItems;
    if (array.constructor === Array) {
      if (array.length % itemSize) {
        throw new Error("set: attributeBufferView expected length to be a multiple of " +
                        itemSize + ", got " + array.length + " instead.");
      }
      array = new itemType.typedArrayCtor(array);
    } else if (array.constructor === itemType._typedArrayCtor) {
      if (array.length % itemSize) {
        throw new Error("set: attributeBufferView expected length to be a multiple of " +
                        itemSize + ", got " + array.length + " instead.");
      }
    } else if (opts.vertexArray.constructor === ArrayBuffer) {
      array = opts.vertexArray;
    }
    return array;
  }

  var result = {
    buffer: opts.buffer,
    itemSize: itemSize,
    normalized: normalized,
    numItems: opts.buffer.byteLength / (opts.stride || itemSize * itemType.size),
    stride: opts.stride,
    offset: opts.offset,
    _ctx: ctx,
    _shadeType: 'attributeBuffer',
    _webglType: itemType.webglEnum,
    _typedArrayCtor: itemType.typedArrayCtor,
    _wordLength: itemType.size,
    _itemByteLength: opts.stride || itemType.size * itemSize,
    set: function(vertexArray) {
      vertexArray = convertArray(vertexArray);
      this.buffer.set(vertexArray);
      this.numItems = this.buffer.byteLength / (this.stride || this.itemSize * this._wordLength);
      if (opts.keepArray) {
        this.array = this.buffer.array;
      }
    },
    setRegion: function() {
      throw new Error("currently unimplemented");
    },
    //////////////////////////////////////////////////////////////////////
    // These methods are only for internal use within Lux
    bind: function(attribute) {
      setContext(ctx);
      ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
      ctx.vertexAttribPointer(attribute, this.itemSize, this._webglType, normalized, this.stride, this.offset);
    },
    draw: function(primitive) {
      setContext(ctx);
      ctx.drawArrays(primitive, 0, this.numItems);
    },
    bindAndDraw: function(attribute, primitive) {
      // here we inline the calls to bind and draw to shave a redundant setContext.
      setContext(ctx);
      ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
      ctx.vertexAttribPointer(attribute, this.itemSize, this._webglType, normalized, this.stride, this.offset);
      ctx.drawArrays(primitive, 0, this.numItems);
    }
  };
  if (opts.keepArray)
    result.array = result.buffer.array;
  return result;
};

exports.attributeBufferView = attributeBufferView;
