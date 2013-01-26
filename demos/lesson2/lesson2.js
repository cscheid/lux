$().ready(function () {
    var gl = Facet.init(document.getElementById("webgl"), {
        clearColor: [0, 0, 0, 0.2]
    });

    var square_model = Facet.model({
        type: "triangles",
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2],
        elements: [0, 1, 2, 0, 2, 3]
    }), triangle_model = Facet.model({
        type: "triangles",
        vertex: [[0,1, -1,-1, 1,-1], 2],
        elements: 3
    });

    var camera = Shade.Camera.perspective();
    var square_position = camera(Shade.translation( 1.5, 0, -6)(square_model.vertex));
    var triangle_position = camera(Shade.translation(-1.5, 0, -6)(triangle_model.vertex));

    var square = Facet.bake(square_model, {
        position: square_position
    }), triangle = Facet.bake(triangle_model, {
        position: triangle_position
    });

    Facet.Scene.add(square);
    Facet.Scene.add(triangle);
});
