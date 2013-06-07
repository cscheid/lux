$().ready(function () {
    var gl = Lux.init({
        clearColor: [0,0,0,0.2]
    });

    var g = Shade.color('green'),
        r = Shade.color('red'),
        o = Shade.color('orange'),
        y = Shade.color('yellow'),
        b = Shade.color('blue'),
        v = Shade.color('violet');

    // because we're making flat-shaded faces, we need separate
    // vertices for each "side" of the corner. So, even though there's
    // only 8 vertices in a cube, we end up with 24 vertices in the
    // model, since we need three colors per corner.

    var cube_model = Lux.model({
        type: "triangles",
        elements: [0,  1,  2,  0,  2,  3,
                   4,  5,  6,  4,  6,  7,
                   8,  9,  10, 8,  10, 11,
                   12, 13, 14, 12, 14, 15,
                   16, 17, 18, 16, 18, 19,
                   20, 21, 22, 20, 22, 23],
        vertex: [[ 1, 1,-1, -1, 1,-1, -1, 1, 1,  1, 1, 1,
                   1,-1, 1, -1,-1, 1, -1,-1,-1,  1,-1,-1,
                   1, 1, 1, -1, 1, 1, -1,-1, 1,  1,-1, 1,
                   1,-1,-1, -1,-1,-1, -1, 1,-1,  1, 1,-1,
                  -1, 1, 1, -1, 1,-1, -1,-1,-1, -1,-1, 1,
                   1, 1,-1,  1, 1, 1,  1,-1, 1,  1,-1,-1], 3],
        color: [g, g, g, g, o, o, o, o, r, r, r, r,
                y, y, y, y, b, b, b, b, v, v, v, v]
    });

    // For the pyramid, however, each vertex has only one color 
    // associated with it, so we can reuse the information.

    var pyramid_model = Lux.model({
        type: "triangles",
        elements: [0, 1, 2,
                   0, 2, 3,
                   0, 3, 4,
                   0, 4, 1],
        vertex: [[ 0,  1,  0, 
                  -1, -1,  1, 
                  -1, -1, -1,
                   1, -1, -1,
                   1, -1,  1], 3],
        color: [r, g, b, g, b]
    });

    var camera = Shade.Camera.perspective();
    // rotate the objects at 50 degrees/second.
    var angle = gl.parameters.now.mul(50).radians();

    var cube_xformed_vertex = Shade.translation(1.5, 0, -6)
        (Shade.rotation(angle, Shade.vec(1,1,1)))
        (cube_model.vertex);

    var pyramid_xformed_vertex = Shade.translation(-1.5, 0, -6)
        (Shade.rotation(angle, Shade.vec(0,1,0)))
        (pyramid_model.vertex);

    Lux.Scene.add(Lux.actor({
        model: cube_model, 
        appearance: {
            position: camera(cube_xformed_vertex),
            color: cube_model.color
        }}));
    Lux.Scene.add(Lux.actor({
        model: pyramid_model, 
        appearance: {
            position: camera(pyramid_xformed_vertex),
            color: pyramid_model.color
        }}));

    // Start scene animation
    Lux.Scene.animate();
});
