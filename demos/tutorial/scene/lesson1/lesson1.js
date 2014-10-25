$().ready(function () {
    Lux.init({ clearColor: [0, 0, 0, 0.2] });

    var squareModel = Lux.model({
        type: "triangles",
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2],
        elements: [0, 1, 2, 0, 2, 3]
    }), triangleModel = Lux.model({
        type: "triangles",
        vertex: [[0,1, -1,-1, 1,-1], 2],
        elements: 3
    });

    var camera = Shade.Camera.perspective();
    var cameraScene = Lux.scene({
        transform: Lux.Transform.change("position", function(v) { return camera(v); })
    });
    Lux.Scene.add(cameraScene);

    var squarePosition = Shade.translation( 1.5, 0, -6)(squareModel.vertex);
    var trianglePosition = Shade.translation(-1.5, 0, -6)(triangleModel.vertex);

    var square   = Lux.actor({ model: squareModel, 
                               appearance: { position: squarePosition }}),
        triangle = Lux.actor({ model: triangleModel, 
                               appearance: { position: trianglePosition }});

    cameraScene.add(square);
    cameraScene.add(triangle);
});
