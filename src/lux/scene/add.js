Lux.Scene.add = function(obj, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Lux._globals.ctx;
    }
    var scene = ctx._lux_globals.scene;

    scene.push(obj);
    Lux.Scene.invalidate(undefined, undefined, ctx);
    return obj;
};
