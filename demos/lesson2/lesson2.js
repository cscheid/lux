var gl;
var square, triangle;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    square.draw();
    triangle.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 0.1,
        far_distance: 100
    });

    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        }
    });

    var square_model = Facet.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    }), triangle_model = Facet.model({
        type: "triangles",
        elements: 3,
        vertex: [[0,1, -1,-1, 1,-1], 2]
    });

    square = Facet.bake(square_model, {
        position: camera(
            Shade.translation(Shade.vec(1.5, 0, 0)).mul(square_model.vertex)),
        color: Shade.color('white')
    });

    triangle = Facet.bake(triangle_model, {
        position: camera(
            Shade.translation(Shade.vec(-1.5, 0, 0)).mul(triangle_model.vertex)),
        color: Shade.color('white')
    });

    gl.display();
});
