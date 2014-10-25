Lux.Scene.animate = function(tickFunction, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Lux._globals.ctx;
    }
    var scene = ctx._luxGlobals.scene;

    return scene.animate(tickFunction);
};
