$().ready(function () {
    var gl = Facet.init(document.getElementById("webgl"), {
        clearColor: [0,0,0,0.2]
    });
    var camera = Shade.Camera.perspective();

    var square = Facet.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    });
    Facet.Scene.add(Facet.bake(square, {
        position: camera(Shade.translation( 1.5, 0, -6)(square.vertex)),
        color: Shade.color('#88f')
    }));

    var triangle = Facet.model({
        type: "triangles",
        elements: [0, 1, 2],
        vertex: [[0,1, -1,-1, 1,-1], 2],
        color: [[1,0,0,1, 0,0.5,0,1, 0,0,1,1], 4]
        // color: [Shade.color('red'),
        //         Shade.color('green'),
        //         Shade.color('blue')]
    });


    Facet.Scene.add(Facet.bake(triangle, {
        position: camera(Shade.translation(-1.5, 0, -6)(triangle.vertex)),
        color: triangle.color
    }));
});
