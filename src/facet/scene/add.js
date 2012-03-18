Facet.Scene.add = function(obj)
{
    var scene = Facet._globals.ctx._facet_globals.scene;

    scene.push(obj);
    Facet.Scene.invalidate();
};
