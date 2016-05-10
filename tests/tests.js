module("Shade tests");

var gl = Lux.init();
$("canvas").hide();

// returns a uniformly distributed random integer x such mn <= x < mx
function randomInt(mn, mx) {
    return Math.floor(Math.random() * (mx - mn)) + mn;
}

function almostEqual(expected, got, msg, eps) {
    eps = eps || 1e-4;
    if (Shade(expected).type.isVec()) {
        ok(vec.length(vec.minus(expected,  got)) < eps, msg + " expected: " + vec.str(expected) + " got: " + vec.str(got));
    } else {
        ok(Math.abs(expected - got) < eps, msg + " expected: " + expected + " got: " + got);
    }
}

test("Lux.typeOf", function() {
    expect(5);
    equal(Lux.typeOf(1), "number");
    equal(Lux.typeOf(Shade.vec(1, 2, 3)), "object");
    equal(Lux.typeOf({}), "object");
    equal(Lux.typeOf([1, 2, 3, 4]), "array");
    equal(Lux.typeOf(new Float32Array([1,2,3,4])), "object"); // this needs to be object, unfortunately, because of vec2, vec3, vec4, etc.. Sigh....
});

test("Shade types", function() {
    var x = Shade.Types.basic('float');
    expect(21);
    raises(function() {
        Shade.Types.basic('askldjasdf');
    }, function(e) {
        return e.message === "invalid basic type 'askldjasdf'";
    }, "bad basic objects should fail");
    raises(function() {
        Shade.Types.basic('vec2').swizzle('rx');
    }, function(e) {
        return e.message === "swizzle pattern 'rx' belongs to more than one group";
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
        Shade.varying("modelPos");
    }, function(e) { return e.message === "varying requires type"; });

    equal(Shade.Types.basic('vec4').isVec(),  true,  "type check methods");
    equal(Shade.Types.basic('float').isVec(), false, "type check methods");
    equal(Shade.Types.basic('mat4').isVec(),  false, "type check methods");
    equal(Shade.Types.basic('mat4').isPod(),  false, "type check methods");
    equal(Shade.Types.basic('float').isPod(), true,  "type check methods");
    raises(function() {
        var v = [];
        Shade.array(v);
    }, function(e) { 
        return e.message === "array constant must be non-empty"; 
    });
    raises(function() {
        var v = [1, false];
        Shade.array(v);
    }, function(e) {
        return e.message === "array elements must have identical types";
    });

    ok(Shade.Types.basic('vec4').elementType(0).equals(Shade.Types.floatT), "elementType");
    ok(Shade.vec(Shade.vec(3, 4), 0).type.elementType(2).equals(Shade.Types.floatT), "elementType");
    raises(function() {
        Shade.vec(Shade.vec(3, 4), true);
    }, function(e) {
        return e.message === "vec requires equal types";
    }, "bad vec construction");
    raises(function() {
        Shade.vec(Shade.vec(3, 4), 5).type.elementType(3);
    }, function(e) {
        return e.message === "invalid call: vec3 has no element 3";
    }, "out-of-bounds elementType check");

    raises(function() {
        Shade.constant(1.5).equal(Shade.asInt(3));
    }, function(e) {
        return e.message === "type error on equal: Error: could not find appropriate type match for (float, int)";
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
        return e.message === "type 'float[4]' does not support swizzling";
    }, "disallow swizzle on arrays");

    ok(Shade(Shade.id(1)).type.equals(Shade.vec(1,1,1,1).type), "Shade id is of type vec4");

    raises(function() {
        Shade.discardIf(Shade(1));
    }, function(e) {
        return e.message === "discardIf expects two parameters";
    }, "discardIf requires two parameters");

    ok(Shade.Debug.fromJson(Shade.vec(
        Shade.parameter("float", 1),
        Shade.add(Shade.varying("varying1", "float"),
                  Shade.attribute("float")),
        Shade.ifelse(Shade.lt(3, 5), Shade.mul(3, 5), Shade.vec(2,3).at(1))).json()),
       "calling json() and fromJson() on basic expressions");
});

