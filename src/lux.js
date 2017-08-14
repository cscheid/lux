import LinAlg from './linalg/linalg.js';
import { _globals } from './_globals.js';
import { attributeBuffer } from './lux/attributeBuffer.js';
import { attributeBufferView } from './lux/attributeBufferView.js';
import { bake, getCurrentBatchOpts, unloadBatch } from './lux/bake.js';
import { buffer } from './lux/buffer.js';
import { conditionalBatch, conditionalActor } from './lux/conditionalBatch.js';
import { Data } from './data.js';
import { Debug } from './Debug.js';
import { init } from './lux/init.js';

var Lux = {
  // objects
  _globals,
  LinAlg,
  Data,
  Debug,

  // functions
  attributeBuffer,
  attributeBufferView,
  bake,
  buffer,
  conditionalActor,
  conditionalBatch,
  getCurrentBatchOpts,
  init,
  unloadBatch
};

exports.Lux = Lux;

/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */

