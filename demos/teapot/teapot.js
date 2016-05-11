$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Shade.Camera.perspective({
        lookAt: [Shade.vec(0, 2, 20), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)],
        fieldOfViewY: 45,
        aspectRatio: 720/480,
        nearDistance: 0.1,
        farDistance: 100
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
    var teapotModel = Lux.Models.teapot();

    var modelMatrix = (Shade.rotation(0.3, Shade.vec(1,0,0)))(Shade.rotation(angle, Shade.vec(0,1,0)));
    var modelVertex = modelMatrix.mul(teapotModel.vertex);

    var material = { 
        position: modelVertex,
        normal: Shade.ThreeD.normal(modelVertex), // modelMatrix(teapotModel.normal)
        color: Shade.color("white")
    };

    var ambientLight = Shade.Light.ambient({ 
        color: Shade.vec(0.1, 0.1, 0.1) 
    });
    var diffuseLight = Shade.Light.diffuse({
        color: Shade.color("white"),
        position: Shade.vec(5,5,10)
    });

    Lux.Scene.add(Lux.actor({
        model: teapotModel, 
        appearance: {
            position: camera(modelVertex),
            color: diffuseLight(material).add(ambientLight(material))
        }}));

    Lux.Scene.animate();
});
