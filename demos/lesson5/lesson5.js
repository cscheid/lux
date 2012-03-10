var gl;
var cube_drawable, pyramid_drawable;
var angle = 0;
var angle_parameter;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    cube_drawable.draw();
    pyramid_drawable.draw();
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
    angle_parameter = Shade.parameter("float");
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

    var cube = Facet.model({
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

    var pyramid = Facet.model({
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

    var cube_xformed_vertex = Shade.translation(Shade.vec(1.5, 0, 0))
        .mul(Shade.rotation(angle_parameter, Shade.vec(1,1,1)))
        .mul(Shade.vec(cube.vertex, 1));

    var pyramid_xformed_vertex = Shade.translation(Shade.vec(-1.5, 0, 0))
        .mul(Shade.rotation(angle_parameter, Shade.vec(0,1,0)))
        .mul(Shade.vec(pyramid.vertex, 1));

    cube_drawable = Facet.bake(cube, {
        position: camera.project(cube_xformed_vertex),
        color: cube.color
    });

    pyramid_drawable = Facet.bake(pyramid, {
        position: camera.project(pyramid_xformed_vertex),
        color: pyramid.color
    });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle = (elapsed / 20) * (Math.PI / 180);
        angle_parameter.set(angle);
        gl.display();
    };
    f();
});
