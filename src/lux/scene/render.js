Lux.Scene.render = function()
{
    var scene = Lux._globals.ctx._lux_globals.scene;
    for (var i=0; i<scene.length; ++i) {
        scene[i].draw();
    }
};
