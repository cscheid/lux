var gl;
var square_batch, triangle_batch;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    square_batch.draw();
    triangle_batch.draw();
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

    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0.2,0.2,0.2,0.2],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        }
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

    square_batch = Facet.bake(square, {
        position: camera(
            Shade.translation(Shade.vec( 1.5, 0, 0)).mul(square.vertex)),
        color: Shade.color('#88f')
    });

    triangle_batch = Facet.bake(triangle, {
        position: camera(
            Shade.translation(Shade.vec(-1.5, 0, 0)).mul(triangle.vertex)),
        color: triangle.color
    });

    gl.display();
});
