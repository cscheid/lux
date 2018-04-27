// We provide better names for program targets so users don't need to
// memorize gl_FragColor, gl_Position and gl_PointSize.
//
// However, these names should still work, in case the users
// want to have GLSL-familiar names.

import _ from 'lodash';

function canonicalizeAppearance(appearance)
{
  var result = {};
  var canonicalizationMap = {
    'color': 'gl_FragColor',
    'position': 'gl_Position',
    'screenPosition': 'gl_Position',
    'pointSize': 'gl_PointSize'
  };

  _.each(appearance, function(v, k) {
    var transposedKey = (k in canonicalizationMap) ?
        canonicalizationMap[k] : k;
    result[transposedKey] = v;
  });
  return result;
};

exports.canonicalizeAppearance = canonicalizeAppearance;
