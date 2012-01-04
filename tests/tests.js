module("Shade tests");

var canvas = document.getElementById("webgl");
var gl = Facet.init(canvas);
$(canvas).hide();

test("Shade types", function() {
    var x = Shade.basic('float');
    expect(20);
    raises(function() {
        Shade.basic('askldjasdf');
    }, "bad basic objects should fail");
    raises(function() {
        Shade.basic('vec2').swizzle('rx');
    }, "bad swizzle pattern");
    ok(Shade.basic('vec2').swizzle('rg'), "basic swizzle pattern #1");
    ok(Shade.basic('vec2').equals(Shade.Types.vec2), "type equality");
    equal(Shade.basic('vec2').swizzle('rrr').repr(),
          'vec3', "basic swizzle pattern type");
    equal(Shade.basic('ivec4').swizzle('a').repr(),
          'int', "basic swizzle to scalar");
    equal(Shade.basic('bvec2').swizzle('t').repr(),
          'bool', "basic swizzle to scalar");
    equal(Shade.basic('vec4').swizzle('q').repr(),
          'float', "basic swizzle to scalar");
    raises(function() {
        Shade.Shade.varying("model_pos");
    }, "declarations require types");

    equal(Shade.basic('vec4').is_vec(), true, "type check methods");
    equal(Shade.basic('float').is_vec(), false, "type check methods");
    equal(Shade.basic('mat4').is_vec(), false, "type check methods");
    equal(Shade.basic('mat4').is_pod(), false, "type check methods");
    equal(Shade.basic('float').is_pod(), true, "type check methods");
    raises(function() {
        Shade.constant($V([1, false]), "bad constant");
    }, "bad constant");

    ok(Shade.basic('vec4').element_type(0).equals(Shade.Types.float_t), "element_type");
    ok(Shade.vec(Shade.vec(3, 4), 0).type.element_type(2).equals(Shade.Types.float_t), "element_type");
    raises(function() {
        Shade.vec(Shade.vec(3, 4), true);
    }, "bad vec construction");
    raises(function() {
        Shade.vec(Shade.vec(3, 4), 5).type.element_type(3);
    }, "out-of-bounds element_type check");

    raises(function() {
        Shade.constant(1.5).equal(Shade.as_int(3));
    }, "comparison type check");
});

test("Shade expressions", function() {
    ok(Shade.sin(3), "trig expressions");
    ok(Shade.mul(4, 5), "type-promotion on operations");
    ok(Shade.add(4, 5), "type-promotion on operations");
    ok(Shade.sub(4, 5), "type-promotion on operations");

    ok(Shade.or(true, false), "boolean expressions");
    ok(Shade.or(false, true).not(), "boolean expressions");
    ok(Shade.xor(true, false).and(true), "boolean expressions");

    ok(Shade.greaterThan(Shade.vec(1,2,3),
                         Shade.vec(0,2,3)), "relational ops");
    equal(Shade.greaterThan(Shade.vec(1,2,3),
                            Shade.vec(0,2,3)).type.repr(), "bvec3", "relational ops");
    ok(Shade.any(Shade.greaterThan(Shade.vec(1,2,3),
                                   Shade.vec(0,2,3))), "relational ops");

});

test("Shade compilation", function() {
    ok(Shade.constant(vec.make([1,2,3,4])).eval());

    // this is a little finicky because the unique names might get
    // incremented, but I don't know any easy way around it.

    (function () {
        var u = Shade.uniform("vec4");
        var v = u.exp();
        var c = v.cos();
        var s = v.sin();
        var cond = Shade.uniform("float").gt(0);
        var root = Shade.selection(cond, c, s);
        var cc = Shade.CompilationContext(Shade.VERTEX_PROGRAM_COMPILE);
        cc.compile(root);
        equal(cc.source(), "precision highp float;\n" +
              " uniform float _unique_name_2;\n" +
              " uniform vec4 _unique_name_1;\n" +
              " vec4 glsl_name_8 ;\n" +
              " bool glsl_name_9 ;\n" +
              " vec4 glsl_name_4 (void) {\n" +
              "     return  (glsl_name_9?glsl_name_8: ((glsl_name_9=true),(glsl_name_8=exp ( _unique_name_1 )))) ;\n" +
              "}\n" +
              " void main() {\n" +
              "      glsl_name_9 = false ;\n" +
              "      ((_unique_name_2 > float(0.0))?cos ( glsl_name_4() ):sin ( glsl_name_4() )) ;\n"+
              " }\n");
    })();

    raises(function () {
        Shade.program({
            gl_Position: Shade.vec(0,0,0,1),
            gl_FragColor: Shade.vec(1,1,1,1),
            gl_Nononono: Shade.vec(1,0,0,0)
        });
    }, "gl_* are reserved GLSL names, sorry; you can't use them in Facet.");
    
    (function () {
        Shade.program({
            gl_Position: Shade.vec(16777216, 0, 0, 1),
            gl_FragColor: Shade.vec(1,1,1,1)
        });
    })();
});

