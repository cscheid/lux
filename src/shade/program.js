Shade.Optimizer = {};

Shade.Optimizer.debug = false;

Shade.Optimizer._debugPasses = false;

Shade.Optimizer.transformExpression = function(operations)
{
    return function(v) {
        var oldV;
        for (var i=0; i<operations.length; ++i) {
            if (Shade.debug && Shade.Optimizer._debugPasses) {
                oldV = v;
            }
            var test = operations[i][0];
            var fun = operations[i][1];
            var oldGuid = v.guid;
            if (Shade.debug && Shade.Optimizer._debugPasses) {
                console.log("Pass",operations[i][2],"starting");
            }
            if (operations[i][3]) {
                var thisOldGuid;
                do {
                    thisOldGuid = v.guid;
                    v = v.replaceIf(test, fun);
                } while (v.guid !== thisOldGuid);
            } else {
                v = v.replaceIf(test, fun);
            }
            var newGuid = v.guid;
            if (Shade.debug && Shade.Optimizer._debugPasses) {
                console.log("Pass",operations[i][2],"succeeded");
                if (oldGuid != newGuid) {
                    console.log("Before: ");
                    oldV.debugPrint();
                    console.log("After: ");
                    v.debugPrint();
                }
            }
        }
        return v;
    };
};

Shade.Optimizer.isConstant = function(exp)
{
    return exp.isConstant();
};

Shade.Optimizer.replaceWithConstant = function(exp)
{
    var v = exp.constantValue();
    var result = Shade.constant(v, exp.type);
    if (!exp.type.equals(result.type)) {
        throw new Error("Shade.constant internal error: type was not preserved");
    }
    return result;
};

Shade.Optimizer.isZero = function(exp)
{
    if (!exp.isConstant())
        return false;
    var v = exp.constantValue();
    var t = Shade.Types.typeOf(v);
    if (t.isPod())
        return v === 0;
    if (t.isVec())
        return _.all(v, function (x) { return x === 0; });
    if (t.isMat())
        return _.all(v, function (x) { return x === 0; });
    return false;
};

Shade.Optimizer.isMulIdentity = function(exp)
{
    if (!exp.isConstant())
        return false;
    var v = exp.constantValue();
    var t = Shade.Types.typeOf(v);
    if (t.isPod())
        return v === 1;
    if (t.isVec()) {
        switch (v.length) {
        case 2: return vec.equal(v, vec.make([1,1]));
        case 3: return vec.equal(v, vec.make([1,1,1]));
        case 4: return vec.equal(v, vec.make([1,1,1,1]));
        default:
            throw new Error("bad vec length: " + v.length);
        }
    }
    if (t.isMat())
        return mat.equal(v, mat[Math.sqrt(v.length)].identity());
    return false;
};

Shade.Optimizer.isTimesZero = function(exp)
{
    return exp.expressionType === 'operator*' &&
        (Shade.Optimizer.isZero(exp.parents[0]) ||
         Shade.Optimizer.isZero(exp.parents[1]));
};

Shade.Optimizer.isPlusZero = function(exp)
{
    return exp.expressionType === 'operator+' &&
        (Shade.Optimizer.isZero(exp.parents[0]) ||
         Shade.Optimizer.isZero(exp.parents[1]));
};

Shade.Optimizer.replaceWithNonzero = function(exp)
{
    if (Shade.Optimizer.isZero(exp.parents[0]))
        return exp.parents[1];
    if (Shade.Optimizer.isZero(exp.parents[1]))
        return exp.parents[0];
    throw new Error("internal error: no zero value on input to replaceWithNonzero");
};


Shade.Optimizer.isTimesOne = function(exp)
{
    if (exp.expressionType !== 'operator*')
        return false;
    var t1 = exp.parents[0].type, t2 = exp.parents[1].type;
    var ft = Shade.Types.floatT;
    if (t1.equals(t2)) {
        return (Shade.Optimizer.isMulIdentity(exp.parents[0]) ||
                Shade.Optimizer.isMulIdentity(exp.parents[1]));
    } else if (!t1.equals(ft) && t2.equals(ft)) {
        return Shade.Optimizer.isMulIdentity(exp.parents[1]);
    } else if (t1.equals(ft) && !t2.equals(ft)) {
        return Shade.Optimizer.isMulIdentity(exp.parents[0]);
    } else if (t1.isVec() && t2.isMat()) {
        return Shade.Optimizer.isMulIdentity(exp.parents[1]);
    } else if (t1.isMat() && t2.isVec()) {
        return Shade.Optimizer.isMulIdentity(exp.parents[0]);
    } else {
        throw new Error("internal error on Shade.Optimizer.isTimesOne");
    }
};

Shade.Optimizer.replaceWithNotone = function(exp)
{
    var t1 = exp.parents[0].type, t2 = exp.parents[1].type;
    var ft = Shade.Types.floatT;
    if (t1.equals(t2)) {
        if (Shade.Optimizer.isMulIdentity(exp.parents[0])) {
            return exp.parents[1];
        } else if (Shade.Optimizer.isMulIdentity(exp.parents[1])) {
            return exp.parents[0];
        } else {
            throw new Error("internal error on Shade.Optimizer.replaceWithNotone");
        }
    } else if (!t1.equals(ft) && t2.equals(ft)) {
        return exp.parents[0];
    } else if (t1.equals(ft) && !t2.equals(ft)) {
        return exp.parents[1];
    } else if (t1.isVec() && t2.isMat()) {
        return exp.parents[0];
    } else if (t1.isMat() && t2.isVec()) {
        return exp.parents[1];
    }
    throw new Error("internal error: no isMulIdentity value on input to replaceWithNotone");
};

Shade.Optimizer.replaceWithZero = function(x)
{
    if (x.type.equals(Shade.Types.floatT))
        return Shade.constant(0);
    if (x.type.equals(Shade.Types.intT))
        return Shade.asInt(0);
    if (x.type.equals(Shade.Types.vec2))
        return Shade.constant(vec2.create());
    if (x.type.equals(Shade.Types.vec3))
        return Shade.constant(vec3.create());
    if (x.type.equals(Shade.Types.vec4))
        return Shade.constant(vec4.create());
    if (x.type.equals(Shade.Types.mat2))
        return Shade.constant(mat2.create());
    if (x.type.equals(Shade.Types.mat3))
        return Shade.constant(mat3.create());
    if (x.type.equals(Shade.Types.mat4))
        return Shade.constant(mat4.create());
    throw new Error("internal error: not a type replaceable with zero");
};

Shade.Optimizer.vecAtConstantIndex = function(exp)
{
    if (exp.expressionType !== "index")
        return false;
    if (!exp.parents[1].isConstant())
        return false;
    var v = exp.parents[1].constantValue();
    if (Lux.typeOf(v) !== "number")
        return false;
    var t = exp.parents[0].type;
    if (t.equals(Shade.Types.vec2) && (v >= 0) && (v <= 1))
        return true;
    if (t.equals(Shade.Types.vec3) && (v >= 0) && (v <= 2))
        return true;
    if (t.equals(Shade.Types.vec4) && (v >= 0) && (v <= 3))
        return true;
    return false;
};

Shade.Optimizer.replaceVecAtConstantWithSwizzle = function(exp)
{
    var v = exp.parents[1].constantValue();
    if (v === 0) return exp.parents[0].swizzle("x");
    if (v === 1) return exp.parents[0].swizzle("y");
    if (v === 2) return exp.parents[0].swizzle("z");
    if (v === 3) return exp.parents[0].swizzle("w");
    throw new Error("internal error on Shade.Optimizer.replaceVecAtConstantWithSwizzle");
};

Shade.Optimizer.isLogicalAndWithConstant = function(exp)
{
    return (exp.expressionType === "operator&&" &&
            exp.parents[0].isConstant());
};

Shade.Optimizer.replaceLogicalAndWithConstant = function(exp)
{
    if (exp.parents[0].constantValue()) {
        return exp.parents[1];
    } else {
        return Shade.make(false);
    }
};

Shade.Optimizer.isLogicalOrWithConstant = function(exp)
{
    return (exp.expressionType === "operator||" &&
            exp.parents[0].isConstant());
};

Shade.Optimizer.replaceLogicalOrWithConstant = function(exp)
{
    if (exp.parents[0].constantValue()) {
        return Shade.make(true);
    } else {
        return exp.parents[1];
    }
};

Shade.Optimizer.isNeverDiscarding = function(exp)
{
    return (exp.expressionType === "discardIf" &&
            exp.parents[0].isConstant() &&
            !exp.parents[0].constantValue());
};

Shade.Optimizer.removeDiscard = function(exp)
{
    return exp.parents[1];
};

Shade.Optimizer.isKnownBranch = function(exp)
{
    var result = (exp.expressionType === "ifelse" &&
                  exp.parents[0].isConstant());
    return result;
};

Shade.Optimizer.pruneIfelseBranch = function(exp)
{
    if (exp.parents[0].constantValue()) {
        return exp.parents[1];
    } else {
        return exp.parents[2];
    }
};

// We provide saner names for program targets so users don't
// need to memorize glFragcolor, glPosition and glPointsize.
//
// However, these names should still work, in case the users
// want to have GLSL-familiar names.
Shade.canonicalizeProgramObject = function(programObj)
{
    var result = {};
    var canonicalizationMap = {
        'color': 'gl_FragColor',
        'position': 'gl_Position',
        'screenPosition': 'gl_Position',
        'pointSize': 'gl_PointSize'
    };

    _.each(programObj, function(v, k) {
        var transposedKey = (k in canonicalizationMap) ?
            canonicalizationMap[k] : k;
        result[transposedKey] = v;
    });
    return result;
};

