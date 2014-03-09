$().ready(function() {
    var gl = Lux.init({ 
        clearColor: [0,0,0,1],
        fullSize: true
    });
    var angle = gl.parameters.now.mul(-80).radians();
    var sphere = Lux.Models.sphere(128, 128);

    // this is not entirely accurate, but it's probably close enough.
    var eccentricity_libration = angle.cos().mul(0.05);

    var camera = Lux.Scene.Transform.Camera.ortho({
        near: -10, far: 10,
        zoom: Shade(0.8).add(eccentricity_libration)
    });

    Lux.Scene.add(camera);

    var user_latitude = Shade.parameter("float", 85);
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(function(position) {
            user_latitude.set(position.coords.latitude);
        });
    var latitude_rot = Shade.rotation(Shade(270).add(user_latitude).radians(), Shade.vec(0,0,1));
    var light_pos = Shade.rotation(angle, latitude_rot(Shade.vec(0,1,0)))(latitude_rot)(Shade.vec(2,0,15)).swizzle("xyz");

    var ambient_light = Shade.Light.ambient({
        color: Shade.vec(0.659, 0.659, 0.659, 1)
    });

    var diffuse_light = Shade.Light.diffuse({
        color: Shade.vec(0.5, 0.5, 0.5, 1),
        position: light_pos.append(1)
    });

    var latitude_libration = angle.cos().neg().mul(Shade(6.69).radians());
    var longitude_libration = angle.sin().mul(Shade(8.16).radians());
    var model_mat = 
        (Shade.rotation(longitude_libration, Shade.vec(0,1,0)))
        (Shade.rotation(Shade(6.1575).add(latitude_libration), Shade.vec(1,0,0)))
        (latitude_rot);

    var uv       = sphere.tex_coord.swizzle("yx");
    var pos      = model_mat(sphere.vertex);
    var surfnorm = model_mat(sphere.normal).swizzle("xyz");

    Promise.all([Lux.Promises.texture({
        src: "/lux/demos/img/moon_2048.jpg",
        max_anisotropy: 16
    }), Lux.Promises.texture({
        src: "/lux/demos/img/moon_bump_2048.jpg",
        max_anisotropy: 16
    })]).spread(function(moon, moon_bump) {
        var bumpnorm = Shade.ThreeD.bump({
            uv: uv,
            map: moon_bump,
            scale: 0.01, // bump_scale_parameter.exp(),
            position: pos.swizzle("xyz"),
            normal: surfnorm
        });

        var material = { 
            position: pos,
            normal: bumpnorm,
            color: Shade.texture2D(moon, uv).x().pow(0.7).mul(Shade.vec(1,1,1)).append(1)
        };

        camera.add(Lux.actor({ 
            model: sphere, 
            appearance: {
                position: pos,
                color: Shade.ifelse(
                    surfnorm.normalize().dot(light_pos.normalize()).gt(0),
                    ambient_light(material)
                        .add(diffuse_light(material)),
                    ambient_light(material).swizzle("xyz").mul(Shade.vec(0.2,0.18,0.15)).append(1))
            }
        }));

        Lux.Scene.animate();
    });
});
