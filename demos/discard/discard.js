var gl;
var cube_drawable;
var mv;
var proj;
var angle = 0;
var sampler = [];
var cube_model;
var Models = Lux.Models;

//////////////////////////////////////////////////////////////////////////////

function create_cube_drawable(opts)
{
    var b = cube_model.tex_coord.fract().lessThanEqual(Shade.vec(0.5, 0.5));
    var t = b.at(0).xor(b.at(1));
    var material_color = t.ifelse(Shade.texture2D(sampler[0], cube_model.tex_coord),
                                  Shade.texture2D(sampler[1], cube_model.tex_coord));
    var mvp = proj.mul(mv);
    var brightness = material_color.dot(Shade.vec(1/3,1/3,1/3,0));
    Shade.debug = true;
    return Lux.bake(cube_model, {
        position: mvp.mul(Shade.vec(cube_model.vertex, 1)),
        color: material_color.discard_if(brightness.gt(0.3))
    });
}

function draw_it()
{
    var model_cube = Lux.rotation(angle * (Math.PI / 180),[1,1,1]);
    var view       = Lux.translation(0.0, 0.0, -6.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    mv.set(mat4.product(view, model_cube));
    proj.set(Lux.perspective(45, 720/480, 0.1, 100.0));
    cube_drawable.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Lux.init(canvas,
                     {
                         clearDepth: 1.0,
                         clearColor: [0,0,0,0.1],
                         display: draw_it,
                         attributes:
                         {
                             alpha: true,
                             depth: true
                         }
                     });

    cube_model = Models.flat_cube();
    mv = Shade.parameter("mat4");
    proj = Shade.parameter("mat4");

    sampler[0] = Shade.parameter(
        "sampler2D", Lux.texture({ src: "../img/glass.jpg", onload: function() { gl.display(); } }));
    sampler[1] = Shade.parameter(
        "sampler2D", Lux.texture({ src: "../img/crate.jpg", onload: function() { gl.display(); } }));

    cube_drawable = create_cube_drawable();

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle = elapsed / 20;
        gl.display();
    };
    f();
});
