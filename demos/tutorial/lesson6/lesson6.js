var angle;
var texture = [];
var sampler;

function batches(opts)
{
    var model = Lux.Models.flat_cube();
    var material_color = Shade.texture2D(opts.texture, model.tex_coord);
    var light_model_mat = Shade.rotation(angle, Shade.vec(1, 1, 1));
    var cube_model_mat = Shade.rotation(angle.div(-5), Shade.vec(1, 1, 0));
    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)]
    });

    var light_position = light_model_mat(Shade.vec(0, 0, 2));

    var ambient_light = Shade.Light.ambient({ 
        color: Shade.vec(0.3, 0.3, 0.3)
    });

    var diffuse_light = Shade.Light.diffuse({
        light_position: light_position,
        color: Shade.color('white')
    });

    // draw a little flying lamp to make it somewhat more obvious where the light is coming from
    var sphere = Lux.Models.sphere();
    var lamp_batch = Lux.bake(sphere, {
        position: camera
                      (Shade.translation(light_position.swizzle("xyz")))
                      (Shade.scaling(0.1))
                      (sphere.vertex),
        color: Shade.color('white')
    });

    var material_opts = {
        material: material_color,
        vertex: cube_model_mat(model.vertex),
        normal: cube_model_mat(model.normal)
    };

    return [Lux.bake(model, {
        position: camera(cube_model_mat)(model.vertex),
        color: ambient_light(material_opts)
            .add(diffuse_light(material_opts))
    }), lamp_batch];
}

$().ready(function () {
    var gl = Lux.init({
        clearColor: [0,0,0,0.2]
    });

    var cube_model = Lux.Models.flat_cube();

    angle = gl.parameters.now.mul(50).radians();

    texture = Lux.texture({ 
        src: "../../img/crate.jpg",
        onload: function() {
            _.each(batches({ texture: this }), 
                   function(obj) {
                       Lux.Scene.add(obj);
                   });
            Lux.Scene.animate();
        }
    });
});
