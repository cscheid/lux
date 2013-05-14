Lux.Transform.get_inverse = function(ctx)
{
    if (_.isUndefined(ctx))
        ctx = Lux._globals.ctx;
    var s = ctx._lux_globals.transform_stack;
    return function(appearance) {
        for (var i=0; i<s.length; ++i) {
            appearance = (s[i].inverse || function(i) { return i; })(appearance);
        }
        return appearance;
    };
};
