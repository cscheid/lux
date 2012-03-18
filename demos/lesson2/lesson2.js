$().ready(function () {
    var gl = Facet.init(document.getElementById("webgl"), {
        clearColor: [0, 0, 0, 0.2]
    });

    var square_model = Facet.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    }), triangle_model = Facet.model({
        type: "triangles",
        elements: 3,
        vertex: [[0,1, -1,-1, 1,-1], 2]
    });

    var camera = Shade.Camera.perspective();

    var square = Facet.bake(square_model, {
        position: camera(Shade.translation(Shade.vec(1.5, 0, -6))
                         .mul(square_model.vertex))
    }), triangle = Facet.bake(triangle_model, {
        position: camera(Shade.translation(Shade.vec(-1.5, 0, -6))
                         .mul(triangle_model.vertex))
    });

    Facet.Scene.add(square);
    Facet.Scene.add(triangle);
});
