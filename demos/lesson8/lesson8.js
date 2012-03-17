var gl;
var cube_batch, pyramid_batch;
var mv;
var proj;
var angle;
var texture = [];
var sampler;
var current_texture;
var cube_model;
var light_ambient = Shade.color('gray');
var light_diffuse = Shade.color('white');
var light_position = Shade.vec(0, 0, 2);
var Models = Facet.Models;
var mat_ambient = Shade.vec(0.2, 0.2, 0.2, 1);

//////////////////////////////////////////////////////////////////////////////

function create_cube_batch(opts)
{
    var material_color = Shade.texture2D(sampler, cube_model.tex_coord);
    var final_color;
    opts = opts || {};
    var model_cube = Shade.rotation(angle, Shade.vec(1,1,1));
    var model_mat = model_cube;

    if (opts.lighting) {
        // replicate OpenGL lighting on a shader
        // 
        // http://glprogramming.com/red/chapter05.html, section
        //  "The Mathematics of Lighting"
        //
        final_color = Shade.gl_light({
            light_position: light_position,
            material_color: material_color,
            light_ambient: light_ambient,
            light_diffuse: light_diffuse,
            per_vertex: opts.per_vertex,
            vertex: model_mat.mul(opts.model.vertex),
            normal: model_mat.mul(opts.model.normal)
        });
    } else {
        final_color = material_color;
    }
    final_color = Shade.vec(final_color.swizzle("rgb"), 0.5);

    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 0.1,
        far_distance: 100
    });
    
    return Facet.bake(opts.model, {
        position: camera(model_mat.mul(opts.model.vertex)),
        color: final_color,
        mode: Facet.DrawingMode.additive
    });
}

function draw_it()
{
    cube_batch.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    $("#linear").click(function() { sampler.set(texture[0]); });
    $("#nearest").click(function() { sampler.set(texture[1]); });
    $("#mipmap").click(function() { sampler.set(texture[2]); });
    $("#per_vertex").click(function(obj) {
        var thisCheck = $(this);
        cube_batch = create_cube_batch({ lighting: true,
                                         model: cube_model,
                                         per_vertex: thisCheck.is(":checked")
                                       });
    });

    gl = Facet.init(canvas,
                    {
                        clearDepth: 1.0,
                        clearColor: [0,0,0,0.2],
                        display: draw_it,
                        attributes:
                        {
                            alpha: true,
                            depth: true
                        }
                    });
    // because we're making faces with different textures on each
    // corner, we need separate
    // vertices for each "side" of the corner. So, even though there's
    // only 8 vertices in a cube, we end up with 24 of them, since we
    // need three different texture coordinates per corner.

    cube_model = Models.flat_cube();

    texture[0] = Facet.texture({ 
        src: "../img/glass.jpg",
        mag_filter: gl.LINEAR,
        min_filter: gl.LINEAR
    });
    texture[1] = Facet.texture({ 
        src: "../img/glass.jpg",
        mag_filter: gl.NEAREST,
        min_filter: gl.NEAREST
    });
    texture[2] = Facet.texture({ 
        src: "../img/glass.jpg",
        mag_filter: gl.LINEAR,
        min_filter: gl.LINEAR_MIPMAP_NEAREST,
        mipmaps: true
    });
    angle = Shade.parameter("float", 0);
    sampler = Shade.parameter("sampler2D");
    sampler.set(texture[0]);

    cube_batch = create_cube_batch({ lighting: true,
                                     model: cube_model,
                                     per_vertex: true });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle.set((elapsed / 20) * (Math.PI/180));
        gl.display();
    };
    f();
});