//////////////////////////////////////////////////////////////////////////////
/*
 * Shade.program is the main procedure that compiles a Shade
 * appearance object (which is an object with fields containing Shade
 * expressions like 'position' and 'color') to a WebGL program (a pair
 * of vertex and fragment shaders). It performs a variety of optimizations and
 * program transformations to support a more uniform programming model.
 * 
 * The sequence of transformations is as follows:
 * 
 *  - An appearance object is first canonicalized (which transforms names like 
 *    color to gl_FragColor)
 * 
 *  - There are some expressions that are valid in vertex shader contexts but 
 *    invalid in fragment shader contexts, and vice-versa (eg. attributes can 
 *    only be read in vertex shaders; dFdx can only be evaluated in fragment 
 *    shaders; the discard statement can only appear in a fragment shader). 
 *    This means we must move expressions around:
 * 
 *    - expressions that can be hoisted from the vertex shader to the fragment 
 *      shader are hoisted. Currently, this only includes discardIf 
 *      statements.
 * 
 *    - expressions that must be hoisted from the fragment-shader computations 
 *      to the vertex-shader computations are hoisted. For example, WebGL 
 *      attributes can only be read on vertex shaders, and so Shade.program 
 *      introduces a varying variable to communicate the value to the fragment 
 *      shader.
 * 
 *  - At the end of this stage, some fragment-shader only expressions might 
 *    remain on vertex-shader computations. These are invalid WebGL programs and
 *    Shade.program must fail here (The canonical example is: 
 *
 *    {
 *        position: Shade.dFdx(attribute)
 *    })
 * 
 *  - After relocating expressions, vertex and fragment shaders are optimized
 *    using a variety of simple expression rewriting (constant folding, etc).
 */