test("Shade constant folding", function() {
    equal(Shade.constant(1).constant_value(), 1);
    equal(Shade.add(4,5).constant_value(), 9);
    equal(Shade.mul(4,5).constant_value(), 20);
    ok(vec.equal(Shade.mul(Shade.vec(1,2),
                           Shade.vec(3,4)).constant_value(),
                 vec.make([3,8])),
       "constant folding");
    ok(vec.equal(Shade.mul(Shade.vec(1,2,3,4),
                            3).constant_value(),
                  vec.make([3,6,9,12])),
       "constant folding");
    ok(vec.equal(Shade.mul(Shade.mat(Shade.vec(1,0,0,0),
                                     Shade.vec(0,1,0,0),
                                     Shade.vec(0,0,1,0),
                                     Shade.vec(0,0,0,1)),
                           Shade.vec(1,2,3,4)).constant_value(),
                 vec.make([1,2,3,4])),
       "constant folding");
    ok(vec.equal(Shade.mul(Shade.mat(Shade.vec(1,0,0,0),
                                     Shade.vec(0,1,0,0),
                                     Shade.vec(0,0,1,1),
                                     Shade.vec(0,0,0,1)),
                           Shade.vec(1,2,3,4)).constant_value(),
                 vec.make([1,2,3,7])),
       "constant folding");
    var v = Shade.vec(Shade.attribute("foo", "vec2"),
                      Shade.vec(1, 2));
    equal(v.element_is_constant(0), false, "constant element checks");
    equal(v.element_is_constant(1), false, "constant element checks");
    equal(v.element_is_constant(2), true, "constant element checks");
    equal(v.element_is_constant(3), true, "constant element checks");

    equal(Shade.mul(Shade.vec(1, Shade.attribute("foo", "vec2")),
                    Shade.vec(4, Shade.attribute("bar", "vec2"))).element_constant_value(0),
          4, "very basic partial constant folding");

    ok(vec.equal(Shade.vec(1,2,3,4).swizzle("xyz").constant_value(),
                 vec.make([1,2,3])),
       "swizzle folding");

    ok(vec.equal(Shade.mul(Shade.mat3(Shade.mat(Shade.vec(1,0,0,0),
                                                Shade.vec(0,1,0,0),
                                                Shade.vec(0,0,1,0),
                                                Shade.vec(0,0,1,1))),
                           Shade.vec(1,2,3)).constant_value(),
                 vec.make([1,2,3])),
       "constant folding");

    equal(Shade.sin(3).constant_value(), Math.sin(3), "built-in constant folding");
    
    equal(Shade.sin(Shade.mul(2, 3)).constant_value(), Math.sin(6), "compound");

    equal(Shade.sign(Shade.cos(3)).constant_value(), -1, "sign");

    equal(Shade.radians(Shade.degrees(1)).constant_value(), 1, "radians, degrees");

    equal(Shade.sin(3).div(Shade.cos(3)).constant_value(),
          Shade.tan(3).constant_value(), "trig");

    equal(Shade.sub(1, 2).constant_value(), -1, "sub folding");
    ok(vec.equal(Shade.sub(Shade.vec(1, 2, 3),
                           Shade.vec(2, 3, 4)).constant_value(),
                 vec.make([-1,-1,-1])), "sub folding");

    ok(vec.equal(Shade.div(Shade.vec(1,2,3),
                           Shade.vec(4,5,6)).constant_value(),
                 vec.make([1/4,2/5,3/6])),
       "div folding");

    ok(vec.equal(Shade.div(Shade.vec(1,2,3), 2).constant_value(),
                 vec.make([1/2,2/2,3/2])),
       "div folding");

    equal(Shade.clamp(3, 0, 5).constant_value(), 3, "clamp folding");
    ok(vec.equal(Shade.clamp(Shade.vec(-1, 2, 3, 0.5),
                             0, 1).constant_value(),
                 vec.make([0, 1, 1, 0.5])), "clamp folding");
    ok(vec.equal(Shade.clamp(Shade.vec(-1, 3, 0.5),
                             Shade.vec(-2, 4, 0),
                             Shade.vec(-1.5, 6, 1)).constant_value(),
                 vec.make([-1.5, 4, 0.5])),
       "clamp folding");

    equal(Shade.mod(3, 2).constant_value(), 1, "mod folding");
    ok(vec.equal(Shade.mod(Shade.vec(1,2,3,4), 2).constant_value(),
                 vec.make([1,0,1,0])), "mod folding");
    ok(vec.equal(Shade.mod(Shade.vec(1,2,3,4), 
                           Shade.vec(2,3,2,3)).constant_value(),
                 vec.make([1,2,1,1])), 
       "mod folding");

    equal(Shade.mix(0, 3, 0.5).constant_value(), 1.5, "mix folding");
    ok(vec.equal(Shade.mix(Shade.vec(1, 2, 3),
                           Shade.vec(4, 5, 6), 0.5).constant_value(),
                 vec.make([2.5, 3.5, 4.5])), "mix folding");
    equal(Shade.step(0.5, -5).constant_value(), 0, "step folding");
    equal(Shade.step(0.5, 0.5).constant_value(), 1, "step folding");
    ok(vec.equal(Shade.step(1.5, Shade.vec(0,1,2,3)).constant_value(),
                 vec.make([0,0,1,1])), "step folding");
    ok(vec.equal(Shade.step(Shade.vec(1,1,1.5,1.5),
                            Shade.vec(0,1,2,3)).constant_value(),
                 vec.make([0, 1, 1, 1])), "step folding");

    equal(Shade.smoothstep(1, 2, 3).constant_value(), 1, "smoothstep folding");
    ok(vec.equal(Shade.smoothstep(Shade.vec(1, 2, 3),
                                  Shade.vec(2, 3, 4),
                                  Shade.vec(1.5, 2.5, 3.5)).constant_value(),
                 vec.make([0.5, 0.5, 0.5])), "smoothstep folding");

    equal(Shade.constant(1.5).as_int().constant_value(), 1, "as_int folding");

    equal(Shade.constant(1.5).eq(Shade.constant(1.5)).constant_value(), true,
          "comparison op folding");
    equal(Shade.constant(1.5).ne(Shade.constant(1.5)).constant_value(), false,
          "comparison op folding");
    equal(Shade.constant(1.5).le(Shade.constant(1.5)).constant_value(), true,
          "comparison op folding");
    equal(Shade.constant(1.5).lt(Shade.constant(1.5)).constant_value(), false,
          "comparison op folding");
    equal(Shade.as_int(4).ge(Shade.as_int(4)).constant_value(), true,
          "comparison op folding");
    equal(Shade.constant(1.5).gt(Shade.constant(3.5)).constant_value(), false,
          "comparison op folding");


    equal(Shade.any(Shade.greaterThan(Shade.vec(1, 2, 3),
                                      Shade.vec(0, 2, 3))).constant_value(), true,
          "relational op folding");
    equal(Shade.all(Shade.greaterThan(Shade.vec(1, 2, 3),
                                      Shade.vec(0, 2, 3))).constant_value(), false,
          "relational op folding");
    equal(Shade.all(Shade.greaterThanEqual(
        Shade.vec(1, 2, 3), Shade.vec(0, 2, 3))).constant_value(), true,
          "relational op folding");


    ok(mat.equal(Shade.mat(Shade.vec(1, 2),
                           Shade.vec(3, 4))
                 .matrixCompMult(Shade.mat(Shade.vec(2, 3),
                                           Shade.vec(4, 5))).constant_value(),
                 mat.make([2, 6, 12, 20])),
       "matrixCompMult folding");

    equal(Shade.selection(true, 3, 5).constant_value(), 3, "selection folding");
    ok(vec.equal(Shade.selection(Shade.lt(4, 6), 
                                 Shade.vec(1,1,1,1),
                                 Shade.vec(0,0,0,0)).constant_value(),
                 vec.make([1,1,1,1])),
       "selection folding");

    equal(Shade.or(true).constant_value(), true, "single logical value");
    equal(Shade.make(true).discard_if(false).is_constant(), true, "discard constant folding");
    equal(Shade.make(false).discard_if(false).constant_value(), false, "discard constant folding");

    var tex = Shade.uniform("sampler2D");
    var texcoord = Shade.varying("fooobarasdf", "vec2");

    equal(Shade.selection(true,
                          Shade.selection(false,
                                          Shade.color('red'),
                                          Shade.texture2D(tex, texcoord)),
                          Shade.color('black')).is_constant(), false, "11052011 Marks.dots issue");
});

