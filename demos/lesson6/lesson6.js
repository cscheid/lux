$().ready(function () {
    var gl = Lux.init({
        clearColor: [0,0,0,0.2]
    });

    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)]
    });
    var angle = gl.parameters.now.mul(50).radians();

    var cube = Lux.Models.flat_cube();
    var texture = Lux.texture({ src: "../img/nehe.jpg" });
    Lux.Scene.add(Lux.conditional_batch(
        Lux.bake(cube, {
            position: camera(Shade.rotation(angle, Shade.vec(1,1,1))
                             (cube.vertex)),
            color: Shade.texture2D(texture, cube.tex_coord)
        }), function() {
            return texture.ready;
        }));
    Lux.Scene.animate();
});
