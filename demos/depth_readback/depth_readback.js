var gl;
var cube, pyramid;
var angle;
// Shade.debug = true;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    cube.draw();
    pyramid.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 4,
        far_distance: 10
    });
    angle = Shade.parameter("float");
    gl = Lux.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true,
            preserveDrawingBuffer: true
        },
        mousedown: function(event) {
            Lux.Unprojector.draw_unproject_scene();
            var r = Lux.Unprojector.unproject(event.luxX, event.luxY);
            $("#pickresult").html(String(r));
        }
    });

    var g = Shade.color('green'),
        r = Shade.color('red'),
        o = Shade.color('orange'),
        y = Shade.color('yellow'),
        b = Shade.color('blue'),
        v = Shade.color('violet');

    // because we're making flat-shaded faces, we need separate
    // vertices for each "side" of the corner. So, even though there's
    // only 8 vertices in a cube, we end up with 24 of them, since we
    // need three colors per corner.

    var cube_model = Lux.model({
        type: "triangles",
        elements: [0,  1,  2,  0,  2,  3,
                   4,  5,  6,  4,  6,  7,
                   8,  9,  10, 8,  10, 11,
                   12, 13, 14, 12, 14, 15,
                   16, 17, 18, 16, 18, 19,
                   20, 21, 22, 20, 22, 23],
        vertex: [[ 1, 1,-1, -1, 1,-1, -1, 1, 1,  1, 1, 1,
                   1,-1, 1, -1,-1, 1, -1,-1,-1,  1,-1,-1,
                   1, 1, 1, -1, 1, 1, -1,-1, 1,  1,-1, 1,
                   1,-1,-1, -1,-1,-1, -1, 1,-1,  1, 1,-1,
                  -1, 1, 1, -1, 1,-1, -1,-1,-1, -1,-1, 1,
                   1, 1,-1,  1, 1, 1,  1,-1, 1,  1,-1,-1], 3],
        color: [g, g, g, g, o, o, o, o, r, r, r, r,
                y, y, y, y, b, b, b, b, v, v, v, v]
    });

    // For the pyramid, however, each vertex has only one color 
    // associated with it, so we can reuse the information.

    var pyramid_model = Lux.model({
        type: "triangles",
        elements: [0, 1, 2,
                   0, 2, 3,
                   0, 3, 4,
                   0, 4, 1],
        vertex: [[ 0,  1,  0, 
                  -1, -1,  1, 
                  -1, -1, -1,
                   1, -1, -1,
                   1, -1,  1], 3],
        color: [r, g, b, g, b]
    });

    // one id per face of the cube
    var ids = Lux.id_buffer([1,1,1,1,2,2,2,2,3,3,3,3,
                               4,4,4,4,5,5,5,5,6,6,6,6]);
    var cube_xformed_vertex = Shade.translation(Shade.vec(1.5, 0, 0))
        .mul(Shade.rotation(angle, Shade.vec(1,1,1)))
        .mul(cube_model.vertex);

    var pyramid_xformed_vertex = Shade.translation(Shade.vec(-1.5, 0, 0))
        .mul(Shade.rotation(angle, Shade.vec(0,1,0)))
        .mul(pyramid_model.vertex);

    cube = Lux.bake(cube_model, {
        position: camera(cube_xformed_vertex),
        color: cube_model.color,
        pick_id: ids
    });

    pyramid = Lux.bake(pyramid_model, {
        position: camera(pyramid_xformed_vertex),
        color: pyramid_model.color,
        pick_id: Shade.id(7)
    });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle.set((elapsed / 20) * (Math.PI / 180));
        gl.display();
    };
    f();
});
