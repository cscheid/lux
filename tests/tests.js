module("Shade tests");

var canvas = document.getElementById("webgl");
var gl = Facet.init(canvas);
$(canvas).hide();

test("Shade types", function() {
    var x = Shade.basic('float');
    expect(21);
    raises(function() {
        Shade.basic('askldjasdf');
    }, function(e) {
        return e === "invalid basic type 'askldjasdf'";
    }, "bad basic objects should fail");
    raises(function() {
        Shade.basic('vec2').swizzle('rx');
    }, function(e) {
        return e === "swizzle pattern 'rx' belongs to more than one group";
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
        Shade.varying("model_pos");
    }, function(e) { return e === "varying requires type"; });

    equal(Shade.basic('vec4').is_vec(),  true,  "type check methods");
    equal(Shade.basic('float').is_vec(), false, "type check methods");
    equal(Shade.basic('mat4').is_vec(),  false, "type check methods");
    equal(Shade.basic('mat4').is_pod(),  false, "type check methods");
    equal(Shade.basic('float').is_pod(), true,  "type check methods");
    raises(function() {
        var v = [];
        Shade.array(v);
    }, function(e) { 
        return e === "array constant must be non-empty"; 
    });
    raises(function() {
        var v = [1, false];
        Shade.array(v);
    }, function(e) {
        return e === "array elements must have identical types";
    });

    ok(Shade.basic('vec4').element_type(0).equals(Shade.Types.float_t), "element_type");
    ok(Shade.vec(Shade.vec(3, 4), 0).type.element_type(2).equals(Shade.Types.float_t), "element_type");
    raises(function() {
        Shade.vec(Shade.vec(3, 4), true);
    }, function(e) {
        return e === "vec requires equal types";
    }, "bad vec construction");
    raises(function() {
        Shade.vec(Shade.vec(3, 4), 5).type.element_type(3);
    }, function(e) {
        return e === "invalid call: vec3 has no element 3";
    }, "out-of-bounds element_type check");

    raises(function() {
        Shade.constant(1.5).equal(Shade.as_int(3));
    }, function(e) {
        return e === "type error on equal: could not find appropriate type match for (float, int)";
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

    raises(function() {
        Shade.array([1,2,3,4]).swizzle("a");
    }, function(e) {
        return e === "type 'float[4]' does not support swizzling";
    }, "disallow swizzle on arrays");
});

test("Shade compilation", function() {
    ok(Shade.constant(vec.make([1,2,3,4])).evaluate());

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
              " vec4 glsl_name_7 (void) {\n" + 
              "     return  ((_unique_name_2 > float(0.0))?cos ( glsl_name_4() ):sin ( glsl_name_4() )) ;\n" + 
              "}\n" + 
              " void main() {\n" + 
              "      glsl_name_9 = false ;\n" + 
              "      glsl_name_7() ;\n" + 
              " }\n");
    })();

    raises(function () {
        Shade.program({
            gl_Position: Shade.vec(0,0,0,1),
            gl_FragColor: Shade.vec(1,1,1,1),
            gl_Nononono: Shade.vec(1,0,0,0)
        });
    }, function(e) {
        return e === "gl_* are reserved GLSL names";
    }, "reserved GLSL names in Facet");
    
    (function () {
        Shade.program({
            gl_Position: Shade.vec(16777216, 0, 0, 1),
            gl_FragColor: Shade.vec(1,1,1,1)
        });
    })();
});

