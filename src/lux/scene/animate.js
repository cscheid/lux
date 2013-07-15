Lux.Scene.animate = function(tick_function, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Lux._globals.ctx;
    }
    var scene = ctx._lux_globals.scene;

    return scene.animate(tick_function);
};
