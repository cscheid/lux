Shade.Optimizer = {};

Shade.Optimizer.debug = false;

Shade.Optimizer._debug_passes = false;

Shade.Optimizer.transform_expression = function(operations)
{
    return function(v) {
        var old_v;
        for (var i=0; i<operations.length; ++i) {
            if (Shade.debug && Shade.Optimizer._debug_passes) {
                old_v = v;
            }
            var test = operations[i][0];
            var fun = operations[i][1];
            var old_guid = v.guid;
            if (operations[i][3]) {
                var this_old_guid;
                do {
                    this_old_guid = v.guid;
                    v = v.replace_if(test, fun);
                } while (v.guid !== this_old_guid);
            } else {
                v = v.replace_if(test, fun);
            }
            var new_guid = v.guid;
            if (Shade.debug && Shade.Optimizer._debug_passes &&
                old_guid != new_guid) {
                console.log("Pass",operations[i][2],"succeeded");
                console.log("Before: ");
                old_v.debug_print();
                console.log("After: ");
                v.debug_print();
            }
        }
        return v;
    };
};

Shade.Optimizer.is_constant = function(exp)
{
    return exp.is_constant();
};

Shade.Optimizer.replace_with_constant = function(exp)
{
    var v = exp.constant_value();
    var result = Shade.constant(v, exp.type);
    if (!exp.type.equals(result.type)) {
        throw new Error("Shade.constant internal error: type was not preserved");
    }
    return result;
};

Shade.Optimizer.is_zero = function(exp)
{
    if (!exp.is_constant())
        return false;
    var v = exp.constant_value();
    var t = Shade.Types.type_of(v);
    if (t.is_pod())
        return v === 0;
    if (t.is_vec())
        return _.all(v, function (x) { return x === 0; });
    if (t.is_mat())
        return _.all(v, function (x) { return x === 0; });
    return false;
};

Shade.Optimizer.is_mul_identity = function(exp)
{
    if (!exp.is_constant())
        return false;
    var v = exp.constant_value();
    var t = Shade.Types.type_of(v);
    if (t.is_pod())
        return v === 1;
    if (t.is_vec()) {
        switch (v.length) {
        case 2: return vec.equal(v, vec.make([1,1]));
        case 3: return vec.equal(v, vec.make([1,1,1]));
        case 4: return vec.equal(v, vec.make([1,1,1,1]));
        default:
            throw new Error("bad vec length: " + v.length);
        }
    }
    if (t.is_mat())
        return mat.equal(v, mat[Math.sqrt(v.length)].identity());
    return false;
};

Shade.Optimizer.is_times_zero = function(exp)
{
    return exp.expression_type === 'operator*' &&
        (Shade.Optimizer.is_zero(exp.parents[0]) ||
         Shade.Optimizer.is_zero(exp.parents[1]));
};

Shade.Optimizer.is_plus_zero = function(exp)
{
    return exp.expression_type === 'operator+' &&
        (Shade.Optimizer.is_zero(exp.parents[0]) ||
         Shade.Optimizer.is_zero(exp.parents[1]));
};

Shade.Optimizer.replace_with_nonzero = function(exp)
{
    if (Shade.Optimizer.is_zero(exp.parents[0]))
        return exp.parents[1];
    if (Shade.Optimizer.is_zero(exp.parents[1]))
        return exp.parents[0];
    throw new Error("internal error: no zero value on input to replace_with_nonzero");
};


Shade.Optimizer.is_times_one = function(exp)
{
    if (exp.expression_type !== 'operator*')
        return false;
    var t1 = exp.parents[0].type, t2 = exp.parents[1].type;
    var ft = Shade.Types.float_t;
    if (t1.equals(t2)) {
        return (Shade.Optimizer.is_mul_identity(exp.parents[0]) ||
                Shade.Optimizer.is_mul_identity(exp.parents[1]));
    } else if (!t1.equals(ft) && t2.equals(ft)) {
        return Shade.Optimizer.is_mul_identity(exp.parents[1]);
    } else if (t1.equals(ft) && !t2.equals(ft)) {
        return Shade.Optimizer.is_mul_identity(exp.parents[0]);
    } else if (t1.is_vec() && t2.is_mat()) {
        return Shade.Optimizer.is_mul_identity(exp.parents[1]);
    } else if (t1.is_mat() && t2.is_vec()) {
        return Shade.Optimizer.is_mul_identity(exp.parents[0]);
    } else {
        throw new Error("internal error on Shade.Optimizer.is_times_one");
    }
};

