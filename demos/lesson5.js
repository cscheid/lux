var gl;
var cube_drawable, pyramid_drawable;
var mvp; // model_view_projection
var angle = 0;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    var proj = Facet.perspective(45, 720/480, 0.1, 100.0);

    var model_cube = mat4.product(Facet.translation( 1.5, 0, 0), Facet.rotation(angle, [1,1,1]));
    var model_pyr  = mat4.product(Facet.translation(-1.5, 0, 0), Facet.rotation(angle, [0,1,0]));
    var view       = Facet.translation( 0, 0, -6);
    
    mvp.set(mat4.product(proj, mat4.product(view, model_cube)));
    cube_drawable.draw();

    mvp.set(mat4.product(proj, mat4.product(view, model_pyr)));
    pyramid_drawable.draw();
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

    mvp = Shade.uniform("mat4");

    cube_drawable = Facet.bake(cube, {
        position: mvp.mul(Shade.vec(cube.vertex, 1)),
        color: cube.color
    });

    pyramid_drawable = Facet.bake(pyramid, {
        position: mvp.mul(Shade.vec(pyramid.vertex, 1)),
        color: pyramid.color
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