test("Shade compilation", function() {
    ok(Shade.constant(vec.make([1,2,3,4])).glslExpression());

    function escapeRegExp(s){
      return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function findAllMatches(regex, s) {
      var matches = [];
      while(match = regex.exec(s))
        matches.push(match[1]);
      return matches;
    }

    (function () {
        var u = Shade.parameter("vec4");
        var v = u.exp();
        var c = v.cos();
        var s = v.sin();
        var cond = Shade.parameter("float").gt(0);
        var root = Shade.ifelse(cond, c, s);
        var cc = Shade.CompilationContext(Shade.vertexProgramCompile);
        cc.compile(root);


        var raw_text =
              "#extension GL_OES_standard_derivatives : enable\n" +
              " precision highp float;\n" +
              " vec4 <2> ;\n" +
              " uniform vec4 <0>;\n" +
              " uniform float <1>;\n" +
              " vec4 <3> ( ) {\n" +
              "     return  ((<1> > float(0.0))?cos ( <2> ):sin ( <2> )) ;\n" +
              "}\n" +
              " void main() {\n" +
              "      <2> = exp ( <0> ) ;\n" +
              "      <3>() ;\n" +
              " }\n";

        var pattern = escapeRegExp(raw_text).replace(/<\d>/g, '(\\w+)');
        var regex = new RegExp(pattern);

        ok(regex.test(cc.source()));

        var expected_uids = findAllMatches(/<(\d)>/g, raw_text);
        var expected_groups = _.groupBy(_.range(expected_uids.length),
                                        function(i) { return expected_uids[i]; });

        var actual_uids = cc.source().match(regex).slice(1);
        var actual_groups = _.groupBy(_.range(actual_uids.length),
                                      function(i) { return actual_uids[i]; });

        deepEqual(_.values(actual_groups).sort(), _.values(expected_groups).sort());

    })();

    raises(function () {
        Shade.program({
            gl_Position: Shade.vec(0,0,0,1),
            gl_FragColor: Shade.vec(1,1,1,1),
            gl_Nononono: Shade.vec(1,0,0,0)
        });
    }, function(e) {
        return e.message === "gl_* are reserved GLSL names";
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

    ok(_.isEqual(v1.constantValue(), v2.constantValue()));
    ok(_.isEqual(v2.constantValue(), v3));
    ok(_.isEqual(v4.constantValue(), v3.foo));
    ok(_.isEqual(v4.constantValue(), v5.constantValue()));

    var p1 = Shade.parameter("float", 1.0);
    var p2 = Shade.vec(1,0,0,1);
    var s = Shade.struct({ f: p1, v: p2 });
    
    var cc = Shade.CompilationContext(Shade.vertexProgramCompile);
    // ok(cc.compile(s("f").mul(s("v"))).source());
    // equal(cc.source(),
    //       "struct type235 {\n" +
    //       "      float f ;\n" +
    //       "      vec4 v ;\n" +
    //       " };\n" +
    //       " precision highp float;\n" +
    //       " uniform float _uniqueName3;\n" +
    //       " type235 glslName10 ;\n" +
    //       " void main() {\n" +
    //       "      glslName10 = type235 ( _uniqueName3, vec4(float(1.0), float(0.0), float(0.0), float(1.0)) ) ;\n" +
    //       "      ((glslName10.f) * (glslName10.v)) ;\n" +
    //       " }\n");

    ok(_.isEqual(Shade.Types.struct({foo: Shade.Types.vec4, bar: Shade.Types.vec4}).zero.constantValue(),
                 {foo: vec.make([0,0,0,0]), bar: vec.make([0,0,0,0])}));

    ok(_.isEqual(Shade.add(Shade.struct({foo: Shade.vec(1,2,3,4), bar: Shade.vec(4,3,2,1)}),
                           Shade.struct({bar: Shade.vec(1,2,3,4), foo: Shade.vec(4,3,2,1)})).constantValue(),
                 Shade.struct({foo: Shade.vec(5,5,5,5), bar: Shade.vec(5,5,5,5)}).constantValue()));

    // var cc2 = Shade.CompilationContext(Shade.VERTEX_PROGRAM_COMPILE);
    // cc2.compile(s.add(s));
    // console.log("BEFORE!!");
    // console.log(cc2.source());
    // console.log("AFTER!!");

    // test structs created with different field order in javascript objects:

    var s1 = Shade.struct({foo: Shade.vec(1,2,3,4), bar: Shade.vec(1,2)});
    var s2 = Shade.struct({bar: Shade.vec(1,2), foo: Shade.vec(1,2,3,4)});

    equal(s1.type.repr(), s2.type.repr());
    ok(_.isEqual(s1.parents[0].constantValue(), s2.parents[0].constantValue()));

    var s3 = Shade.struct({foo: Shade(0).asInt(),
                           bar: Shade(0)});
    var s4 = Shade.constant(s3.constantValue(), s3.type);
    equal(s3.type.repr(), s4.type.repr(), "constantValue() for structs keeps type information");

    raises(function() { 
        return Shade({a: 1, b: 2}).element(1); 
    }, "element() not supported for structs");
});

test("Shade constant folding", function() {
    equal(Shade.unknown("float").guid, Shade.unknown("float").guid);
    ok(Shade.unknown("float").guid !== Shade.unknown("mat2").guid);
    // notEqual();

    var x = Shade.parameter("float");
    equal(Shade.mul(2, Shade.vec(2, 2)).element(1).constantValue(), 4, 
          "different dimensions on float-vec operations and element()");
    equal(Shade.add(Shade.vec(2,2), 4).element(1).constantValue(), 6, 
          "different dimensions on float-vec operations and element()");
    equal(Shade.max(Shade.vec(3,1,2), 2).element(1).constantValue(), 2,
          "different dimensions on float-vec max-min-mod built-ins");
    
    equal(Shade.constant(1).constantValue(), 1);
    equal(Shade.add(4,5).constantValue(), 9);
    equal(Shade.mul(4,5).constantValue(), 20);
    ok(vec.equal(Shade.mul(Shade.vec(1,2),
                           Shade.vec(3,4)).constantValue(),
                 vec.make([3,8])),
       "constant folding");
    ok(vec.equal(Shade.mul(Shade.vec(1,2,3,4),
                            3).constantValue(),
                  vec.make([3,6,9,12])),
       "constant folding");
    ok(vec.equal(Shade.mul(Shade.mat(Shade.vec(1,0,0,0),
                                     Shade.vec(0,1,0,0),
                                     Shade.vec(0,0,1,0),
                                     Shade.vec(0,0,0,1)),
                           Shade.vec(1,2,3,4)).constantValue(),
                 vec.make([1,2,3,4])),
       "constant folding");
    ok(vec.equal(Shade.mul(Shade.mat(Shade.vec(1,0,0,0),
                                     Shade.vec(0,1,0,0),
                                     Shade.vec(0,0,1,1),
                                     Shade.vec(0,0,0,1)),
                           Shade.vec(1,2,3,4)).constantValue(),
                 vec.make([1,2,3,7])),
       "constant folding");
    var v = Shade.vec(Shade.attribute("vec2"),
                      Shade.vec(1, 2));
    equal(v.elementIsConstant(0), false, "constant element checks");
    equal(v.elementIsConstant(1), false, "constant element checks");
    equal(v.elementIsConstant(2), true, "constant element checks");
    equal(v.elementIsConstant(3), true, "constant element checks");
    equal(Shade.array([1,2,3,4,5,6]).isConstant(), false, 
          "constant checking for arrays");
    equal(Shade.array([1,2,3,4,5,6]).at(2).isConstant(), true, 
          "constant checking for array elements");
    raises(function() {
        var x = Shade.array([1,2,3,4,5]);
        var y = Shade.array([1,2,3,4,5]);
        x.eq(y);
    }, function(e) {
        return e.message === "operator== does not support arrays";
    }, "operator== does not support arrays");

    equal(Shade.mul(Shade.vec(1, Shade.attribute("vec2")),
                    Shade.vec(4, Shade.attribute("vec2"))).elementConstantValue(0),
          4, "very basic partial constant folding");

    ok(vec.equal(Shade.vec(1,2,3,4).swizzle("xyz").constantValue(),
                 vec.make([1,2,3])),
       "swizzle folding");

    ok(vec.equal(Shade.mul(Shade.mat3(Shade.mat(Shade.vec(1,0,0,0),
                                                Shade.vec(0,1,0,0),
                                                Shade.vec(0,0,1,0),
                                                Shade.vec(0,0,1,1))),
                           Shade.vec(1,2,3)).constantValue(),
                 vec.make([1,2,3])),
       "constant folding");

    equal(Shade.sin(3).constantValue(), Math.sin(3), "built-in constant folding");
    
    equal(Shade.sin(Shade.mul(2, 3)).constantValue(), Math.sin(6), "compound");

    equal(Shade.sign(Shade.cos(3)).constantValue(), -1, "sign");

    equal(Shade.radians(Shade.degrees(1)).constantValue(), 1, "radians, degrees");

    equal(Shade.sin(3).div(Shade.cos(3)).constantValue(),
          Shade.tan(3).constantValue(), "trig");

    equal(Shade.sub(1, 2).constantValue(), -1, "sub folding");
    ok(vec.equal(Shade.sub(Shade.vec(1, 2, 3),
                           Shade.vec(2, 3, 4)).constantValue(),
                 vec.make([-1,-1,-1])), "sub folding");

    ok(vec.equal(Shade.div(Shade.vec(1,2,3),
                           Shade.vec(4,5,6)).constantValue(),
                 vec.make([1/4,2/5,3/6])),
       "div folding");

    ok(vec.equal(Shade.div(Shade.vec(1,2,3), 2).constantValue(),
                 vec.make([1/2,2/2,3/2])),
       "div folding");

    equal(Shade.clamp(3, 0, 5).constantValue(), 3, "clamp folding");
    ok(vec.equal(Shade.clamp(Shade.vec(-1, 2, 3, 0.5),
                             0, 1).constantValue(),
                 vec.make([0, 1, 1, 0.5])), "clamp folding");
    ok(vec.equal(Shade.clamp(Shade.vec(-1, 3, 0.5),
                             Shade.vec(-2, 4, 0),
                             Shade.vec(-1.5, 6, 1)).constantValue(),
                 vec.make([-1.5, 4, 0.5])),
       "clamp folding");

    equal(Shade.mod(3, 2).constantValue(), 1, "mod folding");
    ok(vec.equal(Shade.mod(Shade.vec(1,2,3,4), 2).constantValue(),
                 vec.make([1,0,1,0])), "mod folding");
    ok(vec.equal(Shade.mod(Shade.vec(1,2,3,4), 
                           Shade.vec(2,3,2,3)).constantValue(),
                 vec.make([1,2,1,1])), 
       "mod folding");

    equal(Shade.mix(0, 3, 0.5).constantValue(), 1.5, "mix folding");
    ok(vec.equal(Shade.mix(Shade.vec(1, 2, 3),
                           Shade.vec(4, 5, 6), 0.5).constantValue(),
                 vec.make([2.5, 3.5, 4.5])), "mix folding");
    equal(Shade.step(0.5, -5).constantValue(), 0, "step folding");
    equal(Shade.step(0.5, 0.5).constantValue(), 1, "step folding");
    ok(vec.equal(Shade.step(1.5, Shade.vec(0,1,2,3)).constantValue(),
                 vec.make([0,0,1,1])), "step folding");
    ok(vec.equal(Shade.step(Shade.vec(1,1,1.5,1.5),
                            Shade.vec(0,1,2,3)).constantValue(),
                 vec.make([0, 1, 1, 1])), "step folding");

    equal(Shade.smoothstep(1, 2, 3).constantValue(), 1, "smoothstep folding");
    ok(vec.equal(Shade.smoothstep(Shade.vec(1, 2, 3),
                                  Shade.vec(2, 3, 4),
                                  Shade.vec(1.5, 2.5, 3.5)).constantValue(),
                 vec.make([0.5, 0.5, 0.5])), "smoothstep folding");

    equal(Shade.constant(1.5).asInt().constantValue(), 1, "asInt folding");

    equal(Shade.constant(1.5).eq(Shade.constant(1.5)).constantValue(), true,
          "comparison op folding");
    equal(Shade.constant(1.5).ne(Shade.constant(1.5)).constantValue(), false,
          "comparison op folding");
    equal(Shade.constant(1.5).le(Shade.constant(1.5)).constantValue(), true,
          "comparison op folding");
    equal(Shade.constant(1.5).lt(Shade.constant(1.5)).constantValue(), false,
          "comparison op folding");
    equal(Shade.asInt(4).ge(Shade.asInt(4)).constantValue(), true,
          "comparison op folding");
    equal(Shade.constant(1.5).gt(Shade.constant(3.5)).constantValue(), false,
          "comparison op folding");


    equal(Shade.any(Shade.greaterThan(Shade.vec(1, 2, 3),
                                      Shade.vec(0, 2, 3))).constantValue(), true,
          "relational op folding");
    equal(Shade.all(Shade.greaterThan(Shade.vec(1, 2, 3),
                                      Shade.vec(0, 2, 3))).constantValue(), false,
          "relational op folding");
    equal(Shade.all(Shade.greaterThanEqual(
        Shade.vec(1, 2, 3), Shade.vec(0, 2, 3))).constantValue(), true,
          "relational op folding");


    ok(mat.equal(Shade.mat(Shade.vec(1, 2),
                           Shade.vec(3, 4))
                 .matrixCompMult(Shade.mat(Shade.vec(2, 3),
                                           Shade.vec(4, 5))).constantValue(),
                 mat.make([2, 6, 12, 20])),
       "matrixCompMult folding");

    equal(Shade.ifelse(true, 3, 5).constantValue(), 3, "ifelse folding");
    ok(vec.equal(Shade.ifelse(Shade.lt(4, 6), 
                              Shade.vec(1,1,1,1),
                              Shade.vec(0,0,0,0)).constantValue(),
                 vec.make([1,1,1,1])),
       "ifelse folding");

    equal(Shade.sub(Shade.constant(1, Shade.Types.intT),
                    Shade.constant(2, Shade.Types.intT)).constantValue(), -1,
          "int constant folding");

    equal(Shade.add(Shade.constant(1, Shade.Types.intT),
                    Shade.constant(2, Shade.Types.intT)).constantValue(), 3,
          "int constant folding");

    equal(Shade.or(true).constantValue(), true, "single logical value");
    equal(Shade(true).discardIf(false).isConstant(), true, "discard constant folding");
    equal(Shade(false).discardIf(false).constantValue(), false, "discard constant folding");

    var tex = Shade.parameter("sampler2D");
    var texcoord = Shade.varying("fooobarasdf", "vec2");

    equal(Shade.ifelse(true,
                       Shade.ifelse(false,
                                    Shade.color('red'),
                                    Shade.texture2D(tex, texcoord)),
                       Shade.color('black')).isConstant(), false, "11052011 Marks.dots issue");

    ok(Shade.vec(1,0,0).eq(Shade.vec(0,1,0)).constantValue() === false, 
       "equality comparison on vectors");
    ok(Shade.mat(Shade.vec(1,1),
                 Shade.vec(1,1)).eq(Shade.mat(Shade.vec(1,1),
                                              Shade.vec(1,1))).constantValue() === true, 
       "equality comparison on matrices");

    //////////////////////////////////////////////////////////////////////////
    // constant folding on ifelses:
    var parameterLogical = Shade.parameter("bool"), 
        parameterFloat = Shade.parameter("float");

    ok(Shade.ifelse(parameterLogical, 3, 3).isConstant() === true,
       "ifelse isConstant() when both sides are the same");

    equal(Shade.ifelse(parameterLogical, 3, 3).constantValue(), 3,
       "ifelse constantValue() when both sides are the same");

    ok(Shade.ifelse(parameterLogical, parameterFloat, 3).isConstant() === false,
       "ifelse isConstant() when both sides are the same");

    equal(Shade.ifelse(parameterLogical, 
                       Shade.vec(parameterFloat, 5, parameterFloat, parameterFloat),
                       Shade.vec(parameterFloat, 5, parameterFloat, parameterFloat))
          .elementIsConstant(1), true,
          "ifelse elementIsConstant when both sides are the same");

    equal(Shade.ifelse(parameterLogical, 
                       Shade.vec(parameterFloat, 5, parameterFloat, parameterFloat),
                       Shade.vec(parameterFloat, 6, parameterFloat, parameterFloat))
          .elementIsConstant(1), false,
          "ifelse elementIsConstant when both sides aren't the same");

    equal(Shade.ifelse(parameterLogical, 
                       Shade.vec(parameterFloat, 5, parameterFloat, parameterFloat),
                       Shade.vec(parameterFloat, 5, parameterFloat, parameterFloat))
          .elementConstantValue(1), 5,
          "ifelse elementConstantValue when both sides are the same");

    ok(Shade.vec(Shade.max(0, 1), 1, 1).element(0).constantValue() === 1,
       "element() on built-in expressions");

    ok(Shade.add(2, Shade.vec(1, 2)).elementIsConstant(1),
       "operator elementIsConstant");

    ok(Shade.div(Shade.vec(1,2,3).swizzle("gb"),
                 Shade.mul(Shade.vec(1,2,3).swizzle("r"), 13)).elementIsConstant(1),
       "operator elementIsConstant");

    (function() {
        var m1 = Shade.mat(Shade.vec(Math.random(), Math.random()),
                           Shade.vec(Math.random(), Math.random()));
        var m2 = Shade.mat(Shade.vec(Math.random(), Math.random()),
                           Shade.vec(Math.random(), Math.random()));
        var v1 = Shade.vec(Math.random(), Math.random()),
            v2 = Shade.vec(Math.random(), Math.random());
        var s = Math.random();
        ok(Math.abs(m1.mul(v1).elementConstantValue(0) - m1.mul(v1).constantValue()[0]) < 1e-4, 
           "elementConstantValue(i) <-> element(i).constantValue() equivalence on operator* 1");
        ok(Math.abs(v1.mul(m1).elementConstantValue(0) - v1.mul(m1).constantValue()[0]) < 1e-4, 
           "elementConstantValue(i) <-> element(i).constantValue() equivalence on operator* 2");
        ok(vec.length(vec.minus(m1.mul(m2).elementConstantValue(0),
                                _.toArray(m1.mul(m2).constantValue()).slice(0, 2))) < 1e-4, 
           "elementConstantValue(i) <-> element(i).constantValue() equivalence on operator* 3");
        ok(Math.abs(v1.mul(v2).elementConstantValue(0) - v1.mul(v2).constantValue()[0]) < 1e-4,
           "elementConstantValue(i) <-> element(i).constantValue() equivalence on operator* 4");
        ok(Math.abs(v1.mul(s).elementConstantValue(0) -
                    v1.mul(s).constantValue()[0]) < 1e-4,
           "elementConstantValue(i) <-> element(i).constantValue() equivalence on operator* 5");
        ok(Math.abs(Shade.mul(s, v1).elementConstantValue(0) -
                    Shade.mul(s, v1).constantValue()[0]) < 1e-4,
           "elementConstantValue(i) <-> element(i).constantValue() equivalence on operator* 6");
    })();

    equal(Shade(2).norm().constantValue(), 2,  "norm constant evaluator");
    equal(Shade(-2).norm().constantValue(), 2, "norm constant evaluator");

    //////////////////////////////////////////////////////////////////////////
    // constant folding on elements

    equal(Shade.array([1,2,3,4]).at(1.5).constantValue(), 2,
          "array indexing with floats should cast");

    equal(Shade.max(Shade.vec(x,1,x), 2).element(1).constantValue(), 2,
          "partially-constant float-vec max-min-mod built-ins");

    equal(Shade.lessThanEqual(Shade.vec(1,2,3,4),
                              Shade.vec(4,3,2,1)).element(1).constantValue(), true,
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
            ok(Math.abs(exp.constantValue() -
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
            ok(Math.abs(exp.constantValue() -
                        _.reduce(lst, function(a, b) { return a - b; })) < 1e-4,
               "Shade.sub");
        })();
    }

    equal(Shade.div(Shade(3).asInt(), Shade(2).asInt()).constantValue(), 1);
});

test("Shade optimizer", function() {
    var parameter = Shade.parameter("vec4");
    var parameterLogical = Shade.parameter("bool");
    var parameterLogical2 = Shade.parameter("bool");
    var exp = Shade.mul(parameter, Shade.constant(0));
    equal(Shade.Optimizer.isTimesZero(exp), true, "detect times zero");

    var result = Shade.Optimizer.replaceWithZero(exp);
    equal(result.isConstant(), true, "replace times zero yields constant");
    ok(vec.equal(result.constantValue(),
                 vec.make([0,0,0,0])), "replace times zero");

    exp = Shade.mul(parameter, Shade.constant(1));
    equal(Shade.Optimizer.isTimesOne(exp), true, "detect times one");
    result = Shade.Optimizer.replaceWithNotone(exp);
    equal(result.guid, parameter.guid, "times one simplifies to original expression");

    exp = Shade.mul(Shade.constant(1), parameter);
    equal(Shade.Optimizer.isTimesOne(exp), true, "detect times one");
    result = Shade.Optimizer.replaceWithNotone(exp);
    equal(result.guid, parameter.guid, "times one simplifies to original expression");

    exp = Shade.add(Shade.constant(0), parameter);
    equal(Shade.Optimizer.isPlusZero(exp), true, "detect plus zero");
    result = Shade.Optimizer.replaceWithNonzero(exp);
    equal(result.guid, parameter.guid, "plus zero simplifies to original expression");

    exp = Shade.add(parameter, Shade.constant(0));
    equal(Shade.Optimizer.isPlusZero(exp), true, "detect plus zero");
    result = Shade.Optimizer.replaceWithNonzero(exp);
    equal(result.guid, parameter.guid, "plus zero simplifies to original expression");

    exp = Shade.mul(parameter, Shade.vec(0.5, 0.5, 0.5, 1));
    equal(Shade.Optimizer.isTimesOne(exp), false, "detect false times one");

    // There's a slight subtlety here in that vec(1,1,1,1) is identity in
    // vec(1,1,1,1) * vec4(foo), but not in vec(1,1,1,1) * 5.
    exp = Shade.mul(Shade.vec(1, 1, 1, 1), 0.5);
    equal(Shade.Optimizer.isTimesOne(exp), false, "detect false times one");

    var identity = Shade.mat(Shade.vec(1, 0, 0, 0),
                             Shade.vec(0, 1, 0, 0),
                             Shade.vec(0, 0, 1, 0),
                             Shade.vec(0, 0, 0, 1));
    equal(Shade.Optimizer.isMulIdentity(identity), true, "detect multiplicative identity");

    exp = Shade.mul(identity,
                    Shade.vec(1,1,1,1));
    equal(Shade.Optimizer.isTimesOne(exp), true, "detect heterogenous times one");

    equal(Shade.Optimizer.isLogicalOrWithConstant(
        Shade.or(true, parameterLogical)), true, "detect true || x");

    ok(parameterLogical.guid !== undefined, "parameterLogical has guid");
    equal(Shade.Optimizer.replaceLogicalOrWithConstant(
        Shade.or(false, parameterLogical)).guid, parameterLogical.guid, "optimize false || x");
    equal(Shade.Optimizer.replaceLogicalOrWithConstant(
        Shade.or(true, parameterLogical)).constantValue(), true, "optimize true || x");

    equal(Shade.Optimizer.replaceLogicalAndWithConstant(
        Shade.and(true, parameterLogical)).guid, parameterLogical.guid, "optimize true && x");
    equal(Shade.Optimizer.replaceLogicalAndWithConstant(
        Shade.and(false, parameterLogical)).constantValue(), false, "optimize false && x");

    equal(Shade.Optimizer.isKnownBranch(
        Shade.ifelse(true, parameterLogical, parameterLogical2)), true, "detect known branch");
    equal(Shade.Optimizer.pruneIfelseBranch(
        Shade.ifelse(true, parameterLogical, parameterLogical2)).guid, 
          parameterLogical.guid, "optimize known branch");
    equal(Shade.Optimizer.pruneIfelseBranch(
        Shade.ifelse(false, parameterLogical, parameterLogical2)).guid, 
          parameterLogical2.guid, "optimize known branch");

    ok(vec4.equal(Shade.mul(Shade.translation(Shade.vec(0,0,0)),
                            Shade.vec(1, 0)).constantValue(),
                  vec4.make([1,0,0,1])),
       "Shade mat4 * vec2 shortcuts");
    ok(vec4.equal(Shade.mul(Shade.translation(Shade.vec(0,0,0)),
                            Shade.vec(1, 0, 2)).constantValue(),
                  vec4.make([1,0,2,1])),
       "Shade mat4 * vec3 shortcuts");
});

test("Shade programs", function() {
    ok(Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1)
    }), "Basic program");

    raises(function() {
        Shade.program({
            position: Shade.dFdx(Shade.attribute("vec4"))
        });
    }, "'builtinFunction{dFdx}' not allowed in vertex expression");
});

test("Shade loops", function() {
    var from = Shade.asInt(0), to = Shade.asInt(10);
    var range = Shade.range(from, to);

    Shade.debug = true;

    ok(Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1),
        pointSize: range.sum().asFloat()
    }), "program with sum");
    ok(Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1),
        pointSize: range.average()
    }), "program with average");

    ok(Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1),
        pointSize: range
            .transform(function (x) { return x.asFloat(); })
            .fold(function(i, j) { return Shade.min(i, j); }, 1000)
                  // Shade.constant(1000).asInt())
    }), "program with fold");

    var p = Shade.program({
        color: Shade.vec(1,1,1,1),
        position: Shade.vec(1,1,1,1),
        pointSize: Shade.range(from, to).average()
    });
    ok(p, "Basic looping program");
});

test("Texture tables", function() {
    var simpleData = {
        numberColumns: [0, 1, 2],
        columns: [0, 1, 2],
        data: [ { 0: 0, 1: 1, 2: 2 },
                { 0: 3, 1: 4, 2: 5 },
                { 0: 6, 1: 7, 2: 8 } ]
    };
    var table = Lux.Data.textureTable(Lux.Data.table(simpleData));

    for (var rowIx=0; rowIx<3; ++rowIx) {
        for (var colIx=0; colIx<3; ++colIx) {
            var linearIndex = rowIx * 3 + colIx;
            var texelIndex = Math.floor(linearIndex / 4);
            var texelOffset = linearIndex % 4;
            var texY = Math.floor(texelIndex / 2);
            var texX = texelIndex % 2;
            ok(vec.equal(table.index(rowIx, colIx).constantValue(),
                         vec.make([texX, texY, texelOffset])));
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
        var shadeSource  = Shade.Colors.shadetable[source].create(v1, v2, v3);
        var jsSource     = Shade.Colors.jstable[source].create(v1, v2, v3);
        
        var shadeTarget  = shadeSource[target]();
        var jsTarget     = jsSource[target]();

        var shadeSource2 = shadeTarget[source]();
        var jsSource2    = jsTarget[source]();

        if (!match(shadeSource2, shadeSource, tol)) {
            console.log("source",  shadeSource,shadeSource.values(),  jsSource,jsSource.values());
            console.log("target",  shadeTarget,shadeTarget.values(),  jsTarget,jsTarget.values());
            console.log("source2", shadeSource2,shadeSource2.values(), jsSource2,jsSource2.values());
            console.log("---");
        };

        ok(match(shadeSource, jsSource, tol), "constructors match");
        ok(match(shadeTarget, jsTarget, tol), source + "->" + target + " match");
        ok(match(shadeSource2, jsSource2, tol), source+"->"+target+"->"+source + " match");
        ok(match(shadeSource, shadeSource2, tol), source+"->"+target+"->"+source+" inverse shade");
        ok(match(jsSource, jsSource2, tol), source+"->"+target+"->"+source+" inverse js");
    }

    var testCount = 10;

    for (var i=0; i<testCount; ++i) {
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
            var t2 = Shade.Bits.shiftLeft(1, t).constantValue();
            var t3 = Shade.Bits.shiftRight(t1, t).constantValue();
            almostEqual(t1, t2, "shift left");
            almostEqual(1, t3, "shift right (" + t + " " + t1 + ") ");
        }
        for (i=0; i<10; ++i) {
            var v = randomInt(0, 65536);
            var amt = randomInt(0, 16);
            var t1 = v >> amt;
            var t2 = Shade.Bits.shiftRight(v, amt).constantValue(); 
            almostEqual(t1, t2, "shift right (" + v + ", " + amt + ")");
        }
    })();

    (function() {
        for (var i=0; i<10; ++i) {
            var v = randomInt(0, 65536);
            var bits = randomInt(0, 16);

            // straight from the spec
            var t3 = v % (1 << bits);
            var t4 = Shade.Bits.maskLast(v, bits).constantValue();
            almostEqual(t3, t4, "maskLast (" + v + ", " + bits + ")");
        }
    })();

    (function() {
        for (var i=0; i<10; ++i) {
            var num = randomInt(0, 256);
            var from = randomInt(0, 7);
            var to = randomInt(from+1, 8);
       
            // var num = 255;
            // var from = 0;
            // var to = 1;
            // straight from the spec
            var t3 = (num >> from) & ((1 << (to - from)) - 1);
            var t4 = Shade.Bits.extractBits(num, from, to).constantValue();
            almostEqual(t3, t4, "extractBits (" + num + ", " + from + ", " + to + ") ");
        }
    })();

    (function() {
        function convertThroughEncode(t) {
            var v = Shade.Bits.encodeFloat(t).constantValue();
            var v1 = new ArrayBuffer(4);
            var v2 = new DataView(v1);

            // this is flipped because RGBA is stored ABGR
            for (var i=0; i<4; ++i)
                v2.setInt8(i, Math.round(v[3-i] * 255));
            return v2.getFloat32(0);
        }
        for (var i=0; i<10; ++i) {
            var t = Math.random() * 1000 - 500;
            almostEqual(t, convertThroughEncode(t), "encodeFloat");
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
test("Lux.attributeBuffer", function() {
    ok(Lux.attributeBuffer({ vertexArray: [1,2,3,4], itemSize: 1}));
    ok(Lux.attributeBuffer({ vertexArray: [1,2,3,4], itemSize: 2}));
    ok(Lux.attributeBuffer({ vertexArray: [1,2,3,4,5], itemSize: 1}));
    raises(function() {
        Lux.attributeBuffer({ vertexArray: [1,2,3,4,5], itemSize: 2});
    });
    var x = Lux.attributeBuffer({ vertexArray: [1,2,3,4], itemSize: 1});
    ok((function() {
        x.setRegion(1, [1]);
        return true;
    })());
    ok((function() {
        x.setRegion(2, [1,2]);
        return true;
    })());
    raises(function() {
        x.setRegion(6, [1]);
    });
    raises(function() {
        x.setRegion(2, [1,2,3]);
    });
});

test("Shade functions", function() {
    equals(Shade.add(function(a) { return a.div(2); },
                     function(b) { return b.div(3); })(3).evaluate(), 2.5);
    equals(JSON.stringify(
        Shade.add(function(a) { return {a: 1, b: a}; },
                  function(b) { return {a: 2, b: b}; })(1).evaluate()), 
           JSON.stringify({a: 3, b: 2}));
    equals(JSON.stringify(
        Shade(function(a) { return {a: 1, b: a}; })
            .add(function(b) { return {a: 2, b: b}; })(1).evaluate()), 
           JSON.stringify({a: 3, b: 2}));

    equals(Shade.sub(function(a) { return a.div(2); },
                     function(b) { return b.div(3); })(3).evaluate(), 0.5);
    equals(JSON.stringify(
        Shade.sub(function(a) { return {a: 1, b: a}; },
                  function(b) { return {a: 2, b: b}; })(1).evaluate()), 
           JSON.stringify({a: -1, b: 0}));
    equals(JSON.stringify(
        Shade(function(a) { return {a: 1, b: a}; })
            .sub(function(b) { return {a: 2, b: b}; })(1).evaluate()), 
           JSON.stringify({a: -1, b: 0}));

    equals(Shade.mul(function(a) { return a.div(2); },
                     function(b) { return b.div(3); })(3).evaluate(), 1.5);
    equals(Shade.div(function(a) { return a.div(6); },
                     function(b) { return b.div(3); })(3).evaluate(), 0.5);

});
