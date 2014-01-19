Lux.Scene.remove = function(obj, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Lux._globals.ctx;
    }
    var scene = ctx._lux_globals.scene;
    scene.remove(obj);

    // var i = scene.indexOf(obj);

    // if (i === -1) {
    //     return undefined;
    // } else {
    //     return scene.splice(i, 1)[0];
    // }
    // Lux.Scene.invalidate(undefined, undefined, ctx);
};
