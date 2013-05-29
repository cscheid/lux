Lux.Transform.clear = function(ctx) {
    // The last transformation on the stack canonicalizes
    // the appearance object to always have gl_Position, gl_FragColor
    // and gl_PointSize fields.
    if (_.isUndefined(ctx))
        ctx = Lux._globals.ctx;
    ctx._lux_globals.transform_stack = [Shade.canonicalize_program_object];
};
