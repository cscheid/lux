module("Shade tests");

var canvas = document.getElementById("webgl");
var gl = Lux.init(canvas);
$(canvas).hide();

// returns a uniformly distributed random integer x such mn <= x < mx
function random_int(mn, mx) {
    return Math.floor(Math.random() * (mx - mn)) + mn;
}

function almost_equal(expected, got, msg, eps) {
    eps = eps || 1e-4;
    ok(Math.abs(expected - got) < eps, msg + " expected: " + expected + " got: " + got);
}

test("Shade types", function() {
    var x = Shade.Types.basic('float');
    expect(21);
    raises(function() {
        Shade.Types.basic('askldjasdf');
    }, function(e) {
        return e === "invalid basic type 'askldjasdf'";
    }, "bad basic objects should fail");
    raises(function() {
        Shade.Types.basic('vec2').swizzle('rx');
    }, function(e) {
        return e === "swizzle pattern 'rx' belongs to more than one group";
    }, "bad swizzle pattern");
    ok(Shade.Types.basic('vec2').swizzle('rg'), "basic swizzle pattern #1");
    ok(Shade.Types.basic('vec2').equals(Shade.Types.vec2), "type equality");
    equal(Shade.Types.basic('vec2').swizzle('rrr').repr(),
          'vec3', "basic swizzle pattern type");
    equal(Shade.Types.basic('ivec4').swizzle('a').repr(),
          'int', "basic swizzle to scalar");
    equal(Shade.Types.basic('bvec2').swizzle('t').repr(),
          'bool', "basic swizzle to scalar");
    equal(Shade.Types.basic('vec4').swizzle('q').repr(),
          'float', "basic swizzle to scalar");
    raises(function() {
        Shade.varying("model_pos");
    }, function(e) { return e === "varying requires type"; });

    equal(Shade.Types.basic('vec4').is_vec(),  true,  "type check methods");
    equal(Shade.Types.basic('float').is_vec(), false, "type check methods");
    equal(Shade.Types.basic('mat4').is_vec(),  false, "type check methods");
    equal(Shade.Types.basic('mat4').is_pod(),  false, "type check methods");
    equal(Shade.Types.basic('float').is_pod(), true,  "type check methods");
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

    ok(Shade.Types.basic('vec4').element_type(0).equals(Shade.Types.float_t), "element_type");
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
    ok(Shade.constant(vec.make([1,2,3,4])).glsl_expression());

    // this is a little finicky because the unique names might get
    // incremented, but I don't know any easy way around it.

    (function () {
        var u = Shade.parameter("vec4");
        var v = u.exp();
        var c = v.cos();
        var s = v.sin();
        var cond = Shade.parameter("float").gt(0);
        var root = Shade.ifelse(cond, c, s);
        var cc = Shade.CompilationContext(Shade.VERTEX_PROGRAM_COMPILE);
        cc.compile(root);
        // This optimization was making the GLSL compiler too slow, so I removed it.
        // equal(cc.source(), "#extension GL_OES_standard_derivatives : enable\nprecision highp float;\n" +
        //       " uniform float _unique_name_2;\n" + 
        //       " uniform vec4 _unique_name_1;\n" + 
        //       " vec4 glsl_name_8 ;\n" + 
        //       " bool glsl_name_9 ;\n" + 
        //       " vec4 glsl_name_4 (void) {\n" + 
        //       "     return  (glsl_name_9?glsl_name_8: ((glsl_name_9=true),(glsl_name_8=exp ( _unique_name_1 )))) ;\n" + 
        //       "}\n" + 
        //       " vec4 glsl_name_7 (void) {\n" + 
        //       "     return  ((_unique_name_2 > float(0.0))?cos ( glsl_name_4() ):sin ( glsl_name_4() )) ;\n" + 
        //       "}\n" + 
        //       " void main() {\n" + 
        //       "      glsl_name_9 = false ;\n" + 
        //       "      glsl_name_7() ;\n" + 
        //       " }\n");

        equal(cc.source(), "#extension GL_OES_standard_derivatives : enable\n precision highp float;\n" + 
              " vec4 glsl_name_8 ;\n" +
              " uniform vec4 _unique_name_5;\n" +
              " uniform float _unique_name_6;\n" +
              " vec4 glsl_name_7 ( ) {\n" +
              "     return  ((_unique_name_6 > float(0.0))?cos ( glsl_name_8 ):sin ( glsl_name_8 )) ;\n" +
              "}\n" +
              " void main() {\n" +
              "      glsl_name_8 = exp ( _unique_name_5 ) ;\n" +
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
    }, "reserved GLSL names in Lux");
    
    (function () {
        Shade.program({
            gl_Position: Shade.vec(16777216, 0, 0, 1),
            gl_FragColor: Shade.vec(1,1,1,1)
        });
    })();
});

test("Shade structs", function() {
    ok(Shade.struct({foo: Shade.vec(1,0,0,1), bar: true }));
    var v1 = Shade.make({foo: Shade.vec(1,0,0,1), bar: true }),
        v2 = Shade.struct({foo: Shade.vec(1,0,0,1), bar: true }),
        v3 = {foo: vec.make([1, 0, 0, 1]), bar: true},
        v4 = v2.field("foo"),
        v5 = v2("foo");

    ok(_.isEqual(v1.constant_value(), v2.constant_value()));
    ok(_.isEqual(v2.constant_value(), v3));
    ok(_.isEqual(v4.constant_value(), v3.foo));
    ok(_.isEqual(v4.constant_value(), v5.constant_value()));

    var p1 = Shade.parameter("float", 1.0);
    var p2 = Shade.vec(1,0,0,1);
    var s = Shade.struct({ f: p1, v: p2 });
    
    var cc = Shade.CompilationContext(Shade.VERTEX_PROGRAM_COMPILE);
    // ok(cc.compile(s("f").mul(s("v"))).source());
    // equal(cc.source(),
    //       "struct type_235 {\n" +
    //       "      float f ;\n" +
    //       "      vec4 v ;\n" +
    //       " };\n" +
    //       " precision highp float;\n" +
    //       " uniform float _unique_name_3;\n" +
    //       " type_235 glsl_name_10 ;\n" +
    //       " void main() {\n" +
    //       "      glsl_name_10 = type_235 ( _unique_name_3, vec4(float(1.0), float(0.0), float(0.0), float(1.0)) ) ;\n" +
    //       "      ((glsl_name_10.f) * (glsl_name_10.v)) ;\n" +
    //       " }\n");

    ok(_.isEqual(Shade.Types.struct({foo: Shade.Types.vec4, bar: Shade.Types.vec4}).zero.constant_value(),
                 {foo: vec.make([0,0,0,0]), bar: vec.make([0,0,0,0])}));

    ok(_.isEqual(Shade.add(Shade.struct({foo: Shade.vec(1,2,3,4), bar: Shade.vec(4,3,2,1)}),
                           Shade.struct({bar: Shade.vec(1,2,3,4), foo: Shade.vec(4,3,2,1)})).constant_value(),
                 Shade.struct({foo: Shade.vec(5,5,5,5), bar: Shade.vec(5,5,5,5)}).constant_value()));

    // var cc2 = Shade.CompilationContext(Shade.VERTEX_PROGRAM_COMPILE);
    // cc2.compile(s.add(s));
    // console.log("BEFORE!!");
    // console.log(cc2.source());
    // console.log("AFTER!!");

    // test structs created with different field order in javascript objects:

    var s1 = Shade.struct({foo: Shade.vec(1,2,3,4), bar: Shade.vec(1,2)});
    var s2 = Shade.struct({bar: Shade.vec(1,2), foo: Shade.vec(1,2,3,4)});

    equal(s1.type.repr(), s2.type.repr());
    ok(_.isEqual(s1.parents[0].constant_value(), s2.parents[0].constant_value()));

    var s3 = Shade.struct({foo: Shade(0).as_int(),
                           bar: Shade(0)});
    var s4 = Shade.constant(s3.constant_value(), s3.type);
    equal(s3.type.repr(), s4.type.repr(), "constant_value() for structs keeps type information");
});

test("Shade constant folding", function() {
    equal(Shade.unknown("float").guid, Shade.unknown("float").guid);
    ok(Shade.unknown("float").guid !== Shade.unknown("mat2").guid);
    // notEqual();

    var x = Shade.parameter("float");
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
    var v = Shade.vec(Shade.attribute("vec2"),
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

    equal(Shade.mul(Shade.vec(1, Shade.attribute("vec2")),
                    Shade.vec(4, Shade.attribute("vec2"))).element_constant_value(0),
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

    equal(Shade.ifelse(true, 3, 5).constant_value(), 3, "ifelse folding");
    ok(vec.equal(Shade.ifelse(Shade.lt(4, 6), 
                              Shade.vec(1,1,1,1),
                              Shade.vec(0,0,0,0)).constant_value(),
                 vec.make([1,1,1,1])),
       "ifelse folding");

    equal(Shade.sub(Shade.constant(1, Shade.Types.int_t),
                    Shade.constant(2, Shade.Types.int_t)).constant_value(), -1,
          "int constant folding");

    equal(Shade.add(Shade.constant(1, Shade.Types.int_t),
                    Shade.constant(2, Shade.Types.int_t)).constant_value(), 3,
          "int constant folding");

    equal(Shade.or(true).constant_value(), true, "single logical value");
    equal(Shade(true).discard_if(false).is_constant(), true, "discard constant folding");
    equal(Shade(false).discard_if(false).constant_value(), false, "discard constant folding");

    var tex = Shade.parameter("sampler2D");
    var texcoord = Shade.varying("fooobarasdf", "vec2");

    equal(Shade.ifelse(true,
                       Shade.ifelse(false,
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
    // constant folding on ifelses:
    var parameter_logical = Shade.parameter("bool"), 
        parameter_float = Shade.parameter("float");

    ok(Shade.ifelse(parameter_logical, 3, 3).is_constant() === true,
       "ifelse is_constant() when both sides are the same");

    equal(Shade.ifelse(parameter_logical, 3, 3).constant_value(), 3,
       "ifelse constant_value() when both sides are the same");

    ok(Shade.ifelse(parameter_logical, parameter_float, 3).is_constant() === false,
       "ifelse is_constant() when both sides are the same");

    equal(Shade.ifelse(parameter_logical, 
                       Shade.vec(parameter_float, 5, parameter_float, parameter_float),
                       Shade.vec(parameter_float, 5, parameter_float, parameter_float))
          .element_is_constant(1), true,
          "ifelse element_is_constant when both sides are the same");

    equal(Shade.ifelse(parameter_logical, 
                       Shade.vec(parameter_float, 5, parameter_float, parameter_float),
                       Shade.vec(parameter_float, 6, parameter_float, parameter_float))
          .element_is_constant(1), false,
          "ifelse element_is_constant when both sides aren't the same");

    equal(Shade.ifelse(parameter_logical, 
                       Shade.vec(parameter_float, 5, parameter_float, parameter_float),
                       Shade.vec(parameter_float, 5, parameter_float, parameter_float))
          .element_constant_value(1), 5,
          "ifelse element_constant_value when both sides are the same");

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

    equal(Shade(2).norm().constant_value(), 2,  "norm constant evaluator");
    equal(Shade(-2).norm().constant_value(), 2, "norm constant evaluator");

    //////////////////////////////////////////////////////////////////////////
    // constant folding on elements

    equal(Shade.array([1,2,3,4]).at(1.5).constant_value(), 2,
          "array indexing with floats should cast");

    equal(Shade.max(Shade.vec(x,1,x), 2).element(1).constant_value(), 2,
          "partially-constant float-vec max-min-mod built-ins");

    equal(Shade.lessThanEqual(Shade.vec(1,2,3,4),
                              Shade.vec(4,3,2,1)).element(1).constant_value(), true,
          "partially constant folding on element-wise comparisons");

    //////////////////////////////////////////////////////////////////////////
    // 

    (function() {
        var nonconst = Shade.parameter("float");
        var exp = Shade.array([Shade.vec(1,1), Shade.vec(1,1)]).at(nonconst).sub(Shade.vec(2,3));
        ok(exp.element(0));
    })();

    //////////////////////////////////////////////////////////////////////////
    // semantics of Shade.add(v1,v2,v3,...)

    for (var i=0; i<10; ++i) {
        (function() {
            var lst = [];
            var n = (~~(Math.exp(-Math.random()) * 5)) + 1;
            for (var i=0; i<n; ++i) {
                lst.push(~~(Math.random() * 10 - 5));
            }
            var exp = Shade.add.apply(this, lst);
            ok(Math.abs(exp.constant_value() -
                        _.reduce(lst, function(a, b) { return a + b; })) < 1e-4,
               "Shade.add");
        })();
    }

    //////////////////////////////////////////////////////////////////////////
    // semantics of Shade.sub(v1,v2,v3,...)

    for (i=0; i<10; ++i) {
        (function() {
            var lst = [];
            var n = (~~(Math.exp(-Math.random()) * 5)) + 1;
            for (var i=0; i<n; ++i) {
                lst.push(~~(Math.random() * 10 - 5));
            }
            var exp = Shade.sub.apply(this, lst);
            ok(Math.abs(exp.constant_value() -
                        _.reduce(lst, function(a, b) { return a - b; })) < 1e-4,
               "Shade.sub");
        })();
    }

    equal(Shade.div(Shade(3).as_int(), Shade(2).as_int()).constant_value(), 1);
});

test("Shade optimizer", function() {
    var parameter = Shade.parameter("vec4");
    var parameter_logical = Shade.parameter("bool");
    var parameter_logical_2 = Shade.parameter("bool");
    var exp = Shade.mul(parameter, Shade.constant(0));
    equal(Shade.Optimizer.is_times_zero(exp), true, "detect times zero");

    var result = Shade.Optimizer.replace_with_zero(exp);
    equal(result.is_constant(), true, "replace times zero yields constant");
    ok(vec.equal(result.constant_value(),
                 vec.make([0,0,0,0])), "replace times zero");

    exp = Shade.mul(parameter, Shade.constant(1));
    equal(Shade.Optimizer.is_times_one(exp), true, "detect times one");
    result = Shade.Optimizer.replace_with_notone(exp);
    equal(result.guid, parameter.guid, "times one simplifies to original expression");

    exp = Shade.mul(Shade.constant(1), parameter);
    equal(Shade.Optimizer.is_times_one(exp), true, "detect times one");
    result = Shade.Optimizer.replace_with_notone(exp);
    equal(result.guid, parameter.guid, "times one simplifies to original expression");

    exp = Shade.add(Shade.constant(0), parameter);
    equal(Shade.Optimizer.is_plus_zero(exp), true, "detect plus zero");
    result = Shade.Optimizer.replace_with_nonzero(exp);
    equal(result.guid, parameter.guid, "plus zero simplifies to original expression");

    exp = Shade.add(parameter, Shade.constant(0));
    equal(Shade.Optimizer.is_plus_zero(exp), true, "detect plus zero");
    result = Shade.Optimizer.replace_with_nonzero(exp);
    equal(result.guid, parameter.guid, "plus zero simplifies to original expression");

    exp = Shade.mul(parameter, Shade.vec(0.5, 0.5, 0.5, 1));
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
        Shade.or(true, parameter_logical)), true, "detect true || x");

    ok(parameter_logical.guid !== undefined, "parameter_logical has guid");
    equal(Shade.Optimizer.replace_logical_or_with_constant(
        Shade.or(false, parameter_logical)).guid, parameter_logical.guid, "optimize false || x");
    equal(Shade.Optimizer.replace_logical_or_with_constant(
        Shade.or(true, parameter_logical)).constant_value(), true, "optimize true || x");

    equal(Shade.Optimizer.replace_logical_and_with_constant(
        Shade.and(true, parameter_logical)).guid, parameter_logical.guid, "optimize true && x");
    equal(Shade.Optimizer.replace_logical_and_with_constant(
        Shade.and(false, parameter_logical)).constant_value(), false, "optimize false && x");

    equal(Shade.Optimizer.is_known_branch(
        Shade.ifelse(true, parameter_logical, parameter_logical_2)), true, "detect known branch");
    equal(Shade.Optimizer.prune_ifelse_branch(
        Shade.ifelse(true, parameter_logical, parameter_logical_2)).guid, 
          parameter_logical.guid, "optimize known branch");
    equal(Shade.Optimizer.prune_ifelse_branch(
        Shade.ifelse(false, parameter_logical, parameter_logical_2)).guid, 
          parameter_logical_2.guid, "optimize known branch");

    ok(vec4.equal(Shade.mul(Shade.translation(Shade.vec(0,0,0)),
                            Shade.vec(1, 0)).constant_value(),
                  vec4.make([1,0,0,1])),
       "Shade mat4 * vec2 shortcuts");
    ok(vec4.equal(Shade.mul(Shade.translation(Shade.vec(0,0,0)),
                            Shade.vec(1, 0, 2)).constant_value(),
                  vec4.make([1,0,2,1])),
       "Shade mat4 * vec3 shortcuts");
});

test("Shade programs", function() {
    ok(Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1)
    }), "Basic program");
});

test("Shade loops", function() {
    var from = Shade.as_int(0), to = Shade.as_int(10);
    var range = Shade.range(from, to);

    Shade.debug = true;

    ok(Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1),
        point_size: range.sum().as_float()
    }), "program with sum");
    ok(Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1),
        point_size: range.average()
    }), "program with average");

    ok(Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1),
        point_size: range
            .transform(function (x) { return x.as_float(); })
            .fold(function(i, j) { return Shade.min(i, j); }, 1000)
                  // Shade.constant(1000).as_int())
    }), "program with fold");

    var p = Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1),
        point_size: Shade.range(from, to).average()
    });
    ok(p, "Basic looping program");
});

