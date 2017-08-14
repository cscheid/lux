import { Lux } from '../../lux.js';
import { Shade } from '../../shade.js';

exports.array1d = function(array)
{
  var ctx = Lux._globals.ctx;
  var elements = array;
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
    minFilter: ctx.NEAREST
  });

  var index = Shade(function(linearIndex) {
    var inTexelOffset = linearIndex.mod(4);
    var texelIndex = linearIndex.div(4).floor();
    var x = texelIndex.mod(textureWidth);
    var y = texelIndex.div(textureWidth).floor();
    var result = Shade.vec(x, y, inTexelOffset);
    return result;
  });

  var at = Shade(function(linearIndex) {
    var ix = index(linearIndex);
    var uv = ix.swizzle("xy")
          .add(Shade.vec(0.5, 0.5))
          .div(Shade.vec(textureWidth, textureHeight))
    ;
    return Shade.texture2D(texture, uv).at(ix.z());
  });
  return {
    length: newElements.length,
    at: at,
    index: index
  };
};

/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */
