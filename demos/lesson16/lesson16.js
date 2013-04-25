/*
 * FIXME THIS LESSON USES REALLY ANCIENT LUX STYLE
 * 
 * It works, but it reflects in no way how you should write Lux code.
 */

var gl;
var cube_drawable, pyramid_drawable;
var mv;
var proj;
var angle = 0;
var cube_model;
var light_ambient = Shade.color('gray');
var light_diffuse = Shade.color('white');
var light_position = Shade.vec(0, 0, 2);
var Models = Lux.Models;

var mat_ambient = Shade.vec(0.2, 0.2, 0.2, 1);
var background_color = Shade.vec(0.5, 0.5, 0.5, 1).mul(0.5);

//////////////////////////////////////////////////////////////////////////////

function make_fogger(kind)
{
    if (kind === "linear") {
        return function(color, eye_vertex) {
            return Shade.gl_fog({ 
                z: eye_vertex.at(2),
                start: -4,
                end: -7,
                mode: "linear",
                fog_color: background_color,
                color: color
            });
        };
    } else if (kind === "exp") {
        return function(color, eye_vertex) {
            return Shade.gl_fog({
                z: eye_vertex.at(2),
                start: -5,
                mode: "exp",
                fog_color: background_color,
                color: color
            });
        };
    } else if (kind === "exp2") {
        return function(color, eye_vertex) {
            return Shade.gl_fog({ 
                z: eye_vertex.at(2),
                start: -4,
                density: 1,
                mode: "exp2",
                fog_color: background_color,
                color: color
            });
        };
    } else throw "Unknown fog kind";
};

function create_cube_drawable(opts)
{
    var material_color = Shade.texture2D(Lux.texture({ 
        src: "../img/crate.jpg",
        mag_filter: gl.LINEAR,
        min_filter: gl.LINEAR_MIPMAP_NEAREST,
        mipmaps: true
    }), cube_model.tex_coord);

    opts = _.defaults(opts, { 
        lighting: false,
        fogger: function (c, e) { return c; } 
    });

    var final_color;
    if (opts.lighting) {
        var mat3 = Shade.mat3(mv);
        final_color = Shade.gl_light({
            light_position: light_position,
            vertex: mat3.mul(cube_model.vertex),
            material_color: material_color,
            light_ambient: light_ambient,
            light_diffuse: light_diffuse,
            normal: mat3.mul(cube_model.normal.normalize())
        });
    } else {
        final_color = material_color;
    }

    var mvp = proj.mul(mv);
    var eye_vertex = mv.mul(Shade.vec(cube_model.vertex, 1));
    return Lux.bake(cube_model, {
        position: proj.mul(eye_vertex),
        color: opts.fogger(final_color, eye_vertex)
    });
}

function draw_it()
{
    var model_cube = Lux.rotation(angle, [1,1,1]);
    var view       = Lux.translation(0.0, 0.0, -6.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    mv.set(mat4.product(view, model_cube));
    proj.set(Lux.perspective(45, 720/480, 0.1, 100.0));
    cube_drawable.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Lux.init({
        clearDepth: 1.0,
        clearColor: background_color,
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        }
    });
    cube_model = Models.flat_cube();

    mv = Shade.parameter("mat4");
    proj = Shade.parameter("mat4");

    cube_drawable = create_cube_drawable({ lighting: true,
                                           fogger: make_fogger("linear")
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
