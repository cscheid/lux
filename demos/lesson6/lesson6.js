$().ready(function () {
    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 0.1,
        far_distance: 100
    });
    var angle = Shade.parameter("float");

    var gl = Facet.init(document.getElementById("webgl"), {
        clearColor: [0,0,0,0.2]
    });

    var cube = Facet.Models.flat_cube();

    Facet.Scene.add(Facet.bake(cube, {
        position: camera(Shade.rotation(angle, Shade.vec(1,1,1))
                         .mul(cube.vertex)),
        color: Shade.texture2D(Facet.texture({ src: "../img/nehe.jpg" }),
                               cube.tex_coord)
    }));

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f);
        var elapsed = new Date().getTime() - start;
        angle.set((elapsed / 20) * (Math.PI/180));
        gl.display();
    };
    f();
});
