Facet.Scene.remove = function(obj, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Facet._globals.ctx;
    }
    var scene = ctx._facet_globals.scene;

    var i = scene.indexOf(obj);

    if (i === -1) {
        return undefined;
    } else {
        return scene.splice(i, 1)[0];
    }
    Facet.Scene.invalidate(undefined, undefined, ctx);
};
