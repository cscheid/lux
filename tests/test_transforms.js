test("Lux transforms", function() {
    var ll_to_m = Lux.Scene.Transform.Geo.latlong_to_mercator().get_transform();
    for (var i=0; i<100; ++i) {
        var v = vec.make([Math.random(), Math.random()]);
        var fw = ll_to_m({ position: Shade(v) }).position.evaluate();
        var bw = ll_to_m.inverse({ position: Shade(fw) }).position.evaluate();
        almost_equal(v, bw, "latlong_to_mercator inverse mismatch");
        var fw2 = ll_to_m.inverse({ position: Shade(v) }).position.evaluate();
        var bw2 = ll_to_m({ position: Shade(fw2) }).position.evaluate();
        almost_equal(v, bw2, "latlong_to_mercator inverse mismatch");
    }
});
