$().ready(function () {
    var gl = Facet.init(document.getElementById("webgl"), {
        clearColor: [0,0,0,0.2]
    });

    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)]
    });
    var angle = gl.parameters.now.mul(50).radians();

    var cube = Facet.Models.flat_cube();
    var texture = Facet.texture({ src: "../img/nehe.jpg" });
    Facet.Scene.add(Facet.conditional_batch(
        Facet.bake(cube, {
            position: camera(Shade.rotation(angle, Shade.vec(1,1,1))
                             (cube.vertex)),
            color: Shade.texture2D(texture, cube.tex_coord)
        }), function() {
            return texture.ready;
        }));
    Facet.Scene.animate();
});
