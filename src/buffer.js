/*
 * Lux.buffer creates a WebGL buffer. Users of Lux will seldom have
 * reason to create buffers directly, and probably should look at
 * `attribute` instead.
 *
 * options:
 *
 *   `usage` should be one of gl.STATIC_DRAW, gl.DYNAMIC_DRAW, and
 *   gl.STREAM_DRAW. Default is gl.STATIC_DRAW.
 *
 *   `array` is either a Javascript array of values (which are converted to
 *   to a Float32Array internally), or a Javascript typed array, that is
 *   then used directly.
 *
 *   `keepArray`. If true, a copy of the input array is kept as the
 *   `array` field of the buffer.
 *
 */

import { LuxError } from './luxError.js';

function buffer(opts)
{
  var ctx = Lux._globals.ctx;
  opts = _.defaults(opts, {
    usage: ctx.STATIC_DRAW,
    keepArray: false
  });
  var keepArray = opts.keepArray;
  var usage = opts.usage;

  if (_.isUndefined(opts.array)) {
    throw new LuxError("opts.array must be defined");
  }

  if ([ctx.STATIC_DRAW, ctx.DYNAMIC_DRAW, ctx.STREAM_DRAW].indexOf(usage) === -1) {
    throw new LuxError("opts.usage must be one of STATIC_DRAW, DYNAMIC_DRAW, STREAM_DRAW");
  }

  var result = ctx.createBuffer();
  result.usage = usage;
  result.set = function(array) {
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
    ctx.bufferData(ctx.ARRAY_BUFFER, array, this.usage);
    if (keepArray) {
      this.array = array;
    }
    this.byteLength = array.byteLength;
  };
  result.set(opts.array);
  result.setRegion = function() {
    throw new LuxError("unimplemented");
  };

  return result;
}

exports.buffer = buffer;
