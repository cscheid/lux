Lux.Transform.pop = function(ctx) {
    if (_.isUndefined(ctx))
        ctx = Lux._globals.ctx;
    var new_stack = ctx._lux_globals.transform_stack.slice();
    var result = new_stack.pop();
    ctx._lux_globals.transform_stack = new_stack;
    return result;
};
