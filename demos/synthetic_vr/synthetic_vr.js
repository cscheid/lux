$().ready(function () {
    var gl = Lux.init({
        clearColor: [0, 0, 0, 1]
    });

    var square_model = Lux.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    });

    var camera = Shade.Camera.ortho();
    var vertex_pos = camera(square_model.vertex);
    var steps = Shade.range(0, 100);

    var angle_y = Shade.parameter("float", 0);
    var rotate_y = Shade.rotation(angle_y, Shade.vec(0,1,0));
    var rotate_x = Shade.rotation(Shade.radians(20), Shade.vec(1,0,0));

    var sample_positions = 
        steps.transform(function(i) { 
            var u = i.as_float().div(100);
            var origin = rotate_y(rotate_x(Shade.vec(square_model.vertex, -1).mul(1.5)));
            var dest   = rotate_y(rotate_x(Shade.vec(square_model.vertex,  1).mul(1.5)));
            return Shade.mix(origin, dest, u);
        });

    var volume_samples =
        sample_positions.transform(function(v) {
            var vx = v.x(), vy = v.y(), vz = v.z();
            var vx2 = vx.mul(vx);
            var vy2 = vy.mul(vy);
            var vz2 = vz.mul(vz);
            var vx4 = vx.abs().pow(4.0);
            var vy4 = vy.abs().pow(4.0);
            var vz4 = vz.abs().pow(4.0);
            return Shade.max(0, vx2.add(vy2).add(vz2).sub(vx4).sub(vy4).sub(vz4));
        });

    var color = Shade.vec(Shade.vec(1,1,1).mul(volume_samples.average().mul(2)), 1);
    
    var square = Lux.actor({
        model: square_model, 
        appearance: {
            position: vertex_pos,
            color: color, // Shade.vec(vertex_pos.swizzle("xy").add(1).div(2), rerange.average(), 1),
            mode: Lux.DrawingMode.over
        }});

    Lux.Scene.add(square);
    var start = new Date().getTime();
    Lux.Scene.animate(function() {
        var elapsed = new Date().getTime() - start;
        angle_y.set((elapsed / 40) * (Math.PI/180));
    });
});