Shade.program = function(programObj)
{
    programObj = Shade.canonicalizeProgramObject(programObj);
    var vpObj = {}, fpObj = {};

    _.each(programObj, function(v, k) {
        v = Shade.make(v);
        if (k === 'gl_FragColor') {
            if (!v.type.equals(Shade.Types.vec4)) {
                throw new Error("color attribute must be of type vec4, got " +
                    v.type.repr() + " instead");
            }
            fpObj.gl_FragColor = v;
        } else if (k === 'gl_Position') {
            if (!v.type.equals(Shade.Types.vec4)) {
                throw new Error("position attribute must be of type vec4, got " +
                    v.type.repr() + " instead");
            }
            vpObj.gl_Position = v;
        } else if (k === 'gl_PointSize') {
            if (!v.type.equals(Shade.Types.floatT)) {
                throw new Error("color attribute must be of type float, got " +
                    v.type.repr() + " instead");
            }
            vpObj.gl_PointSize = v;
        } else if (k.substr(0, 3) === 'gl_') {
            // FIXME: Can we sensibly work around these?
            throw new Error("gl_* are reserved GLSL names");
        } else
            vpObj[k] = v;
    });

    var vpCompile = Shade.CompilationContext(Shade.VERTEX_PROGRAM_COMPILE),
        fpCompile = Shade.CompilationContext(Shade.FRAGMENT_PROGRAM_COMPILE);

    var vpExprs = [], fpExprs = [];

    function isAttribute(x) {
        return x.expressionType === 'attribute';
    }
    function isVarying(x) {
        return x.expressionType === 'varying';
    }
    function isPerVertex(x) {
        return x.stage === 'vertex';
    }
    var varyingNames = [];
    function hoistToVarying(exp) {
        var varyingName = Shade.uniqueName();
        vpObj[varyingName] = exp;
        varyingNames.push(varyingName);
        var result = Shade.varying(varyingName, exp.type);
        if (exp._mustBeFunctionCall) {
            result._mustBeFunctionCall = true;
        }
        return result;
    }

    //////////////////////////////////////////////////////////////////////////
    // moving discard statements on vertex program to fragment program

    var shadeValuesVpObj = Shade(_.object(_.filter(
        _.pairs(vpObj), function(lst) {
            var k = lst[0], v = lst[1];
            return Lux.isShadeExpression(v);
        })));

    var vpDiscardConditions = {};
    shadeValuesVpObj = shadeValuesVpObj.replaceIf(function(x) {
        return x.expressionType === 'discardIf';
    }, function(exp) {
        vpDiscardConditions[exp.parents[1].guid] = exp.parents[1];
        return exp.parents[0];
    });

    var disallowedVertexExpressions = shadeValuesVpObj.findIf(function(x) {
        if (x.expressionType === 'builtinFunction{dFdx}') return true;
        if (x.expressionType === 'builtinFunction{dFdy}') return true;
        if (x.expressionType === 'builtinFunction{fwidth}') return true;
        return false;
    });
    if (disallowedVertexExpressions.length > 0) {
        throw "'" + disallowedVertexExpressions[0] + "' not allowed in vertex expression";
    }

    vpObj = _.object(shadeValuesVpObj.fields, shadeValuesVpObj.parents);
    vpDiscardConditions = _.values(vpDiscardConditions);

    if (vpDiscardConditions.length) {
        var vpDiscardCondition = _.reduce(vpDiscardConditions, function(a, b) {
            return a.or(b);
        }).ifelse(1, 0).gt(0);
        fpObj.gl_FragColor = fpObj.gl_FragColor.discardIf(vpDiscardCondition);
    }

    

    var commonSequence = [
        [Shade.Optimizer.isTimesZero, Shade.Optimizer.replaceWithZero, 
         "v * 0", true]
       ,[Shade.Optimizer.isTimesOne, Shade.Optimizer.replaceWithNotone, 
         "v * 1", true]
       ,[Shade.Optimizer.isPlusZero, Shade.Optimizer.replaceWithNonzero,
         "v + 0", true]
       ,[Shade.Optimizer.isNeverDiscarding,
         Shade.Optimizer.removeDiscard, "discardIf(false)"]
       ,[Shade.Optimizer.isKnownBranch,
         Shade.Optimizer.pruneIfelseBranch, "constant?a:b", true]
       ,[Shade.Optimizer.vecAtConstantIndex, 
         Shade.Optimizer.replaceVecAtConstantWithSwizzle, "vec[constantIx]"]
       ,[Shade.Optimizer.isConstant,
         Shade.Optimizer.replaceWithConstant, "constant folding"]
       ,[Shade.Optimizer.isLogicalOrWithConstant,
         Shade.Optimizer.replaceLogicalOrWithConstant, "constant||v", true]
       ,[Shade.Optimizer.isLogicalAndWithConstant,
         Shade.Optimizer.replaceLogicalAndWithConstant, "constant&&v", true]
    ];

    // explicit per-vertex hoisting must happen before isAttribute hoisting,
    // otherwise we might end up reading from a varying in the vertex program,
    // which is undefined behavior
    var fpSequence = [
        [isPerVertex, hoistToVarying, "per-vertex hoisting"],
        [isAttribute, hoistToVarying, "attribute hoisting"]  
    ];
    fpSequence.push.apply(fpSequence, commonSequence);
    var vpSequence = commonSequence;
    var fpOptimize = Shade.Optimizer.transformExpression(fpSequence);
    var vpOptimize = Shade.Optimizer.transformExpression(vpSequence);

    var usedVaryingNames = [];
    _.each(fpObj, function(v, k) {
        try {
            v = fpOptimize(v);
        } catch (e) {
            console.error("fragment program optimization crashed. This is a bug. Please send the following JSON object in the bug report:");
            console.error(JSON.stringify(v.json()));
            throw e;
        }
        usedVaryingNames.push.apply(usedVaryingNames,
                                    _.map(v.findIf(isVarying),
                                          function (v) { 
                                              return v._varyingName;
                                          }));
        fpExprs.push(Shade.set(v, k));
    });

    _.each(vpObj, function(v, k) {
        var newV;
        if ((varyingNames.indexOf(k) === -1) ||
            (usedVaryingNames.indexOf(k) !== -1)) {
            try {
                newV = vpOptimize(v);
            } catch (e) {
                console.error("vertex program optimization crashed. This is a bug. Please send the following JSON object in the bug report:");
                console.error(JSON.stringify(v.json()));
                throw e;
            }
            vpExprs.push(Shade.set(newV, k));
        }
    });

    var vpExp = Shade.seq(vpExprs);
    var fpExp = Shade.seq(fpExprs);

    vpCompile.compile(vpExp);
    fpCompile.compile(fpExp);
    var vpSource = vpCompile.source(),
        fpSource = fpCompile.source();
    if (Shade.debug) {
        if (Shade.debug && Shade.Optimizer._debugPasses) {
            console.log("Vertex program final AST:");
            vpExp.debugPrint();
        }
        console.log("Vertex program source:");
        console.log(vpSource);
        // vpExp.debugPrint();
        
        if (Shade.debug && Shade.Optimizer._debugPasses) {
            console.log("Fragment program final AST:");
            fpExp.debugPrint();
        }
        console.log("Fragment program source:");
        console.log(fpSource);
        // fpExp.debugPrint();
    }
    var result = Lux.program(vpSource, fpSource);
    result.attributeBuffers = vpExp.attributeBuffers();
    result.uniforms = _.union(vpExp.uniforms(), fpExp.uniforms());
    return result;
};
