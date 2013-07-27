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
});
