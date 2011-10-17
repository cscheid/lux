var gl;
var cube_drawable, pyramid_drawable;
var mvp;
var phase = 0;

var current_mouse_x = 0;
var current_mouse_y = 0;

//////////////////////////////////////////////////////////////////////////////

var model = mat4.product(Facet.translation(0.0, 0.0, -4.0),
                         Facet.rotation(-40 * Math.PI / 180, [1, 0, 0]));

function draw_it()
{
    var proj = Facet.perspective(45, 720/480, 0.1, 100.0);
    var view = mat4.lookAt([current_mouse_x, current_mouse_y, 0], 
                           [0, 0, -3], [0,1,0]);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    mvp.set(mat4.product(proj, mat4.product(view, model)));
    cube_drawable.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Facet.initGL(canvas,
                      {
                          clearDepth: 1.0,
                          clearColor: [0,0,0,1],
                          display: draw_it,
                          attributes:
                          {
                              alpha: true,
                              depth: true
                          },
                          mousemove: function(event) {
                              current_mouse_x = (event.offsetX / 720) - 0.5;
                              current_mouse_y = (event.offsetY / 480) - 0.5;
                          }
                      });

    var flag = Models.mesh(50, 2);

    mvp = Shade.uniform("mat4");
    phase = Shade.uniform("float");

    cube_drawable = Facet.bake(flag, {
        position: mvp.mul(Shade.vec(flag.vertex, Shade.sin(flag.uv.at(0).mul(20).add(phase)).mul(0.08), 1)),
        color: Shade.texture2D(Facet.texture_from_image({ src: "img/sunflower.jpg" }),
                               flag.uv)
    });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        phase.set((elapsed / 3) * (Math.PI/180));
        gl.display();
    };
    f();
});
