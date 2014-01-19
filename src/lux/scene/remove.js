Lux.Scene.remove = function(obj, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Lux._globals.ctx;
    }
    var scene = ctx._lux_globals.scene;
    scene.remove(obj);
};
