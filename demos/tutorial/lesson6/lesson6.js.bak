function actors(texture)
{
    var gl = Lux._globals.ctx;
    var angle = gl.parameters.now.mul(50).radians();
    var model = Lux.Models.flat_cube();
    var material_color = Shade.texture2D(texture, model.tex_coord);
    var light_model_mat = Shade.rotation(angle, Shade.vec(1, 1, 1));
    var cube_model_mat = Shade.rotation(angle.div(-5), Shade.vec(1, 1, 0));

    var light_position = light_model_mat(Shade.vec(0, 0, 2));

    var ambient_parameter = Shade.parameter("float", 0.3);
    var ambient_light = Shade.Light.ambient({ 
        color: Shade.vec(1,1,1).mul(ambient_parameter)
    });

    var diffuse_parameter = Shade.parameter("float", 1);
    var diffuse_light_color = Shade.vec(1,1,1).mul(diffuse_parameter);
    var diffuse_light = Shade.Light.diffuse({
        position: light_position,
        color: diffuse_light_color
    });

    Lux.UI.parameter_slider({
        parameter: ambient_parameter,
        element: "#ambient",
        min: 0,
        max: 1
    });
    Lux.UI.parameter_slider({
        parameter: diffuse_parameter,
        element: "#diffuse",
        min: 0,
        max: 1
    });

    var material_opts = {
        color: material_color,
        position: cube_model_mat(model.vertex),
        normal: cube_model_mat(model.normal)
    };

    var sphere = Lux.Models.sphere();

    return [
        Lux.actor({
            model: model, 
            appearance: {
                position: cube_model_mat(model.vertex),
                color: ambient_light(material_opts)
                    .add(diffuse_light(material_opts))
            }}),
        // draw a little flying lamp to make it somewhat more obvious where the light is coming from
        Lux.actor({
            model: sphere, 
            appearance: {
                position: Shade.translation(light_position.swizzle("xyz"))
                (Shade.scaling(0.05))
                (sphere.vertex),
                color: Shade.vec(diffuse_light_color, 1)
            }})];
}

$().ready(function () {
    var gl = Lux.init({
        clearColor: [0,0,0,0.2]
    });

    var cube_model = Lux.Models.flat_cube();

    Lux.texture({ 
        src: "../../img/crate.jpg",
        onload: function() {
            var camera = Lux.Scene.Transform.Camera.perspective({
                look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)]
            });
            Lux.Scene.add(camera);
            _.each(actors(this), function(actor) { camera.add(actor); });
            Lux.Scene.animate();
        }
    });
});
