var angle;

function create_cube_batch(opts)
{
    var ready = false;
    var model = Lux.Models.flat_cube();
    var texture = Lux.texture({ 
        src: "../img/glass.jpg",
        onload: function() { 
            ready = true;
        }
    });
    var material_color = Shade.texture2D(texture, model.tex_coord);
    var final_color;
    var model_mat = Shade.rotation(angle, Shade.vec(1,1,1));

    if (opts.lighting) {
        final_color = Shade.gl_light({
            light_position: Shade.vec(0, 0, 2),
            material_color: material_color,
            light_ambient: Shade.vec(0.3, 0.3, 0.3, 1),
            light_diffuse: Shade.color('white'),
            per_vertex: opts.per_vertex,
            vertex: model_mat(model.vertex),
            normal: model_mat(model.normal)
        });
    } else {
        final_color = material_color;
    }
    final_color = Shade.vec(final_color.swizzle("rgb"), 0.5);

    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)]
    });
    
    return Lux.conditional_batch(
        Lux.bake(model, {
            position: camera(model_mat(model.vertex)),
            color: final_color,
            mode: Lux.DrawingMode.additive
        }), 
        function() { return texture.ready; });
}

$().ready(function () {
    var gl = Lux.init({
        clearColor: [0,0,0,0.2]
    });

    angle = gl.parameters.now.mul(50).radians();

    Lux.Scene.add(create_cube_batch({ lighting: true, per_vertex: true }));
    Lux.Scene.animate();
});
