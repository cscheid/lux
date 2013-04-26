$().ready(function () {
    var ctx = Lux.init({
        clearColor: [0,0,0,0.2]
    });

    var square = Lux.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    });
    var triangle = Lux.model({
        type: "triangles",
        elements: [0, 1, 2],
        vertex: [[0,1, -1,-1, 1,-1], 2],
        color: [Shade.color('red'),
                Shade.color('green'),
                Shade.color('blue')]
    });

    var camera = Shade.Camera.perspective();
    // rotate the objects at 50 degrees/second.
    var now = ctx.parameters.now;
    var angle = now.mul(50).radians();

    Lux.Scene.add(Lux.bake(square, {
        position: camera(Shade.translation( 1.5, 0, -6))
                        (Shade.rotation(angle, Shade.vec(1, 0, 0)))
                        (square.vertex),
        color: Shade.color('#88f')
    }));
    Lux.Scene.add(Lux.bake(triangle, {
        position: camera(Shade.translation(-1.5, 0, -6))
                        (Shade.rotation(angle, Shade.vec(0, 1, 0)))
                        (triangle.vertex),
        color: triangle.color
    }));

    Lux.Scene.animate();
});
