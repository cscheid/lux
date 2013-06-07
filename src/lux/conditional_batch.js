Lux.conditional_batch = function(batch, condition)
{
    return {
        draw: function() {
            if (condition()) batch.draw();
        }
    };
};

Lux.conditional_actor = function(opts)
{
    var appearance = opts.appearance;
    var model = opts.model;
    var condition = opts.condition;
    var actor = Lux.actor(opts);
    actor.dress = function(scene) {
        var xform = scene.get_transform();
        var this_appearance = xform(appearance);
        var batch = Lux.bake(model, this_appearance);
        return Lux.conditional_batch(batch, condition);
    };
    return actor;
};
