import { attribute } from './attribute.js';
import { elementBuffer } from './elementBuffer.js';
import { LuxError } from './luxError.js';
import Lux from './lux.js';
import _ from 'lodash';

function model(opts)
{
  opts = _.defaults(opts, {
    primitive: Lux.triangles
  });

  var result = { attributes: {} };

  // let's not allow expressions in models right now.

  _.each(opts.attributes, (v, k) => {
    var itemSize = v[0].length;
    var badValues = _.filter(v, lst => lst.length !== itemSize);
    if (badValues.length !== 0) {
      throw new LuxError('model vertex dimensions must be the same. Expected '
                         + itemSize + ', got ' + badValues[0] + ' instead.');
    }
    var attributeObj = attribute({
      array: [].concat.apply([], v),
      itemSize: itemSize
    });
    result.attributes[k] = attributeObj;
  });

  if (!_.isUndefined(opts.elements)) {
    result.elements = elementBuffer(opts.elements);
  }

  return result;
}

exports.model = model;
