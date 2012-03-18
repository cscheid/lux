var angle;

function create_cube_batch(opts)
{
    var model = Facet.Models.flat_cube();
    var material_color = Shade.texture2D(
        Facet.texture({ src: "../img/glass.jpg" }), 
        model.tex_coord);
    var final_color;
    var model_mat = Shade.rotation(angle, Shade.vec(1,1,1));

    if (opts.lighting) {
        final_color = Shade.gl_light({
            light_position: Shade.vec(0, 0, 2),
            material_color: material_color,
            light_ambient: Shade.vec(0.3, 0.3, 0.3, 1),
            light_diffuse: Shade.color('white'),
            per_vertex: opts.per_vertex,
            vertex: model_mat.mul(model.vertex),
            normal: model_mat.mul(model.normal)
        });
    } else {
        final_color = material_color;
    }
    final_color = Shade.vec(final_color.swizzle("rgb"), 0.5);

    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)],
        aspect_ratio: 720/480
    });
    
    return Facet.bake(model, {
        position: camera(model_mat.mul(model.vertex)),
        color: final_color,
        mode: Facet.DrawingMode.additive
    });
}

$().ready(function () {
    var gl = Facet.init(document.getElementById("webgl"), {
        clearColor: [0,0,0,0.2]
    });

    angle = Shade.parameter("float", 0);

    Facet.Scene.add(create_cube_batch({ lighting: true, per_vertex: true }));

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f);
        var elapsed = new Date().getTime() - start;
        angle.set((elapsed / 20) * (Math.PI/180));
        gl.display();
    };
    f();
});
