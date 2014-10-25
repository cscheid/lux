$().ready(function() {
    var gl = Lux.init({ 
        clearColor: [0,0,0,1],
        fullSize: true
    });
    var angle = gl.parameters.now.mul(-80).radians();
    var sphere = Lux.Models.sphere(128, 128);

    // this is not entirely accurate, but it's probably close enough.
    var eccentricityLibration = angle.cos().mul(0.05);

    var camera = Lux.Scene.Transform.Camera.ortho({
        near: -10, far: 10,
        zoom: Shade(0.8).add(eccentricityLibration)
    });

    Lux.Scene.add(camera);

    var userLatitude = Shade.parameter("float", 85);
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(function(position) {
            userLatitude.set(position.coords.latitude);
        });
    var latitudeRot = Shade.rotation(Shade(270).add(userLatitude).radians(), Shade.vec(0,0,1));
    var lightPos = Shade.rotation(angle, latitudeRot(Shade.vec(0,1,0)))(latitudeRot)(Shade.vec(2,0,15)).swizzle("xyz");

    var ambientLight = Shade.Light.ambient({
        color: Shade.vec(0.659, 0.659, 0.659, 1)
    });

    var diffuseLight = Shade.Light.diffuse({
        color: Shade.vec(0.5, 0.5, 0.5, 1),
        position: lightPos.append(1)
    });

    var latitudeLibration = angle.cos().neg().mul(Shade(6.69).radians());
    var longitudeLibration = angle.sin().mul(Shade(8.16).radians());
    var modelMat = 
        (Shade.rotation(longitudeLibration, Shade.vec(0,1,0)))
        (Shade.rotation(Shade(6.1575).add(latitudeLibration), Shade.vec(1,0,0)))
        (latitudeRot);

    var uv       = sphere.texCoord.swizzle("yx");
    var pos      = modelMat(sphere.vertex);
    var surfnorm = modelMat(sphere.normal).swizzle("xyz");

    Promise.all([Lux.Promises.texture({
        src: "/lux/demos/img/moon_2048.jpg",
        maxAnisotropy: 16
    }), Lux.Promises.texture({
        src: "/lux/demos/img/moon_bump_2048.jpg",
        maxAnisotropy: 16
    })]).spread(function(moon, moonBump) {
        var bumpnorm = Shade.ThreeD.bump({
            uv: uv,
            map: moonBump,
            scale: 0.01,
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
                    surfnorm.dot(lightPos).gt(0),
                    Shade.add(ambientLight, diffuseLight)(material),
                    ambientLight(material).swizzle("xyz").mul(Shade.vec(0.2,0.18,0.15)).append(1))
            }
        }));

        Lux.Scene.animate();
    });
});
