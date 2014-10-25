var angle;

function createCubeBatch(opts)
{
    var ready = false;
    var model = Lux.Models.flatCube();
    var texture = Lux.texture({ 
        src: "../img/glass.jpg",
        onload: function() { 
            ready = true;
        }
    });
    var materialColor = Shade.texture2D(texture, model.texCoord);
    var finalColor;
    var modelMat = Shade.rotation(angle, Shade.vec(1,1,1));

    if (opts.lighting) {
        finalColor = Shade.glLight({
            lightPosition: Shade.vec(0, 0, 2),
            materialColor: materialColor,
            lightAmbient: Shade.vec(0.3, 0.3, 0.3, 1),
            lightDiffuse: Shade.color('white'),
            perVertex: opts.perVertex,
            vertex: modelMat(model.vertex),
            normal: modelMat(model.normal)
        });
    } else {
        finalColor = materialColor;
    }
    finalColor = Shade.vec(finalColor.swizzle("rgb"), 0.5);

    var camera = Shade.Camera.perspective({
        lookAt: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)]
    });
    
    return Lux.conditionalBatch(
        Lux.bake(model, {
            position: camera(modelMat(model.vertex)),
            color: finalColor,
            mode: Lux.DrawingMode.additive
        }), 
        function() { return texture.ready; });
}

$().ready(function () {
    var gl = Lux.init({
        clearColor: [0,0,0,0.2]
    });

    angle = gl.parameters.now.mul(50).radians();

    Lux.Scene.add(createCubeBatch({ lighting: true, perVertex: true }));
    Lux.Scene.animate();
});
