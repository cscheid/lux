Lux.Transform.get = function(ctx)
{
    if (_.isUndefined(ctx))
        ctx = Lux._globals.ctx;
    var s = ctx._lux_globals.transform_stack;
    return function(appearance) {
        var i = s.length;
        while (--i >= 0) {
            appearance = s[i](appearance);
        }
        return appearance;
    };
};
