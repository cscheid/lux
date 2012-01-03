var gl;
var cube_drawable, pyramid_drawable;
var model_mat;
var angle = 0;
var Models = Facet.Models;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    model_mat.set(Facet.rotation(angle, [1,1,1]));
    cube_drawable.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Facet.Camera.perspective({
        look_at: [[0, 0, 6], [0, 0, -1], [0, 1, 0]],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 0.1,
        far_distance: 100
    });
    model_mat = Shade.uniform("mat4");
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        },
        debugging: true
    });
    var cube = Models.flat_cube();

    cube_drawable = Facet.bake(cube, {
        position: camera.project(model_mat.mul(Shade.vec(cube.vertex, 1))),
        color: Shade.texture2D(Facet.texture({ src: "img/nehe.jpg" }),
                               cube.tex_coord)
    });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle = (elapsed / 20) * (Math.PI/180);
        gl.display();
    };
    f();
});
