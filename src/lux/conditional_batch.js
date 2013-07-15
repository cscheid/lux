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
    opts = _.clone(opts);
    opts.bake = function(model, changed_appearance) {
        return Lux.conditional_batch(Lux.bake(model, changed_appearance), opts.condition);
    };
    return Lux.actor(opts);
};
