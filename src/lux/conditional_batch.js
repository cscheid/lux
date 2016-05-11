Lux.conditionalBatch = function(batch, condition)
{
    return {
        draw: function() {
            if (condition()) batch.draw();
        }
    };
};

Lux.conditionalActor = function(opts)
{
    opts = _.clone(opts);
    opts.bake = function(model, changedAppearance) {
        return Lux.conditionalBatch(Lux.bake(model, changedAppearance), opts.condition);
    };
    return Lux.actor(opts);
};
