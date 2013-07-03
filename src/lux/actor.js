/*
 * An actor must conform to the following interface:

 * - actors respond to a "dress" method. This method takes as a
 * parameter an object conforming to the scene interface and returns
 * an object conforming to the batch interface.

 * - actors respond to an "on" method. This method takes as a
 * parameter a string and an object. The string is the name of the
 * canvas event that was triggered, and the object is the
 * corresponding event. The method should return false if the event
 * handling chain is to be terminated. If true, the event handling
 * loop will keep traversing the scene graph and calling event
 * handlers.

 */

Lux.actor = function(opts)
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
            var xform = scene.get_transform();
            var this_appearance = xform(appearance);
            return bake(model, this_appearance);
        },
        on: function(event_name, event) {
            return opts.on(event_name, event);
        }
    };
};
