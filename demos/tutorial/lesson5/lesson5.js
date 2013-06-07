$().ready(function () {
    var ctx = Lux.init({
        clearColor: [0,0,0,0.2]
    });

    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)]
    });
    var angle = ctx.parameters.now.mul(50).radians();

    var cube = Lux.Models.flat_cube();
    Lux.texture({ 
        src: "../../img/crate.jpg",
        onload: function() {
            Lux.Scene.add(Lux.actor({
                model: cube, 
                appearance: {
                    position: camera(Shade.rotation(angle, Shade.vec(1,1,1))(cube.vertex)),
                    color: Shade.texture2D(this, cube.tex_coord)
                }}));
            Lux.Scene.animate();
        }
    });
});
