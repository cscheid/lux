$().ready(function () {
    var gl = Lux.init({
        clearColor: [0, 0, 0, 1]
    });

    var squareModel = Lux.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    });

    var camera = Shade.Camera.ortho();
    var vertexPos = camera(squareModel.vertex);
    var steps = Shade.range(0, 100);

    var angleY = Shade.parameter("float", 0);
    var rotateY = Shade.rotation(angleY, Shade.vec(0,1,0));
    var rotateX = Shade.rotation(Shade.radians(20), Shade.vec(1,0,0));

    var samplePositions = 
        steps.transform(function(i) { 
            var u = i.asFloat().div(100);
            var origin = rotateY(rotateX(Shade.vec(squareModel.vertex, -1).mul(1.5)));
            var dest   = rotateY(rotateX(Shade.vec(squareModel.vertex,  1).mul(1.5)));
            return Shade.mix(origin, dest, u);
        });

    var volumeSamples =
        samplePositions.transform(function(v) {
            var vx = v.x(), vy = v.y(), vz = v.z();
            var vx2 = vx.mul(vx);
            var vy2 = vy.mul(vy);
            var vz2 = vz.mul(vz);
            var vx4 = vx.abs().pow(4.0);
            var vy4 = vy.abs().pow(4.0);
            var vz4 = vz.abs().pow(4.0);
            return Shade.max(0, vx2.add(vy2).add(vz2).sub(vx4).sub(vy4).sub(vz4));
        });

    var color = Shade.vec(Shade.vec(1,1,1).mul(volumeSamples.average().mul(2)), 1);
    
    var square = Lux.actor({
        model: squareModel, 
        appearance: {
            position: vertexPos,
            color: color, // Shade.vec(vertexPos.swizzle("xy").add(1).div(2), rerange.average(), 1),
            mode: Lux.DrawingMode.over
        }});

    Lux.Scene.add(square);
    var start = new Date().getTime();
    Lux.Scene.animate(function() {
        var elapsed = new Date().getTime() - start;
        angleY.set((elapsed / 40) * (Math.PI/180));
    });
});
