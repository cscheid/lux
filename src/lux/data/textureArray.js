/*
 texture array takes an object with fields:

   nCols (integer): number of columns in the 2D array of data
   nRows (integer): number of rows in the 2D array of data
   elements (array, Float32Array): list of elements in the array

 and returns an object with four fields:

 nCols (integer): number of columns in the data

 nRows (integer): number of rows in the data

 at (function(Shade(int), Shade(int)) -> Shade(float)): returns the
 value stored at given row and column

 index (function(Shade(int), Shade(int)) -> Shade(vec3)): returns
 the index of the value stored at given row and column. This is a
 three dimensional vector.  The first two coordinates store the
 texture coordinate, and the fourth coordinate stores the
 channel. This is necessary to take advantage of RGBA float
 textures, which have the widest support on WebGL-capable hardware.

 For example, luminance float textures appear to clamp to [0,1], at
 least on Chrome 15 on Linux.
*/

import { Lux } from '../../lux.js';
import { Shade } from '../../shade.js';

exports.textureArray = function(opts)
{
  var ctx = Lux._globals.ctx;
  var elements = opts.elements;
  var nCols = opts.nCols;
  var nRows = opts.nRows;

  var textureWidth = 1;
  while (4 * textureWidth * textureWidth < elements.length) {
    textureWidth = textureWidth * 2;
  }
    var textureHeight = Math.ceil(elements.length / (4 * textureWidth));
  
  var newElements;
  if (textureWidth * textureHeight === elements.length) {
    if (Lux.typeOf(elements) === "array") {
      newElements = new Float32Array(elements);
    } else
      newElements = elements;
  } else {
    newElements = new Float32Array(textureWidth * textureHeight * 4);
    for (var i=0; i<elements.length; ++i)
      newElements[i] = elements[i];
  }

  var texture = Lux.texture({
    width: textureWidth,
    height: textureHeight,
    buffer: newElements,
    type: ctx.FLOAT,
    format: ctx.RGBA,
    minFilter: ctx.NEAREST,
    magFilter: ctx.NEAREST
  });

  var index = Shade(function(row, col) {
    var linearIndex   = row.mul(nCols).add(col);
    var inTexelOffset = linearIndex.mod(4);
    var texelIndex    = linearIndex.div(4).floor();
    var x             = texelIndex.mod(textureWidth);
    var y             = texelIndex.div(textureWidth).floor();
    var result        = Shade.vec(x, y, inTexelOffset);
    return result;
  });
  var at = Shade(function(row, col) {
    // returns Shade expression with value at row, col
    var ix = index(row, col);
    var uv = ix.swizzle("xy")
          .add(Shade.vec(0.5, 0.5))
          .div(Shade.vec(textureWidth, textureHeight))
    ;
    return Shade.texture2D(texture, uv).at(ix.z());
  });

  return {
    nRows: nRows,
    nCols: nCols,
    at: at,
    index: index
  };
};

/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */
