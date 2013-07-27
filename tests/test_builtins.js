test("Test Shade builtins", function() {
    var exp = {"type": "vec", guid: 227, "parents": [
        {"type": "parameter", "parameter_type": "float", "guid":9999, "parents": []},
        {"type": "constant", "guid":9998, "parents": [], "values": [0]},
        {"type": "constant", "guid":9997, "parents": [], "values": [0]},
        {"type": "constant", "guid":9996, "parents": [], "values": [1]}]};
    var exp2 = {"type":"cross","guid":242,"parents":[
        {"type":"normalize","guid":238,"parents":[
            {"type":"cross","guid":237,"parents":[
                {"type":"dFdx","guid":235,"parents":[
                    {"type":"div","guid":234,"parents":[
                        {"type":"swizzle{xyz}","guid":232,"parents":[exp]},
                        {"type":"swizzle{w}","guid":233,"parents":[{"type":"reference","guid":227}]}]}]},
                {"type":"dFdy","guid":236,"parents":[{"type":"reference","guid":234}]}]}]},
        {"type":"vec","guid":241,"parents":[
            {"type":"constant","guid":239,"parents":[],"values":[0]},
            {"type":"constant","guid":240,"parents":[],"values":[0]},
            {"type":"constant","guid":241,"parents":[],"values":[1]}]}]};
    ok(Shade.Debug.from_json(exp2).element(0));

    equal(Shade.cross(Shade.vec(1,0,0),
                      Shade.vec(0,1,0)).element(0).constant_value(), 0);
    equal(Shade.cross(Shade.vec(1,0,0),
                      Shade.vec(0,1,0)).element(1).constant_value(), 0);
    equal(Shade.cross(Shade.vec(1,0,0),
                      Shade.vec(0,1,0)).element(2).constant_value(), 1);
    equal(Shade.cross(Shade.vec(0,1,0),
                      Shade.vec(1,0,0)).element(2).constant_value(), -1);

    almost_equal(Shade.atan(Shade.vec(0,0,0)).evaluate(), vec.make([0,0,0]));

    equal(Shade.clamp(0.5, 0, 1).evaluate(), 0.5);
    equal(Shade.clamp(-0.5, 0, 1).evaluate(), 0);
    equal(Shade.clamp(1.5, 0, 1).evaluate(), 1);
    almost_equal(Shade.clamp(Shade.vec(0.5, -0.5, 1.5), 0, 1).evaluate(), vec.make([0.5, 0, 1]));

});
