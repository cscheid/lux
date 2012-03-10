var gl;
var square_drawable, triangle_drawable;
var model_mat;
var angle = 0;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    model_mat.set(mat4.product(Facet.translation( 1.5, 0, 0), 
                               Facet.rotation(angle, [1,0,0])));
    square_drawable.draw();
    model_mat.set(mat4.product(Facet.translation(-1.5, 0, 0), 
                               Facet.rotation(angle, [0,1,0])));
    triangle_drawable.draw();
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
    model_mat = Shade.parameter("mat4");
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

    var square = Facet.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    });
    var triangle = Facet.model({
        type: "triangles",
        elements: [0, 1, 2],
        vertex: [[0,1, -1,-1, 1,-1], 2],
        color: [Shade.color('red'),
                Shade.color('green'),
                Shade.color('blue')]
    });

    square_drawable = Facet.bake(square, {
        position: camera.project(model_mat.mul(Shade.vec(square.vertex, 0, 1))),
        color: Shade.color('#88f')
    });

    triangle_drawable = Facet.bake(triangle, {
        position: camera.project(model_mat.mul(Shade.vec(triangle.vertex, 0, 1))),
        color: triangle.color
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
