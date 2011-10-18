var gl;
var square_drawable, triangle_drawable;
var mvp; // model_view_projection

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    var proj = Facet.perspective(45, 720/480, 0.1, 100.0);

    mvp.set(mat4.product(proj, Facet.translation( 1.5, 0.0, -6.0)));
    square_drawable.draw();

    mvp.set(mat4.product(proj, Facet.translation(-1.5, 0.0, -6.0)));
    triangle_drawable.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Facet.initGL(canvas,
                      {
                          clearDepth: 1.0,
                          clearColor: [0,0,0,0.2],
                          display: draw_it,
                          attributes:
                          {
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

    mvp = Shade.uniform("mat4");

    square_drawable = Facet.bake(square, {
        position: mvp.mul(Shade.vec(square.vertex, 0, 1)),
        color: Shade.color('white')
    });

    triangle_drawable = Facet.bake(triangle, {
        position: mvp.mul(Shade.vec(triangle.vertex, 0, 1)),
        color: Shade.color('white')
    });

    gl.display();
});
