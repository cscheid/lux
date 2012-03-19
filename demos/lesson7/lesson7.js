var angle;
var texture = [];
var sampler;

function create_cube_batch(opts)
{
    opts = opts || {};
    var model = Facet.Models.flat_cube();
    var material_color = Shade.texture2D(sampler, model.tex_coord);
    var final_color;
    var model_mat = Shade.rotation(angle, Shade.vec(1, 1, 1));
    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)]
    });
 
    if (opts.lighting) {
        // Shade.gl_light replicates basic OpenGL lighting on a shader
        // 
        // http://glprogramming.com/red/chapter05.html, section
        //  "The Mathematics of Lighting"
        //
        final_color = Shade.gl_light({
            light_position: Shade.vec(0, 0, 2),
            material_color: material_color,
            light_ambient: Shade.vec(0.1, 0.1, 0.1, 1.0),
            light_diffuse: Shade.color('white'),
            per_vertex: opts.per_vertex,
            vertex: model_mat(model.vertex),
            normal: model_mat(model.normal)
        });
    } else {
        final_color = material_color;
    }

    return Facet.bake(model, {
        position: camera(model_mat(model.vertex)),
        color: final_color
    });
}

$().ready(function () {
    var gl = Facet.init(document.getElementById("webgl"), {
        clearColor: [0,0,0,0.2]
    });

    var cube_model = Facet.Models.flat_cube();

    $("#linear").click (function() { sampler.set(texture[0]); });
    $("#nearest").click(function() { sampler.set(texture[1]); });
    $("#mipmap").click (function() { sampler.set(texture[2]); });
    $("#per_vertex").click(function(obj) {
        Facet.Scene.remove(cube_batch[false]);
        Facet.Scene.remove(cube_batch[true]);
        Facet.Scene.add(cube_batch[$(this).is(":checked")]);
    });

    angle = Shade.parameter("float");

    texture[0] = Facet.texture({ 
        src: "../img/crate.jpg",
        mag_filter: gl.LINEAR,
        min_filter: gl.LINEAR
    });
    texture[1] = Facet.texture({ 
        src: "../img/crate.jpg",
        mag_filter: gl.NEAREST,
        min_filter: gl.NEAREST
    });
    texture[2] = Facet.texture({ 
        src: "../img/crate.jpg",
        mag_filter: gl.LINEAR,
        min_filter: gl.LINEAR_MIPMAP_NEAREST,
        mipmaps: true
    });
    sampler = Shade.parameter("sampler2D", texture[0]);

    var cube_batch_per_vertex   = create_cube_batch({ lighting: true, per_vertex: true });
    var cube_batch_per_fragment = create_cube_batch({ lighting: true, per_vertex: false });
    var cube_batch = {
        false: cube_batch_per_fragment,
        true: cube_batch_per_vertex
    };
    Facet.Scene.add(cube_batch_per_vertex);

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f);
        var elapsed = new Date().getTime() - start;
        angle.set((elapsed / 20) * (Math.PI/180));
        gl.display();
    };
    f();
});
