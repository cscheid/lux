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

Lux.actor_list = function(actors_list)
{
    return {
        dress: function(scene) {
            var batch_list = _.map(actors_list, function(actor) {
                return actor.dress(scene);
            });
            return {
                draw: function() {
                    _.each(batch_list, function(batch) {
                        return batch.draw();
                    });
                }
            };
        },
        on: function(event_name, event) {
            for (var i=0; i<actors_list.length; ++i) {
                if (!actors_list[i].on(event_name, event))
                    return false;
            }
            return true;
        }
    };
};

Lux.actor_many = function(opts)
{
    opts = _.defaults(opts, {
        on: function() { return true; }
    });
    var appearance_function = opts.appearance_function;
    var model_list = opts.model_list;
    var on = opts.on;
    var model_callback = opts.model_callback;
    var scratch_model = _.clone(model_list[0]);
    var scratch_actor = Lux.actor({
        model: scratch_model,
        appearance: appearance_function(scratch_model)
    });
    var batch;

    return {
        dress: function(scene) {
            batch = scratch_actor.dress(scene);
            return model_callback ? {
                draw: function() {
                    _.each(model_list, function(model, i) {
                        _.each(scratch_model.attributes, function(v, k) {
                            v.set(model[k].get());
                        });
                        scratch_model.elements.set(model.elements.array);
                        model_callback(model, i);
                        batch.draw();
                    });
                }
            } : {
                draw: function() {
                    _.each(model_list, function(model, i) {
                        _.each(scratch_model.attributes, function(v, k) {
                            v.set(model[k].get());
                        });
                        scratch_model.elements.set(model.elements.array);
                        // model_callback(model, i); -- only difference to above
                        batch.draw();
                    });
                }
            };
        },
        on: function(event_name, event) {
            return opts.on(event_name, event);
        }
    };
};
