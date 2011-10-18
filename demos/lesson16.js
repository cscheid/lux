var gl;
var cube_drawable, pyramid_drawable;
var mv;
var proj;
var angle = 0;
var cube_model;
var light_ambient = Shade.color('gray');
var light_diffuse = Shade.color('white');
var light_position = Shade.vec(0, 0, 2);

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
    var material_color = Shade.texture2D(Facet.texture_from_image({ 
        src: "img/crate.jpg",
        TEXTURE_MAG_FILTER: gl.LINEAR,
        TEXTURE_MIN_FILTER: gl.LINEAR_MIPMAP_NEAREST,
        mipmaps: true
    }), cube_model.uv);

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
    return Facet.bake(cube_model, {
        position: proj.mul(eye_vertex),
        color: opts.fogger(final_color, eye_vertex)
    });
}

function draw_it()
{
    var model_cube = Facet.rotation(angle, [1,1,1]);
    var view       = Facet.translation(0.0, 0.0, -6.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    mv.set(mat4.product(view, model_cube));
    proj.set(Facet.perspective(45, 720/480, 0.1, 100.0));
    cube_drawable.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Facet.initGL(canvas,
                      {
                          clearDepth: 1.0,
                          clearColor: background_color,
                          display: draw_it,
                          attributes:
                          {
                              alpha: true,
                              depth: true
                          },
                          debugging: true
                      });
    cube_model = Models.flat_cube();

    mv = Shade.uniform("mat4");
    proj = Shade.uniform("mat4");

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
