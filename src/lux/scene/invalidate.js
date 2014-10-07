Lux.Scene.invalidate = function(pre_display, post_display, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Lux._globals.ctx;
    }
    var scene = ctx._luxGlobals.scene;

    return scene.invalidate(pre_display, post_display);
};
