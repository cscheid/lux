Lux.Transform.push = function(transform, ctx) {
    if (_.isUndefined(ctx))
        ctx = Lux._globals.ctx;
    var new_stack = ctx._lux_globals.transform_stack.slice();
    new_stack.push(transform);
    ctx._lux_globals.transform_stack = new_stack;
};
