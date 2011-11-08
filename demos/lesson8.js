var gl;
var cube_drawable, pyramid_drawable;
var mv;
var proj;
var angle = 0;
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

function create_cube_drawable(opts)
{
    var material_color = Shade.texture2D(sampler, cube_model.tex_coord);
    var final_color;
    opts = opts || {};

    if (opts.lighting) {
        // replicate OpenGL lighting on a shader
        // 
        // http://glprogramming.com/red/chapter05.html, section
        //  "The Mathematics of Lighting"
        //
        var mat3 = Shade.mat3(mv);

        final_color = Shade.gl_light({
            light_position: light_position,
            vertex: mat3.mul(cube_model.vertex),
            material_color: material_color,
            light_ambient: light_ambient,
            light_diffuse: light_diffuse,
            per_vertex: opts.per_vertex,
            normal: mat3.mul(cube_model.normal.normalize())
        });
    } else {
        final_color = material_color;
    }
    final_color = Shade.vec(final_color.swizzle("rgb"),
                            0.5);
    var mvp = proj.mul(mv);
    return Facet.bake(cube_model, {
        position: mvp.mul(Shade.vec(cube_model.vertex, 1)),
        color: final_color,
        mode: Facet.DrawingMode.additive
    });
}

function draw_it()
{
    var model_cube = Facet.rotation(angle, [1,1,1]);
    var view       = Facet.translation(0.0, 0.0, -6.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    mv.set(mat4.product(view, model_cube));
    proj.set(Facet.perspective(45, 720/480, 0.1, 100.0));
    cube_drawable.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    $("#linear").click(function() { sampler.set(texture[0]); });
    $("#nearest").click(function() { sampler.set(texture[1]); });
    $("#mipmap").click(function() { sampler.set(texture[2]); });
    $("#per_vertex").click(function(obj) {
        var thisCheck = $(this);
        cube_drawable = create_cube_drawable({ lighting: true,
                                               per_vertex: thisCheck.is(":checked") });
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
                        },
                        debugging: true
                    });
    // because we're making faces with different textures on each
    // corner, we need separate
    // vertices for each "side" of the corner. So, even though there's
    // only 8 vertices in a cube, we end up with 24 of them, since we
    // need three different texture coordinates per corner.

    cube_model = Models.flat_cube();

    mv = Shade.uniform("mat4");
    proj = Shade.uniform("mat4");

    texture[0] = Facet.texture({ 
        src: "img/glass.jpg",
        TEXTURE_MAG_FILTER: gl.LINEAR,
        TEXTURE_MIN_FILTER: gl.LINEAR
    });
    texture[1] = Facet.texture({ 
        src: "img/glass.jpg",
        TEXTURE_MAG_FILTER: gl.NEAREST,
        TEXTURE_MIN_FILTER: gl.NEAREST
    });
    texture[2] = Facet.texture({ 
        src: "img/glass.jpg",
        TEXTURE_MAG_FILTER: gl.LINEAR,
        TEXTURE_MIN_FILTER: gl.LINEAR_MIPMAP_NEAREST,
        mipmaps: true
    });
    sampler = Shade.uniform("sampler2D");
    sampler.set(texture[0]);

    cube_drawable = create_cube_drawable({ lighting: true,
                                           per_vertex: true });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle = (elapsed / 20) * (Math.PI/180);
        gl.display();
    };
    f();
});
