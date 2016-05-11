$().ready(function () {
    Lux.init({ clearColor: [0, 0, 0, 0.2] });

    var nPoints = 64;
    var xArray = new Float32Array(nPoints);
    var yArray1 = new Float32Array(nPoints);
    var yArray2 = new Float32Array(nPoints);
    for (var i=0; i<nPoints; ++i) {
        xArray[i] = i;
        yArray1[i] = Math.random();
        yArray2[i] = Math.random();
    }

    var xBuffer = Lux.attributeBuffer({
        itemSize: 1,
        vertexArray: xArray
    });
    var yBuffer1 = Lux.attributeBuffer({
        itemSize: 1,
        vertexArray: yArray1
    });
    var yBuffer2 = Lux.attributeBuffer({
        itemSize: 1,
        vertexArray: yArray2
    });
    
    var scale = Shade.Scale.linear({
        domain: [Shade.vec(0, 0), Shade.vec(nPoints, 1)],
        range: [Shade.vec(-0.95, -0.95), Shade.vec(0.95, 0.95)]
    });

    var yT = Shade.Scale.linear({
        domain: [0, 1],
        range: [Shade(yBuffer1), Shade(yBuffer2)]
    });

    var transitionT = Shade.parameter("float", 0);
    var dots = Lux.Marks.dots({
        position: scale(Shade.vec(xBuffer, yT(transitionT))),
        elements: nPoints
    });

    Lux.Scene.add(dots);

    var t = 0;
    Lux.Scene.animate(function() {
        var t2 = Lux.now().get();
        if ((t2 - t) < 1) {
            transitionT.set(t2-t);
            return;
        }
        t = t2;
        transitionT.set(0);
        yBuffer1.set(yArray2);
        for (var i=0; i<nPoints; ++i) {
            yArray2[i] = Math.random();
        }
        yBuffer2.set(yArray2);
    });
});
