/*
 * An actor must conform to the following interface:

 * - actors respond to a "dress" method. This method takes as a
 * parameter an object conforming to the scene interface and returns
 * an object conforming to the batch interface. 
 *
 * By default, this is done by transforming the actor's appearance
 * object via the scene's transform. It's called "dress" because
 * different actors are transformed by scenes to look different (that
 * is, they "dress" differently)

 * - actors respond to an "on" method. This method takes as a
 * parameter a string and an object. The string is the name of the
 * canvas event that was triggered, and the object is the
 * corresponding event. The method should return false if the event
 * handling chain is to be terminated. If true, the event handling
 * loop will keep traversing the scene graph and calling event
 * handlers.

 */

import { Lux } from '../lux.js';
import _ from 'lodash';

function actor(opts)
{
  opts = _.defaults(opts, {
    on: function() { return true; },
    bake: Lux.bake
  });
  var appearance = opts.appearance;
  var model = opts.model;
  var on = opts.on;
  var bake = opts.bake;
  var batch;
  return {
    dress: function(scene) {
      var xform = scene.getTransform();
      var thisAppearance = xform(appearance);
      return bake(model, thisAppearance);
    },
    on: (eventName, event) => opts.on(eventName, event)
  };
}

Lux.actorList = function(actorsList)
{
  return {
    dress: function(scene) {
      var batchList = actorsList.map(actor => actor.dress(scene));
      return {
        draw: () => batchList.forEach(batch => batch.draw())
      };
    },
    on: function(eventName, event) {
      for (var i=0; i<actorsList.length; ++i) {
        if (!actorsList[i].on(eventName, event))
          return false;
      }
      return true;
    }
  };
};

Lux.actorMany = function(opts)
{
  opts = _.defaults(opts, { on: () => true });
  var appearanceFunction = opts.appearanceFunction;
  var modelList = opts.modelList;
  var on = opts.on;
  var modelCallback = opts.modelCallback;
  var scratchModel = _.clone(modelList[0]);
  var scratchActor = Lux.actor({
    model: scratchModel,
    appearance: appearanceFunction(scratchModel)
  });
  var batch;

  return {
    dress: function(scene) {
      batch = scratchActor.dress(scene);
      return modelCallback ? {
        draw: function() {
          modelList.forEach((model, i) => {
            scratchModel.attributes.forEach((v, k) => v.set(model[k].get()));
            scratchModel.elements.set(model.elements.array);
            modelCallback(model, i);
            batch.draw();
          });
        }
      } : {
        draw: function() {
          modelList.forEach((model, i) => {
            scratchModel.attributes.forEach((v, k) => v.set(model[k].get()));
            scratchModel.elements.set(model.elements.array);
            // modelCallback(model, i); -- only difference to above
            batch.draw();
          });
        }
      };
    },
    on: function(eventName, event) {
      return opts.on(eventName, event);
    }
  };
};

/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */
