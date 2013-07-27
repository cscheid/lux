test("Tests from previous Lux bugs", function() {
    var exp = {"type": "vec", guid: 227, "parents": [
        {"type": "parameter", "parameter_type": "float", "guid":9999, "parents": []},
        {"type": "constant", "guid":9998, "parents": [], "values": [0]},
        {"type": "constant", "guid":9997, "parents": [], "values": [0]},
        {"type": "constant", "guid":9996, "parents": [], "values": [1]}]};

    var condition = {"type":"gt","guid":245,"parents":[
        {"type":"swizzle{z}","guid":243,"parents":[
            {"type":"dFdx","guid":235,"parents":[
                {"type":"div","guid":234,"parents":[
                    {"type":"swizzle{xyz}","guid":232,"parents":[{"type":"reference","guid":227}]},
                    {"type":"swizzle{w}","guid":233,"parents":[{"type":"reference","guid":227}]}]}]}]},
        {"type":"constant","guid":244,"parents":[],"values":[0]}]};

    var node = {"type":"discard_if","guid":246,"parents":[exp,condition]};
    var node_exp = Shade.Debug.from_json(node);
    var prog = { position: node_exp,
                 color: Shade.vec(0,0,0,1) };

    ok(Shade.program(prog), "discard expressions should be hoisted to fragment program");

    var condition2 = {"type":"gt","guid":245,"parents":[
        {"type":"swizzle{z}","guid":243,"parents":[
            {"type":"cross","guid":242,"parents":[
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
                    {"type":"constant","guid":241,"parents":[],"values":[1]}]}]}]},
        {"type":"constant","guid":244,"parents":[],"values":[0]}]};

    var cond_exp = Shade.Debug.from_json(condition2);

    var prog2 = { position: Shade.vec(0,0,0,0),
                  color: cond_exp.ifelse(Shade.vec(1,0,0,0),
                                         Shade.vec(0,1,0,0)) };

    ok(Shade.program(prog2), "backface culling should not crash optimizer");
});
