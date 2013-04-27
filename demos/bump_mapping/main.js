$().ready(function() {
    var gl = Lux.init({ clearColor: [0,0,0,1] });
    var angle = gl.parameters.now.mul(10).radians();
    var sphere = Lux.Models.sphere(128, 128);
    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0,0,6), Shade.vec(0,0,-1), Shade.vec(0,1,0)],
        field_of_view_y: 20
    });

    var ambient_light = Shade.Light.ambient({
        color: Shade.vec(0,0,0,1)
    });
    var diffuse_light = Shade.Light.diffuse({
        color: Shade.vec(1,1,1,1),
        light_position: Shade.vec(10,0,5,1)
    });

    var model_mat = Shade.rotation(angle, Shade.vec(0,1,0));
    var moon = Lux.texture({
        src: "../img/moon_1024.jpg",
        onload: function() {
            var uv          = sphere.tex_coord.swizzle("yx");
            var pos         = model_mat(sphere.vertex);
            var surfnorm    = model_mat(sphere.normal);
            var material = { 
                vertex: pos,
                normal: Shade.ThreeD.bump({
                    uv: uv,
                    map: this,
                    scale: 0.005,
                    position: pos.swizzle("xyz"),
                    normal: surfnorm.swizzle("xyz")
                }),
                material: Shade.texture2D(this, uv)
            };
            Lux.Scene.add(Lux.bake(sphere, {
                position: camera(pos),
                color: ambient_light(material).add(diffuse_light(material))
            }));
        }
    });

    Lux.Scene.animate();
});
