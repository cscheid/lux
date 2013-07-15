$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 2, 20), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 0.1,
        far_distance: 100
    });
    var gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        attributes: {
            alpha: true,
            depth: true
        }
    });
    var angle = gl.parameters.now;
    var teapot_model = Lux.Models.teapot();

    var model_matrix = (Shade.rotation(0.3, Shade.vec(1,0,0)))(Shade.rotation(angle, Shade.vec(0,1,0)));
    var model_vertex = model_matrix.mul(teapot_model.vertex);

    var material = { 
        position: model_vertex,
        normal: Shade.ThreeD.normal(model_vertex), // model_matrix(teapot_model.normal)
        color: Shade.color("white")
    };

    var ambient_light = Shade.Light.ambient({ 
        color: Shade.vec(0.1, 0.1, 0.1) 
    });
    var diffuse_light = Shade.Light.diffuse({
        color: Shade.color("white"),
        position: Shade.vec(5,5,10)
    });

    Lux.Scene.add(Lux.actor({
        model: teapot_model, 
        appearance: {
            position: camera(model_vertex),
            color: diffuse_light(material).add(ambient_light(material))
        }}));

    Lux.Scene.animate();
});
