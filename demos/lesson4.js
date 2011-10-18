var gl;
var square_drawable, triangle_drawable;
var mvp; // model_view_projection
var angle = 0;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    var proj = Facet.perspective(45, 720/480, 0.1, 100.0);

    var model_sq  = mat4.product(Facet.translation( 1.5, 0, 0), 
                                 Facet.rotation(angle, [1,0,0]));
    var model_tri = mat4.product(Facet.translation(-1.5, 0, 0), 
                                 Facet.rotation(angle, [0,1,0]));
    var view      = Facet.translation(0.0, 0.0, -6.0);
    
    mvp.set(mat4.product(proj, mat4.product(view, model_sq)));
    square_drawable.draw();

    mvp.set(mat4.product(proj, mat4.product(view, model_tri)));
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
    });
    var triangle = Facet.model({
        type: "triangles",
        elements: [0, 1, 2],
        vertex: [[0,1, -1,-1, 1,-1], 2],
        color: [Shade.color('red'),
                Shade.color('green'),
                Shade.color('blue')]
    });

    mvp = Shade.uniform("mat4");

    square_drawable = Facet.bake(square, {
        position: mvp.mul(Shade.vec(square.vertex, 0, 1)),
        color: Shade.color('#88f')
    });

    triangle_drawable = Facet.bake(triangle, {
        position: mvp.mul(Shade.vec(triangle.vertex, 0, 1)),
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