test("Shade optimizer", function() {
    var uniform = Shade.uniform("vec4");
    var uniform_logical = Shade.uniform("bool");
    var uniform_logical_2 = Shade.uniform("bool");
    var exp = Shade.mul(uniform, Shade.constant(0));
    equal(Shade.Optimizer.is_times_zero(exp), true, "detect times zero");

    var result = Shade.Optimizer.replace_with_zero(exp);
    equal(result.is_constant(), true, "replace times zero yields constant");
    ok(vec.equal(result.constant_value(),
                 vec.make([0,0,0,0])), "replace times zero");

    exp = Shade.mul(uniform, Shade.constant(1));
    equal(Shade.Optimizer.is_times_one(exp), true, "detect times one");
    result = Shade.Optimizer.replace_with_notone(exp);
    equal(result.guid, uniform.guid, "times one simplifies to original expression");

    exp = Shade.mul(Shade.constant(1), uniform);
    equal(Shade.Optimizer.is_times_one(exp), true, "detect times one");
    result = Shade.Optimizer.replace_with_notone(exp);
    equal(result.guid, uniform.guid, "times one simplifies to original expression");

    exp = Shade.add(Shade.constant(0), uniform);
    equal(Shade.Optimizer.is_plus_zero(exp), true, "detect plus zero");
    result = Shade.Optimizer.replace_with_nonzero(exp);
    equal(result.guid, uniform.guid, "plus zero simplifies to original expression");

    exp = Shade.add(uniform, Shade.constant(0));
    equal(Shade.Optimizer.is_plus_zero(exp), true, "detect plus zero");
    result = Shade.Optimizer.replace_with_nonzero(exp);
    equal(result.guid, uniform.guid, "plus zero simplifies to original expression");

    exp = Shade.mul(uniform, Shade.vec(0.5, 0.5, 0.5, 1));
    equal(Shade.Optimizer.is_times_one(exp), false, "detect false times one");

    // There's a slight subtlety here in that vec(1,1,1,1) is identity in
    // vec(1,1,1,1) * vec4(foo), but not in vec(1,1,1,1) * 5.
    exp = Shade.mul(Shade.vec(1, 1, 1, 1), 0.5);
    equal(Shade.Optimizer.is_times_one(exp), false, "detect false times one");

    var identity = Shade.mat(Shade.vec(1, 0, 0, 0),
                             Shade.vec(0, 1, 0, 0),
                             Shade.vec(0, 0, 1, 0),
                             Shade.vec(0, 0, 0, 1));
    equal(Shade.Optimizer.is_mul_identity(identity), true, "detect multiplicative identity");

    exp = Shade.mul(identity,
                    Shade.vec(1,1,1,1));
    equal(Shade.Optimizer.is_times_one(exp), true, "detect heterogenous times one");

    equal(Shade.Optimizer.is_logical_or_with_constant(
        Shade.or(true, uniform_logical)), true, "detect true || x");

    ok(uniform_logical.guid !== undefined, "uniform_logical has guid");
    equal(Shade.Optimizer.replace_logical_or_with_constant(
        Shade.or(false, uniform_logical)).guid, uniform_logical.guid, "optimize false || x");
    equal(Shade.Optimizer.replace_logical_or_with_constant(
        Shade.or(true, uniform_logical)).constant_value(), true, "optimize true || x");

    equal(Shade.Optimizer.replace_logical_and_with_constant(
        Shade.and(true, uniform_logical)).guid, uniform_logical.guid, "optimize true && x");
    equal(Shade.Optimizer.replace_logical_and_with_constant(
        Shade.and(false, uniform_logical)).constant_value(), false, "optimize false && x");

    equal(Shade.Optimizer.is_known_branch(
        Shade.selection(true, uniform_logical, uniform_logical_2)), true, "detect known branch");
    equal(Shade.Optimizer.prune_selection_branch(
        Shade.selection(true, uniform_logical, uniform_logical_2)).guid, 
          uniform_logical.guid, "optimize known branch");
    equal(Shade.Optimizer.prune_selection_branch(
        Shade.selection(false, uniform_logical, uniform_logical_2)).guid, 
          uniform_logical_2.guid, "optimize known branch");
});

test("Shade programs", function() {
    ok(Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1)
    }), "Basic program");
});

test("Shade loops", function() {
    var from = Shade.as_int(0), to = Shade.as_int(10);
    var avg = Shade.range(from, to).average();
    Shade.debug = true;
    var p = Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1),
        point_size: avg
    });
    ok(p, "Basic looping program");
});
