// We provide better names for program targets so users don't need to
// memorize gl_FragColor, gl_Position and gl_PointSize.
//
// However, these names should still work, in case the users
// want to have GLSL-familiar names.

import _ from 'lodash';
import Program from './program.js';
import escodegen from 'escodegen';

function canonicalizeAppearance(appearanceFun)
{
  var result = {};
  var canonicalizationMap = {
    'color': 'gl_FragColor',
    'position': 'gl_Position',
    'screenPosition': 'gl_Position',
    'pointSize': 'gl_PointSize'
  };

  var analysis = Program.analyzeAppearanceFunction(appearanceFun);

  analysis.returnExpression.properties.forEach(prop => {
    if (prop.key.name in canonicalizationMap) {
      prop.key.name = canonicalizationMap[prop.key.name];
    }
  });

  var newFun = escodegen.generate(analysis.ast);
  debugger;

  // create new appearance function, cross your fingers
  // _.each(appearance, function(v, k) {
  //   var transposedKey = (k in canonicalizationMap) ?
  //       canonicalizationMap[k] : k;
  //   result[transposedKey] = v;
  // });

  return appearanceFun;
};

exports.canonicalizeAppearance = canonicalizeAppearance;
