$().ready(function () {
    var gl = Lux.init(document.getElementById("webgl"), {
        clearColor: [0,0,0,0.2]
    });
    var camera = Shade.Camera.perspective();

    var square = Lux.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    });
    Lux.Scene.add(Lux.bake(square, {
        position: camera(Shade.translation( 1.5, 0, -6)(square.vertex)),
        color: Shade.color('#88f')
    }));

    var triangle = Lux.model({
        type: "triangles",
        elements: [0, 1, 2],
        vertex: [[0,1, -1,-1, 1,-1], 2],
        color: [[1,0,0,1, 0,0.5,0,1, 0,0,1,1], 4]
        // color: [Shade.color('red'),
        //         Shade.color('green'),
        //         Shade.color('blue')]
    });


    Lux.Scene.add(Lux.bake(triangle, {
        position: camera(Shade.translation(-1.5, 0, -6)(triangle.vertex)),
        color: triangle.color
    }));
});
