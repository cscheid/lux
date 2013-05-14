Lux.Transform.using = function(transformation, what, ctx)
{
    if (_.isUndefined(ctx))
        ctx = Lux._globals.ctx;
    return Lux.Transform.saving(function() {
        Lux.Transform.push(transformation, ctx);
        return what();
    });
};
