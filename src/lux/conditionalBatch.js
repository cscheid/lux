import { Lux } from '../lux.js';
import _ from 'lodash';

exports.conditionalBatch = function(batch, condition)
{
  return {
    draw: function() {
      if (condition()) batch.draw();
    }
  };
};

exports.conditionalActor = function(opts)
{
  opts = _.clone(opts);
  opts.bake = function(model, changedAppearance) {
    return Lux.conditionalBatch(Lux.bake(model, changedAppearance), opts.condition);
  };
  return Lux.actor(opts);
};
                                  
/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */
