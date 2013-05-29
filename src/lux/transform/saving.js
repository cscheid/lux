Lux.Transform.saving = function(what, ctx) {
    if (_.isUndefined(ctx))
        ctx = Lux._globals.ctx;
    var old_stack = ctx._lux_globals.transform_stack;
    try {
        return what();
    } finally {
        ctx._lux_globals.transform_stack = old_stack;
    }
};
