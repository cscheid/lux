Lux.Scene.add = function(obj, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Lux._globals.ctx;
    }
    var scene = ctx._luxGlobals.scene;

    return scene.add(obj);
};
