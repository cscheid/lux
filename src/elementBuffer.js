// FIXME make API similar to Lux.attribute

import { LuxError } from './luxError.js';
import { setContext } from './setContext.js';

function elementBuffer(vertexArray)
{
  var ctx = Lux._globals.ctx;
  var result = ctx.createBuffer();
  result._ctx = ctx;
  result._shadeType = 'elementBuffer';
  result.itemSize = 1;
  var drawEnum;

  //////////////////////////////////////////////////////////////////////////
  // These methods are only for internal use within Lux

  result.set = function(vertexArray) {
    setContext(ctx);
    var typedArray;
    var typedArrayCtor;
    var hasExtension = ctx._luxGlobals.webglExtensions.OES_element_index_uint;
    if (hasExtension)
      typedArrayCtor = Uint32Array;
    else
      typedArrayCtor = Uint16Array;

    if (vertexArray.constructor.name === 'Array') {
      typedArray = new typedArrayCtor(vertexArray);
    } else {
      if (hasExtension) {
        if (vertexArray.constructor !== Uint16Array &&
            vertexArray.constructor !== Uint32Array) {
          throw new LuxError("Lux.elementBuffer.set requires either a plain list, a Uint16Array, or a Uint32Array");
        }
      } else {
        if (vertexArray.constructor !== Uint16Array) {
          throw new LuxError("Lux.elementBuffer.set requires either a plain list or a Uint16Array");
        }
      }
      typedArray = vertexArray;
    }
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, typedArray, ctx.STATIC_DRAW);
    if (typedArray.constructor === Uint16Array)
      drawEnum = ctx.UNSIGNED_SHORT;
    else if (typedArray.constructor === Uint32Array)
      drawEnum = ctx.UNSIGNED_INT;
        else
          throw new Error("internal error: expecting typed array to be either Uint16 or Uint32");
    this.array = typedArray;
    this.numItems = typedArray.length;
  };
  result.set(vertexArray);

  result.bind = function() {
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this);
  };
  result.draw = function(primitive) {
    ctx.drawElements(primitive, this.numItems, drawEnum, 0);
  };
  result.bindAndDraw = function(primitive) {
    this.bind();
    this.draw(primitive);
  };
  return result;
};

exports.elementBuffer = elementBuffer;
