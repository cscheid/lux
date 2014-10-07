$().ready(function () {
    Lux.init({
        clearColor: [0,0,0,0.2]
    });
    var camera = Shade.Camera.perspective();

    var square = Lux.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    });
    Lux.Scene.add(Lux.actor({
        model: square, 
        appearance: {
            position: camera(Shade.translation( 1.5, 0, -6)(square.vertex)),
            color: Shade.color('#88f')
        }}));

    var triangle = Lux.model({
        type: "triangles",
        elements: [0, 1, 2],
        vertex: [[0,1, -1,-1, 1,-1], 2],
        color: [[1,0,0,1, 0,0.5,0,1, 0,0,1,1], 4]
    });
    Lux.Scene.add(Lux.actor({
        model: triangle, 
        appearance: {
            position: camera(Shade.translation(-1.5, 0, -6)(triangle.vertex)),
            color: triangle.color
        }}));
});
