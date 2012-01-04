Shade.Optimizer = {};

Shade.Optimizer.transform_expression = function(operations)
{
    return function(v) {
        var old_v;
        for (var i=0; i<operations.length; ++i) {
            if (Shade.debug) {
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
            if (Shade.debug && old_guid != new_guid) {
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
    return result;
};

Shade.Optimizer.is_zero = function(exp)
{
    if (!exp.is_constant())
        return false;
    var v = exp.constant_value();
    var t = constant_type(v);
    if (t === 'number')
        return v === 0;
    if (t === 'vector')
        return _.all(v, function (x) { return x === 0; });
    if (typeof(v) === 'matrix')
        return _.all(v, function (x) { return x === 0; });
    return false;
};

Shade.Optimizer.is_mul_identity = function(exp)
{
    if (!exp.is_constant())
        return false;
    var v = exp.constant_value();
    var t = constant_type(v);
    if (t === 'number')
        return v === 1;
    if (t === 'vector') {
        switch (v.length) {
        case 2: return vec.equal(v, vec.make([1,1]));
        case 3: return vec.equal(v, vec.make([1,1,1]));
        case 4: return vec.equal(v, vec.make([1,1,1,1]));
        default:
            throw "Bad vec length: " + v.length;    
        }
    }
    if (t === 'matrix')
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
    throw "no zero value on input to replace_with_nonzero?!";
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
        throw "Internal error, never should have gotten here";
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
            throw "Intenal error, never should have gotten here";
        }
    } else if (!t1.equals(ft) && t2.equals(ft)) {
        return exp.parents[0];
    } else if (t1.equals(ft) && !t2.equals(ft)) {
        return exp.parents[1];
    }
    throw "no is_mul_identity value on input to replace_with_notone?!";
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
    throw "not a type replaceable with zero!?";
};

Shade.Optimizer.vec_at_constant_index = function(exp)
{
    if (exp.expression_type !== "index")
        return false;
    if (!exp.parents[1].is_constant())
        return false;
    var v = exp.parents[1].constant_value();
    if (typeOf(v) !== "number")
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
    if (v == 0) return exp.parents[0].swizzle("x");
    if (v == 1) return exp.parents[0].swizzle("y");
    if (v == 2) return exp.parents[0].swizzle("z");
    if (v == 3) return exp.parents[0].swizzle("w");
    throw "Internal error, shouldn't get here";
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
    var result = (exp.expression_type === "selection" &&
                  exp.parents[0].is_constant());
    return result;
};

Shade.Optimizer.prune_selection_branch = function(exp)
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
        'point_size': 'gl_PointSize'
    };

    _.each(program_obj, function(v, k) {
        var transposed_key = (k in canonicalization_map) ?
            canonicalization_map[k] : k;
        result[transposed_key] = v;
    });
    return result;
};

Shade.program = function(program_obj)
{
    program_obj = Shade.canonicalize_program_object(program_obj);
    var vp_obj = {}, fp_obj = {};

    _.each(program_obj, function(v, k) {
        v = Shade.make(v);
        if (k === 'gl_FragColor') {
            if (!v.type.equals(Shade.Types.vec4)) {
                throw "Shade.program: color attribute must be of type vec4, got " +
                    v.type.repr() + " instead.";
            }
            fp_obj['gl_FragColor'] = v;
        } else if (k === 'gl_Position') {
            if (!v.type.equals(Shade.Types.vec4)) {
                throw "Shade.program: position attribute must be of type vec4, got " +
                    v.type.repr() + " instead.";
            }
            vp_obj['gl_Position'] = v;
        } else if (k === 'gl_PointSize') {
            if (!v.type.equals(Shade.Types.float_t)) {
                throw "Shade.program: color attribute must be of type float, got " +
                    v.type.repr() + " instead.";
            }
            vp_obj['gl_PointSize'] = v;
        } else if (k.substr(0, 3) === 'gl_') {
            // FIXME: Can we sensibly work around these?
            throw "gl_* are reserved GLSL names, sorry; you can't use them in Facet.";
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
        return Shade.varying(varying_name, exp.type);
    };

    // explicit per-vertex hoisting must happen before is_attribute hoisting,
    // otherwise we might end up reading from a varying in the vertex program,
    // which is undefined behavior

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
         Shade.Optimizer.prune_selection_branch, "constant?a:b", true],
        [Shade.Optimizer.vec_at_constant_index, 
         Shade.Optimizer.replace_vec_at_constant_with_swizzle, "vec[constant_ix]"],
        [Shade.Optimizer.is_constant,
         Shade.Optimizer.replace_with_constant, "constant folding"],
        [Shade.Optimizer.is_logical_or_with_constant,
         Shade.Optimizer.replace_logical_or_with_constant, "constant||v", true],
        [Shade.Optimizer.is_logical_and_with_constant,
         Shade.Optimizer.replace_logical_and_with_constant, "constant&&v", true]];

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
        v = fp_optimize(v);
        used_varying_names.push.apply(used_varying_names,
                                      _.map(v.find_if(is_varying),
                                            function (v) { 
                                                return v.eval();
                                            }));
        fp_exprs.push(Shade.set(v, k));
    });

    _.each(vp_obj, function(v, k) {
        if ((varying_names.indexOf(k) === -1) ||
            (used_varying_names.indexOf(k) !== -1))
            vp_exprs.push(Shade.set(vp_optimize(v), k));
    });

    var vp_exp = Shade.seq(vp_exprs);
    var fp_exp = Shade.seq(fp_exprs);

    vp_compile.compile(vp_exp);
    fp_compile.compile(fp_exp);
    var vp_source = vp_compile.source(),
        fp_source = fp_compile.source();
    if (Shade.debug) {
        console.log("Vertex program final AST:");
        vp_exp.debug_print();
        console.log("Vertex program source:");
        console.log(vp_source);
        console.log("Fragment program final AST:");
        fp_exp.debug_print();
        console.log("Fragment program source:");
        console.log(fp_source);
    }
    var result = Facet.program(vp_source, fp_source);
    result.attribute_buffers = vp_exp.attribute_buffers();
    result.uniforms = _.union(vp_exp.uniforms(), fp_exp.uniforms());
    return result;
};
