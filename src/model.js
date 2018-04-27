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

  _.each(opts.attributes, (k, v) => {
    var itemSize = v[0].length;
    if (_.any(v, lst => lst.length !== itemSize)) {
      throw new LuxError('model vertex dimensions must be the same. Expected '
                         + itemSize + ', got other values.');
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
}

exports.model = model;
