Facet.Scene.add = function(obj, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Facet._globals.ctx;
    }
    var scene = ctx._facet_globals.scene;

    scene.push(obj);
    Facet.Scene.invalidate(undefined, undefined, ctx);
};
