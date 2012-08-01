Facet.Scene.render = function()
{
    var scene = Facet._globals.ctx._facet_globals.scene;
    for (var i=0; i<scene.length; ++i) {
        scene[i].draw();
    }
};
