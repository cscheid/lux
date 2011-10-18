var gl;
var cube_drawable, pyramid_drawable;
var mvp; // model_view_projection
var angle = 0;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    var proj = Facet.perspective(45, 720/480, 0.1, 100.0);
    var model_cube = Facet.rotation(angle, [1,1,1]);
    var view       = Facet.translation(0.0, 0.0, -6.0);
    
    mvp.set(mat4.product(proj, mat4.product(view, model_cube)));
    cube_drawable.draw();
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
    var cube = Models.flat_cube();

    mvp = Shade.uniform("mat4");

    cube_drawable = Facet.bake(cube, {
        position: mvp.mul(Shade.vec(cube.vertex, 1)),
        color: Shade.texture2D(Facet.texture_from_image({ src: "img/nehe.jpg" }),
                               cube.uv)
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
