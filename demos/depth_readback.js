var gl;
var cube_drawable, pyramid_drawable;
var model_mat;
var angle = 0;
// Shade.debug = true;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    var model_cube = mat4.product(Facet.translation( 1.5, 0, 0), Facet.rotation(angle, [1,1,1]));
    var model_pyr  = mat4.product(Facet.translation(-1.5, 0, 0), Facet.rotation(angle, [0,1,0]));
    
    model_mat.set(model_cube);
    cube_drawable.draw();

    model_mat.set(model_pyr);
    pyramid_drawable.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Facet.Camera.perspective({
        look_at: [[0, 0, 6], [0, 0, -1], [0, 1, 0]],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 4,
        far_distance: 10
    });
    model_mat = Shade.uniform("mat4");
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true,
            preserveDrawingBuffer: true
        },
        mousedown: function(event) {
            Facet.Unprojector.draw_unproject_scene();
            var r = Facet.Unprojector.unproject(event.offsetX, gl.viewportHeight - event.offsetY);
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

    // one id per face of the cube
    var ids = Facet.id_buffer([1,1,1,1,2,2,2,2,3,3,3,3,
                               4,4,4,4,5,5,5,5,6,6,6,6]);
    cube_drawable = Facet.bake(cube, {
        position: camera.project(model_mat.mul(Shade.vec(cube.vertex, 1))),
        color: cube.color,
        pick_id: ids
    });

    pyramid_drawable = Facet.bake(pyramid, {
        position: camera.project(model_mat.mul(Shade.vec(pyramid.vertex, 1))),
        color: pyramid.color,
        pick_id: Shade.id(7)
    });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle = (elapsed / 20) * (Math.PI / 180);
        gl.display();
    };
    f();
});