Shade.Optimizer.replace_with_notone = function(exp)
{
    var t1 = exp.parents[0].type, t2 = exp.parents[1].type;
    var ft = Shade.Types.float_t;
    if (t1.equals(t2)) {
        if (Shade.Optimizer.is_mul_identity(exp.parents[0])) {
            return exp.parents[1];
        } else if (Shade.Optimizer.is_mul_identity(exp.parents[1])) {
            return exp.parents[0];
        } else {
            throw new Error("internal error on Shade.Optimizer.replace_with_notone");
        }
    } else if (!t1.equals(ft) && t2.equals(ft)) {
        return exp.parents[0];
    } else if (t1.equals(ft) && !t2.equals(ft)) {
        return exp.parents[1];
    } else if (t1.is_vec() && t2.is_mat()) {
        return exp.parents[0];
    } else if (t1.is_mat() && t2.is_vec()) {
        return exp.parents[1];
    }
    throw new Error("internal error: no is_mul_identity value on input to replace_with_notone");
};

Shade.Optimizer.replace_with_zero = function(x)
{
    if (x.type.equals(Shade.Types.float_t))
        return Shade.constant(0);
    if (x.type.equals(Shade.Types.int_t))
        return Shade.as_int(0);
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

Shade.Optimizer.vec_at_constant_index = function(exp)
{
    if (exp.expression_type !== "index")
        return false;
    if (!exp.parents[1].is_constant())
        return false;
    var v = exp.parents[1].constant_value();
    if (lux_typeOf(v) !== "number")
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

Shade.Optimizer.replace_vec_at_constant_with_swizzle = function(exp)
{
    var v = exp.parents[1].constant_value();
    if (v === 0) return exp.parents[0].swizzle("x");
    if (v === 1) return exp.parents[0].swizzle("y");
    if (v === 2) return exp.parents[0].swizzle("z");
    if (v === 3) return exp.parents[0].swizzle("w");
    throw new Error("internal error on Shade.Optimizer.replace_vec_at_constant_with_swizzle");
};

Shade.Optimizer.is_logical_and_with_constant = function(exp)
{
    return (exp.expression_type === "operator&&" &&
            exp.parents[0].is_constant());
};

Shade.Optimizer.replace_logical_and_with_constant = function(exp)
{
    if (exp.parents[0].constant_value()) {
        return exp.parents[1];
    } else {
        return Shade.make(false);
    }
};

Shade.Optimizer.is_logical_or_with_constant = function(exp)
{
    return (exp.expression_type === "operator||" &&
            exp.parents[0].is_constant());
};

Shade.Optimizer.replace_logical_or_with_constant = function(exp)
{
    if (exp.parents[0].constant_value()) {
        return Shade.make(true);
    } else {
        return exp.parents[1];
    }
};

Shade.Optimizer.is_never_discarding = function(exp)
{
    return (exp.expression_type === "discard_if" &&
            exp.parents[0].is_constant() &&
            !exp.parents[0].constant_value());
};

Shade.Optimizer.remove_discard = function(exp)
{
    return exp.parents[1];
};

Shade.Optimizer.is_known_branch = function(exp)
{
    var result = (exp.expression_type === "ifelse" &&
                  exp.parents[0].is_constant());
    return result;
};

Shade.Optimizer.prune_ifelse_branch = function(exp)
{
    if (exp.parents[0].constant_value()) {
        return exp.parents[1];
    } else {
        return exp.parents[2];
    }
};

// We provide saner names for program targets so users don't
// need to memorize gl_FragColor, gl_Position and gl_PointSize.
//
// However, these names should still work, in case the users
// want to have GLSL-familiar names.
Shade.canonicalize_program_object = function(program_obj)
{
    var result = {};
    var canonicalization_map = {
        'color': 'gl_FragColor',
        'position': 'gl_Position',
        'screen_position': 'gl_Position',
        'point_size': 'gl_PointSize'
    };

    _.each(program_obj, function(v, k) {
        var transposed_key = (k in canonicalization_map) ?
            canonicalization_map[k] : k;
        result[transposed_key] = v;
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
 *      shader are hoisted. Currently, this only includes discard_if 
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

Shade.program = function(program_obj)
{
    program_obj = Shade.canonicalize_program_object(program_obj);
    var vp_obj = {}, fp_obj = {};

    _.each(program_obj, function(v, k) {
        v = Shade.make(v);
        if (k === 'gl_FragColor') {
            if (!v.type.equals(Shade.Types.vec4)) {
                throw new Error("color attribute must be of type vec4, got " +
                    v.type.repr() + " instead");
            }
            fp_obj.gl_FragColor = v;
        } else if (k === 'gl_Position') {
            if (!v.type.equals(Shade.Types.vec4)) {
                throw new Error("position attribute must be of type vec4, got " +
                    v.type.repr() + " instead");
            }
            vp_obj.gl_Position = v;
        } else if (k === 'gl_PointSize') {
            if (!v.type.equals(Shade.Types.float_t)) {
                throw new Error("color attribute must be of type float, got " +
                    v.type.repr() + " instead");
            }
            vp_obj.gl_PointSize = v;
        } else if (k.substr(0, 3) === 'gl_') {
            // FIXME: Can we sensibly work around these?
            throw new Error("gl_* are reserved GLSL names");
        } else
            vp_obj[k] = v;
    });

    var vp_compile = Shade.CompilationContext(Shade.VERTEX_PROGRAM_COMPILE),
        fp_compile = Shade.CompilationContext(Shade.FRAGMENT_PROGRAM_COMPILE);

    var vp_exprs = [], fp_exprs = [];

    function is_attribute(x) {
        return x.expression_type === 'attribute';
    }
    function is_varying(x) {
        return x.expression_type === 'varying';
    }
    function is_per_vertex(x) {
        return x.stage === 'vertex';
    }
    var varying_names = [];
    function hoist_to_varying(exp) {
        var varying_name = Shade.unique_name();
        vp_obj[varying_name] = exp;
        varying_names.push(varying_name);
        var result = Shade.varying(varying_name, exp.type);
        if (exp._must_be_function_call) {
            result._must_be_function_call = true;
        }
        return result;
    }

    //////////////////////////////////////////////////////////////////////////
    // moving discard statements on vertex program to fragment program

    var shade_values_vp_obj = Shade(_.object(_.filter(
        _.pairs(vp_obj), function(lst) {
            var k = lst[0], v = lst[1];
            return Lux.is_shade_expression(v);
        })));

    var vp_discard_conditions = {};
    shade_values_vp_obj = shade_values_vp_obj.replace_if(function(x) {
        return x.expression_type === 'discard_if';
    }, function(exp) {
        vp_discard_conditions[exp.parents[1].guid] = exp.parents[1];
        return exp.parents[0];
    });

    var disallowed_vertex_expressions = shade_values_vp_obj.find_if(function(x) {
        if (x.expression_type === 'builtin_function{dFdx}') return true;
        if (x.expression_type === 'builtin_function{dFdy}') return true;
        if (x.expression_type === 'builtin_function{fwidth}') return true;
        return false;
    });
    if (disallowed_vertex_expressions.length > 0) {
        throw "'" + disallowed_vertex_expressions[0] + "' not allowed in vertex expression";
    }

    vp_obj = _.object(shade_values_vp_obj.fields, shade_values_vp_obj.parents);
    vp_discard_conditions = _.values(vp_discard_conditions);

    if (vp_discard_conditions.length) {
        var vp_discard_condition = _.reduce(vp_discard_conditions, function(a, b) {
            return a.or(b);
        }).ifelse(1, 0).gt(0);
        fp_obj.gl_FragColor = fp_obj.gl_FragColor.discard_if(vp_discard_condition);
    }

    

    var common_sequence = [
        [Shade.Optimizer.is_times_zero, Shade.Optimizer.replace_with_zero, 
         "v * 0", true],
        [Shade.Optimizer.is_times_one, Shade.Optimizer.replace_with_notone, 
         "v * 1", true],
        [Shade.Optimizer.is_plus_zero, Shade.Optimizer.replace_with_nonzero,
         "v + 0", true],
        [Shade.Optimizer.is_never_discarding,
         Shade.Optimizer.remove_discard, "discard_if(false)"],
        [Shade.Optimizer.is_known_branch,
         Shade.Optimizer.prune_ifelse_branch, "constant?a:b", true],
        [Shade.Optimizer.vec_at_constant_index, 
         Shade.Optimizer.replace_vec_at_constant_with_swizzle, "vec[constant_ix]"],
        [Shade.Optimizer.is_constant,
         Shade.Optimizer.replace_with_constant, "constant folding"],
        [Shade.Optimizer.is_logical_or_with_constant,
         Shade.Optimizer.replace_logical_or_with_constant, "constant||v", true],
        [Shade.Optimizer.is_logical_and_with_constant,
         Shade.Optimizer.replace_logical_and_with_constant, "constant&&v", true]];

    // explicit per-vertex hoisting must happen before is_attribute hoisting,
    // otherwise we might end up reading from a varying in the vertex program,
    // which is undefined behavior
    var fp_sequence = [
        [is_per_vertex, hoist_to_varying, "per-vertex hoisting"],
        [is_attribute, hoist_to_varying, "attribute hoisting"]  
    ];
    fp_sequence.push.apply(fp_sequence, common_sequence);
    var vp_sequence = common_sequence;
    var fp_optimize = Shade.Optimizer.transform_expression(fp_sequence);
    var vp_optimize = Shade.Optimizer.transform_expression(vp_sequence);

    var used_varying_names = [];
    _.each(fp_obj, function(v, k) {
        try {
            v = fp_optimize(v);
        } catch (e) {
            console.error("fragment program optimization crashed. This is a bug. Please send the following JSON object in the bug report:");
            console.error(JSON.stringify(v.json()));
            throw e;
        }
        used_varying_names.push.apply(used_varying_names,
                                      _.map(v.find_if(is_varying),
                                            function (v) { 
                                                return v._varying_name;
                                            }));
        fp_exprs.push(Shade.set(v, k));
    });

    _.each(vp_obj, function(v, k) {
        var new_v;
        if ((varying_names.indexOf(k) === -1) ||
            (used_varying_names.indexOf(k) !== -1)) {
            try {
                new_v = vp_optimize(v);
            } catch (e) {
                console.error("vertex program optimization crashed. This is a bug. Please send the following JSON object in the bug report:");
                console.error(JSON.stringify(v.json()));
                throw e;
            }
            vp_exprs.push(Shade.set(new_v, k));
        }
    });

    var vp_exp = Shade.seq(vp_exprs);
    var fp_exp = Shade.seq(fp_exprs);

    vp_compile.compile(vp_exp);
    fp_compile.compile(fp_exp);
    var vp_source = vp_compile.source(),
        fp_source = fp_compile.source();
    if (Shade.debug) {
        if (Shade.debug && Shade.Optimizer._debug_passes) {
            console.log("Vertex program final AST:");
            vp_exp.debug_print();
        }
        console.log("Vertex program source:");
        console.log(vp_source);
        // vp_exp.debug_print();
        
        if (Shade.debug && Shade.Optimizer._debug_passes) {
            console.log("Fragment program final AST:");
            fp_exp.debug_print();
        }
        console.log("Fragment program source:");
        console.log(fp_source);
        // fp_exp.debug_print();
    }
    var result = Lux.program(vp_source, fp_source);
    result.attribute_buffers = vp_exp.attribute_buffers();
    result.uniforms = _.union(vp_exp.uniforms(), fp_exp.uniforms());
    return result;
};
