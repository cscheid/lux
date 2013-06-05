Lux.Scene.on = function(ename, event, ctx) 
{
    if (_.isUndefined(ctx)) {
        ctx = Lux._globals.ctx;
    }
    var scene = ctx._lux_globals.scene;

    return scene.on(ename, event);
};
