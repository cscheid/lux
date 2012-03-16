var gl;
var teapot;
var model_mat;
var Models = Facet.Models;
var angle;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    teapot.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Facet.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 0.1,
        far_distance: 100
    });
    angle = Shade.parameter("float");
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        }
    });
    var teapot_model = Models.teapot();

    teapot = Facet.bake(teapot_model, {
        position: camera(Shade.rotation(angle, Shade.vec(1,1,1)).mul(teapot_model.vertex)),
        color: Shade.vec(Shade.abs(teapot_model.vertex), 1)
    });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle.set((elapsed / 20) * (Math.PI/180));
        gl.display();
    };
    f();
});
