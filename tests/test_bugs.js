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

    ok(Shade.program(prog), "backface culling should not crash optimizer");

    var condition2 = {"type":"gt","guid":245,"parents":[
        {"type":"swizzle{z}","guid":243,"parents":[
            {"type":"cross","guid":242,"parents":[
                {"type":"normalize","guid":238,"parents":[
                    {"type":"cross","guid":237,"parents":[
                        {"type":"dFdx","guid":235,"parents":[
                            {"type":"div","guid":234,"parents":[
                                {"type":"swizzle{xyz}","guid":232,"parents":[{"type":"reference","guid":227}]},
                                {"type":"swizzle{w}","guid":233,"parents":[{"type":"reference","guid":227}]}]}]},
                        {"type":"dFdy","guid":236,"parents":[{"type":"reference","guid":234}]}]}]},
                {"type":"vec","guid":241,"parents":[
                    {"type":"constant","guid":239,"parents":[],"values":[0]},
                    {"type":"constant","guid":240,"parents":[],"values":[0]},
                    {"type":"ifelse","guid":231,"parents":[
                        {"type":"constant","guid":228,"parents":[],"values":[true]},
                        {"type":"constant","guid":229,"parents":[],"values":[1]},
                        {"type":"constant","guid":230,"parents":[],"values":[-1]}]}]}]}]},
        {"type":"constant","guid":244,"parents":[],"values":[0]}]};
    var prog2 = { position: Shade.Debug.from_json({"type":"discard_if","guid":246,"parents":[exp,condition2]}),
                  color: Shade.vec(0,0,0,1) };

    ok(Shade.program(prog), "backface culling should not crash optimizer");
});