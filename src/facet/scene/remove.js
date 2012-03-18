Facet.Scene.remove = function(obj)
{
    var scene = Facet._globals.ctx._facet_globals.scene;

    var i = scene.indexOf(obj);

    if (i === -1) {
        return undefined;
    } else {
        return scene.splice(i, 1)[0];
    }
    Facet.Scene.invalidate();
};
