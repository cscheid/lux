$().ready(function () {
    Lux.init({ clearColor: [0, 0, 0, 0.2] });

    var n_points = 64;
    var x_array = new Float32Array(n_points);
    var y_array_1 = new Float32Array(n_points);
    var y_array_2 = new Float32Array(n_points);
    for (var i=0; i<n_points; ++i) {
        x_array[i] = i;
        y_array_1[i] = Math.random();
        y_array_2[i] = Math.random();
    }

    var x_buffer = Lux.attribute_buffer({
        item_size: 1,
        vertex_array: x_array
    });
    var y_buffer_1 = Lux.attribute_buffer({
        item_size: 1,
        vertex_array: y_array_1
    });
    var y_buffer_2 = Lux.attribute_buffer({
        item_size: 1,
        vertex_array: y_array_2
    });
    
    var scale = Shade.Scale.linear({
        domain: [Shade.vec(0, 0), Shade.vec(n_points, 1)],
        range: [Shade.vec(-0.95, -0.95), Shade.vec(0.95, 0.95)]
    });

    var y_t = Shade.Scale.linear({
        domain: [0, 1],
        range: [Shade(y_buffer_1), Shade(y_buffer_2)]
    });

    var transition_t = Shade.parameter("float", 0);
    var dots = Lux.Marks.dots({
        position: scale(Shade.vec(x_buffer, y_t(transition_t))),
        elements: n_points
    });

    Lux.Scene.add(dots);

    var t = 0;
    Lux.Scene.animate(function() {
        var t2 = Lux.now().get();
        if ((t2 - t) < 1) {
            transition_t.set(t2-t);
            return;
        }
        t = t2;
        transition_t.set(0);
        y_buffer_1.set(y_array_2);
        for (var i=0; i<n_points; ++i) {
            y_array_2[i] = Math.random();
        }
        y_buffer_2.set(y_array_2);
    });
});
