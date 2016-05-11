Lux.Scene.invalidate = function(preDisplay, postDisplay, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Lux._globals.ctx;
    }
    var scene = ctx._luxGlobals.scene;

    return scene.invalidate(preDisplay, postDisplay);
};