test("Texture tables", function() {
    var simple_data = {
        number_columns: [0, 1, 2],
        columns: [0, 1, 2],
        data: [ { 0: 0, 1: 1, 2: 2 },
                { 0: 3, 1: 4, 2: 5 },
                { 0: 6, 1: 7, 2: 8 } ]
    };
    var table = Lux.Data.texture_table(Lux.Data.table(simple_data));

    for (var row_ix=0; row_ix<3; ++row_ix) {
        for (var col_ix=0; col_ix<3; ++col_ix) {
            var linear_index = row_ix * 3 + col_ix;
            var texel_index = Math.floor(linear_index / 4);
            var texel_offset = linear_index % 4;
            var tex_y = Math.floor(texel_index / 2);
            var tex_x = texel_index % 2;
            ok(vec.equal(table.index(row_ix, col_ix).constant_value(),
                         vec.make([tex_x, tex_y, texel_offset])));
        }
    }
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

test("Shade Bits", function() {
    (function() {
        for (var i=0; i<24; ++i) {
            var t = i;
            var t1 = 1 << t;
            var t2 = Shade.Bits.shift_left(1, t).constant_value();
            var t3 = Shade.Bits.shift_right(t1, t).constant_value();
            almost_equal(t1, t2, "shift left");
            almost_equal(1, t3, "shift right (" + t + " " + t1 + ") ");
        }
        for (i=0; i<10; ++i) {
            var v = random_int(0, 65536);
            var amt = random_int(0, 16);
            var t1 = v >> amt;
            var t2 = Shade.Bits.shift_right(v, amt).constant_value(); 
            almost_equal(t1, t2, "shift right (" + v + ", " + amt + ")");
        }
    })();

    (function() {
        for (var i=0; i<10; ++i) {
            var v = random_int(0, 65536);
            var bits = random_int(0, 16);

            // straight from the spec
            var t3 = v % (1 << bits);
            var t4 = Shade.Bits.mask_last(v, bits).constant_value();
            almost_equal(t3, t4, "mask_last (" + v + ", " + bits + ")");
        }
    })();

    (function() {
        for (var i=0; i<10; ++i) {
            var num = random_int(0, 256);
            var from = random_int(0, 7);
            var to = random_int(from+1, 8);
       
            // var num = 255;
            // var from = 0;
            // var to = 1;
            // straight from the spec
            var t3 = (num >> from) & ((1 << (to - from)) - 1);
            var t4 = Shade.Bits.extract_bits(num, from, to).constant_value();
            almost_equal(t3, t4, "extract_bits (" + num + ", " + from + ", " + to + ") ");
        }
    })();

    (function() {
        function convert_through_encode(t) {
            var v = Shade.Bits.encode_float(t).constant_value();
            var v1 = new ArrayBuffer(4);
            var v2 = new DataView(v1);

            // this is flipped because RGBA is stored ABGR
            for (var i=0; i<4; ++i)
                v2.setInt8(i, Math.round(v[3-i] * 255));
            return v2.getFloat32(0);
        }
        for (var i=0; i<10; ++i) {
            var t = Math.random() * 1000 - 500;
            almost_equal(t, convert_through_encode(t), "encode_float");
        }
    })();
});

test("Shade.evaluate()", function() {
    var v1 = Shade.parameter("float", 3);
    var v2 = Shade.parameter("float", 3);
    equal(v1.add(v2).evaluate(), 6);
    equal(Shade(v1).sin().cos().evaluate(), Math.cos(Math.sin(3)));
    v1.set(6);
    equal(Shade(v1).sin().cos().evaluate(), Math.cos(Math.sin(6)));
});

test("Shade.scale.*", function() {
    var t1 = Shade.Scale.ordinal({ 
        range: [Shade.color("green"),
                Shade.color("red"),
                Shade.color("blue"),
                Shade.color("black"),
                Shade.color("yellow")]});
});

module("Lux tests");
test("Lux.attribute_buffer", function() {
    ok(Lux.attribute_buffer({ vertex_array: [1,2,3,4], item_size: 1}));
    ok(Lux.attribute_buffer({ vertex_array: [1,2,3,4], item_size: 2}));
    ok(Lux.attribute_buffer({ vertex_array: [1,2,3,4,5], item_size: 1}));
    raises(function() {
        Lux.attribute_buffer({ vertex_array: [1,2,3,4,5], item_size: 2});
    });
    var x = Lux.attribute_buffer({ vertex_array: [1,2,3,4], item_size: 1});
    ok((function() {
        x.set_region(1, [1]);
        return true;
    })());
    ok((function() {
        x.set_region(2, [1,2]);
        return true;
    })());
    raises(function() {
        x.set_region(6, [1]);
    });
    raises(function() {
        x.set_region(2, [1,2,3]);
    });
});
