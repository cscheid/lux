test("Lux transforms", function() {
    var llToM = Lux.Scene.Transform.Geo.latlongToMercator().getTransform();
    for (var i=0; i<100; ++i) {
        var v = vec.make([Math.random(), Math.random()]);
        var fw = llToM({ position: Shade(v) }).position.evaluate();
        var bw = llToM.inverse({ position: Shade(fw) }).position.evaluate();
        almostEqual(v, bw, "latlongToMercator inverse mismatch");
        var fw2 = llToM.inverse({ position: Shade(v) }).position.evaluate();
        var bw2 = llToM({ position: Shade(fw2) }).position.evaluate();
        almostEqual(v, bw2, "latlong_to_mercator inverse mismatch");
    }
});

