function actors(texture)
{
    var gl = Lux._globals.ctx;
    var angle = gl.parameters.now.mul(50).radians();
    var model = Lux.Models.flatCube();
    var materialColor = Shade.texture2D(texture, model.texCoord);
    var lightModelMat = Shade.rotation(angle, Shade.vec(1, 1, 1));
    var cubeModelMat = Shade.rotation(angle.div(-5), Shade.vec(1, 1, 0));

    var lightPosition = lightModelMat(Shade.vec(0, 0, 2));

    var ambientParameter = Shade.parameter("float", 0.3);
    var ambientLight = Shade.Light.ambient({ 
        color: Shade.vec(1,1,1).mul(ambientParameter)
    });

    var diffuseParameter = Shade.parameter("float", 1);
    var diffuseLightColor = Shade.vec(1,1,1).mul(diffuseParameter);
    var diffuseLight = Shade.Light.diffuse({
        position: lightPosition,
        color: diffuseLightColor
    });

    Lux.UI.parameterSlider({
        parameter: ambientParameter,
        element: "#ambient",
        min: 0,
        max: 1
    });
    Lux.UI.parameterSlider({
        parameter: diffuseParameter,
        element: "#diffuse",
        min: 0,
        max: 1
    });

    var materialOpts = {
        color: materialColor,
        position: cubeModelMat(model.vertex),
        normal: cubeModelMat(model.normal)
    };

    var sphere = Lux.Models.sphere();

    return [
        Lux.actor({
            model: model, 
            appearance: {
                position: cubeModelMat(model.vertex),
                color: ambientLight(materialOpts)
                    .add(diffuseLight(materialOpts))
            }}),
        // draw a little flying lamp to make it somewhat more obvious where the light is coming from
        Lux.actor({
            model: sphere, 
            appearance: {
                position: Shade.translation(lightPosition.swizzle("xyz"))
                (Shade.scaling(0.05))
                (sphere.vertex),
                color: Shade.vec(diffuseLightColor, 1)
            }})];
}

$().ready(function () {
    var gl = Lux.init({
        clearColor: [0,0,0,0.2]
    });

    var cubeModel = Lux.Models.flatCube();

    Lux.texture({ 
        src: "../../img/crate.jpg",
        onload: function() {
            var camera = Lux.Scene.Transform.Camera.perspective({
                lookAt: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)]
            });
            Lux.Scene.add(camera);
            _.each(actors(this), function(actor) { camera.add(actor); });
            Lux.Scene.animate();
        }
    });
});