test("Shade constant folding", function() {
    var x = Shade.uniform("float");
    equal(Shade.mul(2, Shade.vec(2, 2)).element(1).constant_value(), 4, 
          "different dimensions on float-vec operations and element()");
    equal(Shade.add(Shade.vec(2,2), 4).element(1).constant_value(), 6, 
          "different dimensions on float-vec operations and element()");
    equal(Shade.max(Shade.vec(3,1,2), 2).element(1).constant_value(), 2,
          "different dimensions on float-vec max-min-mod built-ins");
    
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
    equal(Shade.array([1,2,3,4,5,6]).is_constant(), false, 
          "constant checking for arrays");
    equal(Shade.array([1,2,3,4,5,6]).at(2).is_constant(), true, 
          "constant checking for array elements");
    raises(function() {
        var x = Shade.array([1,2,3,4,5]);
        var y = Shade.array([1,2,3,4,5]);
        x.eq(y);
    }, function(e) {
        return e === "operator== does not support arrays";
    }, "operator== does not support arrays");

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

    ok(Shade.vec(1,0,0).eq(Shade.vec(0,1,0)).constant_value() === false, 
       "equality comparison on vectors");
    ok(Shade.mat(Shade.vec(1,1),
                 Shade.vec(1,1)).eq(Shade.mat(Shade.vec(1,1),
                                              Shade.vec(1,1))).constant_value() === true, 
       "equality comparison on matrices");

    //////////////////////////////////////////////////////////////////////////
    // constant folding on selections:
    var uniform_logical = Shade.uniform("bool"), 
        uniform_float = Shade.uniform("float");

    ok(Shade.selection(uniform_logical, 3, 3).is_constant() === true,
       "selection is_constant() when both sides are the same");

    equal(Shade.selection(uniform_logical, 3, 3).constant_value(), 3,
       "selection constant_value() when both sides are the same");

    ok(Shade.selection(uniform_logical, uniform_float, 3).is_constant() === false,
       "selection is_constant() when both sides are the same");

    equal(Shade.selection(uniform_logical, 
                       Shade.vec(uniform_float, 5, uniform_float, uniform_float),
                       Shade.vec(uniform_float, 5, uniform_float, uniform_float))
          .element_is_constant(1), true,
          "selection element_is_constant when both sides are the same");

    equal(Shade.selection(uniform_logical, 
                       Shade.vec(uniform_float, 5, uniform_float, uniform_float),
                       Shade.vec(uniform_float, 6, uniform_float, uniform_float))
          .element_is_constant(1), false,
          "selection element_is_constant when both sides aren't the same");

    equal(Shade.selection(uniform_logical, 
                       Shade.vec(uniform_float, 5, uniform_float, uniform_float),
                       Shade.vec(uniform_float, 5, uniform_float, uniform_float))
          .element_constant_value(1), 5,
          "selection element_constant_value when both sides are the same");

    ok(Shade.vec(Shade.max(0, 1), 1, 1).element(0).constant_value() === 1,
       "element() on built-in expressions");

    ok(Shade.add(2, Shade.vec(1, 2)).element_is_constant(1),
       "operator element_is_constant");

    ok(Shade.div(Shade.vec(1,2,3).swizzle("gb"),
                 Shade.mul(Shade.vec(1,2,3).swizzle("r"), 13)).element_is_constant(1),
       "operator element_is_constant");

    (function() {
        var m1 = Shade.mat(Shade.vec(Math.random(), Math.random()),
                           Shade.vec(Math.random(), Math.random()));
        var m2 = Shade.mat(Shade.vec(Math.random(), Math.random()),
                           Shade.vec(Math.random(), Math.random()));
        var v1 = Shade.vec(Math.random(), Math.random()),
            v2 = Shade.vec(Math.random(), Math.random());
        var s = Math.random();
        ok(Math.abs(m1.mul(v1).element_constant_value(0) - m1.mul(v1).constant_value()[0]) < 1e-4, 
           "element_constant_value(i) <-> element(i).constant_value() equivalence on operator* 1");
        ok(Math.abs(v1.mul(m1).element_constant_value(0) - v1.mul(m1).constant_value()[0]) < 1e-4, 
           "element_constant_value(i) <-> element(i).constant_value() equivalence on operator* 2");
        ok(vec.length(vec.minus(m1.mul(m2).element_constant_value(0),
                                _.toArray(m1.mul(m2).constant_value()).slice(0, 2))) < 1e-4, 
           "element_constant_value(i) <-> element(i).constant_value() equivalence on operator* 3");
        ok(Math.abs(v1.mul(v2).element_constant_value(0) - v1.mul(v2).constant_value()[0]) < 1e-4,
           "element_constant_value(i) <-> element(i).constant_value() equivalence on operator* 4");
        ok(Math.abs(v1.mul(s).element_constant_value(0) -
                    v1.mul(s).constant_value()[0]) < 1e-4,
           "element_constant_value(i) <-> element(i).constant_value() equivalence on operator* 5");
        ok(Math.abs(Shade.mul(s, v1).element_constant_value(0) -
                    Shade.mul(s, v1).constant_value()[0]) < 1e-4,
           "element_constant_value(i) <-> element(i).constant_value() equivalence on operator* 6");
    })();

    //////////////////////////////////////////////////////////////////////////
    // constant folding on elements

    equal(Shade.array([1,2,3,4]).at(1.5).constant_value(), 2,
          "array indexing with floats should cast");

    equal(Shade.max(Shade.vec(x,1,x), 2).element(1).constant_value(), 2,
          "partially-constant float-vec max-min-mod built-ins");

    equal(Shade.lessThanEqual(Shade.vec(1,2,3,4),
                              Shade.vec(4,3,2,1)).element(1).constant_value(), true,
          "partially constant folding on element-wise comparisons");
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

test("color conversion", function() {

    /* The serious tests will be: Javascript and shade expressions
    // must behave identically (up to floating-point issues);
    // 
    // Javascript and shade expressions must have appropriate inverses
     */

    function match(c1, c2, tol) {
        tol = _.isUndefined(tol)?1e-5:tol;
        c1 = c1.values();
        c2 = c2.values();
        var d = 0, d1 = 0, d2 = 0;
        for (var i=0; i<c1.length; ++i) {
            d += (c1[i] - c2[i]) * (c1[i] - c2[i]);
            d1 += c1[i] * c1[i];
            d2 += c2[i] * c2[i];
        }
        d = Math.sqrt(d) / Math.max(Math.sqrt(d1), Math.sqrt(d2));
        return d < tol;
    }

    function check(v1, v2, v3, source, target, tol) {
        var shade_source  = Shade.Colors.shadetable[source].create(v1, v2, v3);
        var js_source     = Shade.Colors.jstable[source].create(v1, v2, v3);
        
        var shade_target  = shade_source[target]();
        var js_target     = js_source[target]();

        var shade_source2 = shade_target[source]();
        var js_source2    = js_target[source]();

        if (!match(shade_source2, shade_source, tol)) {
            console.log("source",  shade_source,shade_source.values(),  js_source,js_source.values());
            console.log("target",  shade_target,shade_target.values(),  js_target,js_target.values());
            console.log("source2", shade_source2,shade_source2.values(), js_source2,js_source2.values());
            console.log("---");
        };

        ok(match(shade_source, js_source, tol), "constructors match");
        ok(match(shade_target, js_target, tol), source + "->" + target + " match");
        ok(match(shade_source2, js_source2, tol), source+"->"+target+"->"+source + " match");
        ok(match(shade_source, shade_source2, tol), source+"->"+target+"->"+source+" inverse shade");
        ok(match(js_source, js_source2, tol), source+"->"+target+"->"+source+" inverse js");
    }

    var test_count = 10;

    for (var i=0; i<test_count; ++i) {
        var r = Math.random(), g = Math.random(), b = Math.random();

        // Test the 6 basic conversion routines
        check(r, g, b, "rgb", "hls");
        check(r, g, b, "rgb", "srgb");
        check(r, g, b, "rgb", "hsv");
        check(r, g, b, "rgb", "xyz", 1e-3);

        check(r, g, b, "srgb", "xyz", 1e-3);

        var xyz = Shade.Colors.jstable.rgb.create(r, g, b).xyz();
        check(xyz.x, xyz.y, xyz.z, "xyz", "luv");

        var luv = xyz.luv();
        check(luv.l, luv.u, luv.v, "luv", "hcl");
    }

    // with the basic conversions verified, check the compound ones just
    // to prevent typos

    (function() {
        var r = Math.random(), g = Math.random(), b = Math.random();
        var rgb = Shade.Colors.jstable.rgb.create(r, g, b);
        var srgb = rgb.srgb();
        var xyz = rgb.xyz();
        var luv = xyz.luv();
        var hcl = luv.hcl();
        var hsv = rgb.hsv();
        var hls = rgb.hls();
        check(luv.l, luv.u, luv.v, "luv", "rgb");
        check(luv.l, luv.u, luv.v, "luv", "srgb");
        check(hcl.h, hcl.c, hcl.l, "hcl", "xyz");
        check(hcl.h, hcl.c, hcl.l, "hcl", "rgb");
        check(hcl.h, hcl.c, hcl.l, "hcl", "srgb");
        check(hcl.h, hcl.c, hcl.l, "hcl", "hsv");
        check(hcl.h, hcl.c, hcl.l, "hcl", "hls");
        check(hls.h, hls.l, hls.s, "hls", "hsv");
        check(hls.h, hls.l, hls.s, "hls", "srgb");
        check(hls.h, hls.l, hls.s, "hls", "xyz");
        check(hls.h, hls.l, hls.s, "hls", "luv");
        check(hsv.h, hsv.s, hsv.v, "hsv", "srgb");
        check(hsv.h, hsv.s, hsv.v, "hsv", "xyz");
        check(hsv.h, hsv.s, hsv.v, "hsv", "luv");
    })();
});
