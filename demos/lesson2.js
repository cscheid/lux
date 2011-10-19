var gl;
var square_drawable, triangle_drawable;
var model;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    model.set(Facet.translation( 1.5, 0, 0));
    square_drawable.draw();
    model.set(Facet.translation(-1.5, 0, 0));
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
    model = Shade.uniform("mat4");

    gl = Facet.initGL(canvas, {
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
    }), triangle = Facet.model({
        type: "triangles",
        elements: 3,
        vertex: [[0,1, -1,-1, 1,-1], 2]
    });

    square_drawable = Facet.bake(square, {
        position: camera.project(model.mul(Shade.vec(square.vertex, 0, 1))),
        color: Shade.color('white')
    });

    triangle_drawable = Facet.bake(triangle, {
        position: camera.project(model.mul(Shade.vec(triangle.vertex, 0, 1))),
        color: Shade.color('white')
    });

    gl.display();
});
