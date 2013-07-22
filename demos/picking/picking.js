var gl;
var cube, pyramid;
var angle;

//////////////////////////////////////////////////////////////////////////////

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Shade.Camera.perspective({
        look_at: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 0.1,
        far_distance: 100
    });
    angle = Shade.parameter("float");
    var strings = ["Nothing",
                   "Green Face", "Orange Face",
                   "Red Face", "Yellow Face",
                   "Blue Face", "Violet Face",
                   "Pyramid"];
    gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        attributes: {
            alpha: true,
            depth: true,
            preserveDrawingBuffer: true
        },
        mousedown: function(event) {
            Lux.Picker.draw_pick_scene();
            var r = Lux.Picker.pick(event.luxX, event.luxY);
            $("#pickresult").html(strings[r]);
        }
    });

    var g = Shade.color('green'),
        r = Shade.color('red'),
        o = Shade.color('orange'),
        y = Shade.color('yellow'),
        b = Shade.color('blue'),
        v = Shade.color('violet');

    // because we're making flat-shaded faces, we need separate
    // vertices for each "side" of the corner. So, even though there's
    // only 8 vertices in a cube, we end up with 24 of them, since we
    // need three colors per corner.

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

    // one id per face of the cube
    var ids = Lux.id_buffer([1,1,1,1,2,2,2,2,3,3,3,3,
                             4,4,4,4,5,5,5,5,6,6,6,6]);

    var cube_xformed_vertex = Shade.translation(Shade.vec(1.5, 0, 0))
        .mul(Shade.rotation(angle, Shade.vec(1,1,1)))
        .mul(cube_model.vertex);

    var pyramid_xformed_vertex = Shade.translation(Shade.vec(-1.5, 0, 0))
        .mul(Shade.rotation(angle, Shade.vec(0,1,0)))
        .mul(pyramid_model.vertex);

    cube = Lux.actor({
        model: cube_model, 
        appearance: {
            position: camera(cube_xformed_vertex),
            color: cube_model.color,
            pick_id: ids }});

    pyramid = Lux.actor({
        model: pyramid_model, 
        appearance: {
            position: camera(pyramid_xformed_vertex),
            color: pyramid_model.color,
            pick_id: Shade.id(7)}});

    Lux.Scene.add(cube);
    Lux.Scene.add(pyramid);

    var start = new Date().getTime();
    Lux.Scene.animate(function() {
        var elapsed = new Date().getTime() - start;
        angle.set((elapsed / 20) * (Math.PI / 180));
    });
});
