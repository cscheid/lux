(function() {

function zipWith(f, v1, v2)
{
    return _.map(_.zip(v1, v2),
                 function(v) { return f(v[0], v[1]); });
}

function zipWith3(f, v1, v2, v3)
{
    return _.map(_.zip(v1, v2, v3),
                 function(v) { return f(v[0], v[1], v[2]); });
}

//////////////////////////////////////////////////////////////////////////////
// common functions

function builtin_glsl_function(opts)
{
    var name = opts.name;
    var type_resolving_list = opts.type_resolving_list;
    var constant_evaluator = opts.constant_evaluator;

    for (var i=0; i<type_resolving_list.length; ++i)
        for (var j=0; j<type_resolving_list[i].length; ++j) {
            var t = type_resolving_list[i][j];
            if (_.isUndefined(t))
                throw "undefined type in type_resolver";
        }
    // takes a list of lists of possible argument types, returns a function to 
    // resolve those types.
    function type_resolver_from_list(lst)
    {
        var param_length = lst[0].length - 1;
        return function() {
            if (arguments.length != param_length) {
                throw "expected " + param_length + " arguments, got "
                    + arguments.length + " instead.";
            }
            for (var i=0; i<lst.length; ++i) {
                var this_params = lst[i];
                var matched = true;
                for (var j=0; j<param_length; ++j) {
                    if (!this_params[j].equals(arguments[j].type)) {
                        matched = false;
                        break;
                    }
                }
                if (matched)
                    return this_params[param_length];
            }
            var types = _.map(_.toArray(arguments).slice(0, arguments.length),
                  function(x) { return x.type.repr(); }).join(", ");
            throw "could not find appropriate type match for (" + types + ")";
        };
    }

    var resolver = type_resolver_from_list(type_resolving_list);
    if (constant_evaluator) {
        return function() {
            var type, canon_args = [];
            for (var i=0; i<arguments.length; ++i) {
                canon_args.push(Shade.make(arguments[i]));
            }
            try {
                type = resolver.apply(this, canon_args);
            } catch (err) {
                throw "type error on " + name + ": " + err;
            }
            var obj = {
                parents: canon_args,
                type: type,
                expression_type: "builtin_function{" + name + "}",
                value: function() {
                    return [name, "(",
                            this.parents.map(function(t) { 
                                return t.evaluate(); 
                            }).join(", "),
                            ")"].join(" ");
                },
                constant_value: Shade.memoize_on_field("_constant_value", function() {
                    return constant_evaluator(this);
                })
            };
            return Shade._create_concrete_value_exp(obj);
        };
    } else {
        return function() {
            var type, canon_args = [];
            for (var i=0; i<arguments.length; ++i) {
                canon_args.push(Shade.make(arguments[i]));
            }
            try {
                type = resolver.apply(this, canon_args);
            } catch (err) {
                throw "type error on " + name + ": " + err;
            }
            return Shade._create_concrete_value_exp( {
                parents: canon_args,
                expression_type: "builtin_function{" + name + "}",
                type: type,
                value: function() {
                    return [name, "(",
                            this.parents.map(function(t) { 
                                return t.evaluate(); 
                            }).join(", "),
                            ")"].join(" ");
                },
                is_constant: function() { return false; }
            });
        };
    }
}

function common_fun_1op(fun_name, constant_evaluator) {
    return builtin_glsl_function({
        name: fun_name, 
        type_resolving_list: [
            [Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.vec4, Shade.Types.vec4]
        ], 
        constant_evaluator: constant_evaluator
    });
}

function common_fun_2op(fun_name, constant_evaluator) {
    return builtin_glsl_function({
        name: fun_name, 
        type_resolving_list: [
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4]
        ], 
        constant_evaluator: constant_evaluator
    });
}

// angle and trig, some common, some exponential,
var funcs_1op = {
    "radians": function(v) { return v * Math.PI / 180; },
    "degrees": function(v) { return v / Math.PI * 180; }, 
    "sin": Math.sin,
    "cos": Math.cos, 
    "tan": Math.tan, 
    "asin": Math.asin, 
    "acos": Math.acos, 
    "abs": Math.abs,
    "sign": function(v) { if (v < 0) return -1;
                          if (v === 0) return 0;
                          return 1;
                        }, 
    "floor": Math.floor,
    "ceil": Math.ceil,
    "fract": function(v) { return v - Math.floor(v); },
    "exp": Math.exp, 
    "log": Math.log, 
    "exp2": function(v) { return Math.exp(v * Math.log(v, 2));},
    "log2": function(v) { return Math.log(v) / Math.log(2); },
    "sqrt": Math.sqrt,
    "inversesqrt": function(v) { return 1 / Math.sqrt(v); }
};

_.each(funcs_1op, function (constant_evaluator_1, fun_name) {
    function constant_evaluator(exp) {
        if (exp.type.equals(Shade.Types.float_t))
            return constant_evaluator_1(exp.parents[0].constant_value());
        else {
            var c = exp.parents[0].constant_value();
            return vec.map(c, constant_evaluator_1);
        }
    }
    Shade[fun_name] = common_fun_1op(fun_name, constant_evaluator);
    Shade.Exp[fun_name] = function(fun) {
        return function() {
            return fun(this);
        };
    }(Shade[fun_name]);
});

function atan1_constant_evaluator(exp)
{
    var v1 = exp.parents[0].constant_value();
    if (exp.type.equals(Shade.Types.float_t))
        return Math.atan(v1);
    else {
        return vec.map(c, Math.atan);
    }
}

function common_fun_2op_constant_evaluator(fun)
{
    return function(exp){
        var v1 = exp.parents[0].constant_value();
        var v2 = exp.parents[1].constant_value();
        if (exp.type.equals(Shade.Types.float_t))
            return fun(v1, v2);
        else {
            var result = [];
            for (var i=0; i<v1.length; ++i) {
                result.push(fun(v1[i], v2[i]));
            }
            return vec.make(result);
        }
    };
}

function atan()
{
    if (arguments.length == 1) {
        return common_fun_1op("atan", atan1_constant_evaluator)(arguments[0]);
    } else if (arguments.length == 2) {
        var c = common_fun_2op_constant_evaluator(Math.atan2);
        return common_fun_2op("atan", c)(arguments[0], arguments[1]);
    } else {
        throw "atan expects 1 or 2 parameters, got " + arguments.length
        + " instead.";
    }
}

Shade.atan = atan;
Shade.Exp.atan = function() { return Shade.atan(this); };
Shade.pow = common_fun_2op("pow", common_fun_2op_constant_evaluator(Math.pow));
Shade.Exp.pow = function(other) { return Shade.pow(this, other); };

function mod_min_max_constant_evaluator(op) {
    return function(exp) {
        var values = _.map(exp.parents, function (p) {
            return p.constant_value();
        });
        if (exp.parents[0].type.equals(Shade.Types.float_t))
            return op.apply(op, values);
        else if (exp.parents[0].type.equals(Shade.Types.int_t))
            return op.apply(op, values);
        else if (exp.parents[0].type.equals(exp.parents[1].type)) {
            return vec.make(zipWith(op, values[0], values[1]));
        } else {
            return vec.map(values[0], function(v) {
                return op(v, values[1]);
            });
        }
    };
}

_.each({
    "mod": function(a,b) { return a % b; },
    "min": Math.min,
    "max": Math.max
}, function(op, k) {
    Shade[k] = builtin_glsl_function({
        name: k, 
        type_resolving_list: [
            [Shade.Types.int_t,    Shade.Types.int_t,   Shade.Types.int_t],
            [Shade.Types.float_t,  Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2,     Shade.Types.vec2,    Shade.Types.vec2],
            [Shade.Types.vec3,     Shade.Types.vec3,    Shade.Types.vec3],
            [Shade.Types.vec4,     Shade.Types.vec4,    Shade.Types.vec4],
            [Shade.Types.float_t,  Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2,     Shade.Types.float_t, Shade.Types.vec2],
            [Shade.Types.vec3,     Shade.Types.float_t, Shade.Types.vec3],
            [Shade.Types.vec4,     Shade.Types.float_t, Shade.Types.vec4]
        ], 
        constant_evaluator: mod_min_max_constant_evaluator(op)
    });
});

function clamp_constant_evaluator(exp)
{
    function clamp(v, mn, mx) {
        return Math.max(mn, Math.min(mx, v));
    }

    var e1 = exp.parents[0];
    var e2 = exp.parents[1];
    var e3 = exp.parents[2];
    var v1 = e1.constant_value();
    var v2 = e2.constant_value();
    var v3 = e3.constant_value();

    if (e1.type.equals(Shade.Types.float_t)) {
        return clamp(v1, v2, v3);
    } else if (e1.type.equals(e2.type)) {
        return vec.make(zipWith3(clamp, v1, v2, v3));
    } else {
        return vec.map(v1, function(v) {
            return clamp(v, v2, v3);
        });
    }
}

var clamp = builtin_glsl_function({
    name: "clamp", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2],
        [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3],
        [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4],
        [Shade.Types.vec2,    Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec2],
        [Shade.Types.vec3,    Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec3],
        [Shade.Types.vec4,    Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec4]], 
    constant_evaluator: clamp_constant_evaluator
});

Shade.clamp = clamp;

function mix_constant_evaluator(exp)
{
    function mix(left, right, u) {
        return (1-u) * left + u * right;
    }
    var e1 = exp.parents[0];
    var e2 = exp.parents[1];
    var e3 = exp.parents[2];
    var v1 = e1.constant_value();
    var v2 = e2.constant_value();
    var v3 = e3.constant_value();
    if (e1.type.equals(Shade.Types.float_t)) {
        return mix(v1, v2, v3);
    } else if (e2.type.equals(e3.type)) {
        return vec.make(zipWith3(mix, v1, v2, v3));
    } else {
        return vec.make(zipWith(function(v1, v2) {
            return mix(v1, v2, v3);
        }, v1, v2));
    }
}

var mix = builtin_glsl_function({ 
    name: "mix", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2],
        [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3],
        [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4],
        [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.float_t, Shade.Types.vec2],
        [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.float_t, Shade.Types.vec3],
        [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.float_t, Shade.Types.vec4]],
    constant_evaluator: mix_constant_evaluator
});
Shade.mix = mix;

var step = builtin_glsl_function({
    name: "step", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2],
        [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3],
        [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4],
        [Shade.Types.float_t, Shade.Types.vec2,    Shade.Types.vec2],
        [Shade.Types.float_t, Shade.Types.vec3,    Shade.Types.vec3],
        [Shade.Types.float_t, Shade.Types.vec4,    Shade.Types.vec4]], 
    constant_evaluator: function(exp) {
        function step(edge, x) {
            if (x < edge) return 0.0; else return 1.0;
        }
        var e1 = exp.parents[0];
        var e2 = exp.parents[1];
        var v1 = e1.constant_value();
        var v2 = e2.constant_value();
        if (e2.type.equals(Shade.Types.float_t)) {
            return step(v1, v2);
        } if (e1.type.equals(e2.type)) {
            return vec.make(zipWith(step, v1, v2));
        } else {
            return vec.map(v2, function(v) { 
                return step(v1, v);
            });
        }
    }});
Shade.step = step;

var smoothstep = builtin_glsl_function({
    name: "smoothstep", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2],
        [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3],
        [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4],
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec2,    Shade.Types.vec2],
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec3,    Shade.Types.vec3],
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec4,    Shade.Types.vec4]], 
    constant_evaluator: function(exp) {
        var edge0 = exp.parents[0];
        var edge1 = exp.parents[1];
        var x = exp.parents[2];
        var t = Shade.clamp(x.sub(edge0).div(edge1.sub(edge0)), 0, 1);
        return t.mul(t).mul(Shade.sub(3, t.mul(2))).constant_value();
    }});
Shade.smoothstep = smoothstep;

var length = builtin_glsl_function({
    name: "length", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.float_t],
        [Shade.Types.vec3,    Shade.Types.float_t],
        [Shade.Types.vec4,    Shade.Types.float_t]], 
    constant_evaluator: function(exp) {
        var v = exp.parents[0].constant_value();
        if (exp.parents[0].type.equals(Shade.Types.float_t))
            return v * v;
        else
            return vec.length(v);
    }});
Shade.length = length;

var distance = builtin_glsl_function({
    name: "distance", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.float_t],
        [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.float_t],
        [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.float_t]], 
    constant_evaluator: function(exp) {
        return exp.parents[0].sub(exp.parents[1]).length().constant_value();
    }});
Shade.distance = distance;

var dot = builtin_glsl_function({
    name: "dot", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.float_t],
        [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.float_t],
        [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.float_t]],
    constant_evaluator: function (exp) {
        var v1 = exp.parents[0].constant_value(),
            v2 = exp.parents[1].constant_value();
        if (exp.parents[0].type.equals(Shade.Types.float_t)) {
            return v1 * v2;
        } else {
            return vec.dot(v1, v2);
        }
    }});
Shade.dot = dot;

var cross = builtin_glsl_function({
    name: "cross", 
    type_resolving_list: [[Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3]], 
    constant_evaluator: function(exp) {
        return vec3.cross(exp.parents[0].constant_value(),
                          exp.parents[1].constant_value());
    }});
Shade.cross = cross;

var normalize = builtin_glsl_function({
    name: "normalize", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2, Shade.Types.vec2],
        [Shade.Types.vec3, Shade.Types.vec3],
        [Shade.Types.vec4, Shade.Types.vec4]], 
    constant_evaluator: function(exp) {
        return exp.parents[0].div(exp.parents[0].length()).constant_value();
    }});
Shade.normalize = normalize;

var faceforward = builtin_glsl_function({
    name: "faceforward", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4]], 
    constant_evaluator: function(exp) {
        var N = exp.parents[0];
        var I = exp.parents[1];
        var Nref = exp.parents[2];
        if (Nref.dot(I).constant_value() < 0)
            return N.constant_value();
        else
            return Shade.sub(0, N).constant_value();
    }});
Shade.faceforward = faceforward;

var reflect = builtin_glsl_function({
    name: "reflect", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4]], 
    constant_evaluator: function(exp) {
        var I = exp.parents[0];
        var N = exp.parents[1];
        return I.sub(Shade.mul(2, N.dot(I), N)).constant_value();
    }});
Shade.reflect = reflect;

var refract = builtin_glsl_function({
    name: "refract", 
    type_resolving_list: [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.float_t, Shade.Types.vec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.float_t, Shade.Types.vec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.float_t, Shade.Types.vec4]],
    constant_evaluator: function(exp) {
        var I = exp.parents[0];
        var N = exp.parents[1];
        var eta = exp.parents[2];
        
        var k = Shade.sub(1.0, Shade.mul(eta, eta, Shade.sub(1.0, N.dot(I).mul(N.dot(I)))));
        if (k.constant_value() < 0.0) {
            return Vector.Zero(I.type.array_size());
        } else {
            return eta.mul(I).sub(eta.mul(N.dot(I)).add(k.sqrt()).mul(N)).constant_value();
        }
    }});
Shade.refract = refract;

var texture2D = builtin_glsl_function({
    name: "texture2D", 
    type_resolving_list: [[Shade.Types.sampler2D, Shade.Types.vec2, Shade.Types.vec4]]
});
Shade.texture2D = texture2D;

Shade.equal = builtin_glsl_function({
    name: "equal", 
    type_resolving_list: [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bool_t],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bool_t],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bool_t],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bool_t],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bool_t],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bool_t],
        [Shade.Types.bvec2, Shade.Types.bvec2, Shade.Types.bool_t],
        [Shade.Types.bvec3, Shade.Types.bvec3, Shade.Types.bool_t],
        [Shade.Types.bvec4, Shade.Types.bvec4, Shade.Types.bool_t]], 
    constant_evaluator: function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return (_.all(zipWith(function (x, y) { return x === y; }),
                      left, right));
    }});
Shade.Exp.equal = function(other) { return Shade.equal(this, other); };

Shade.notEqual = builtin_glsl_function({
    name: "notEqual", 
    type_resolving_list: [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bool_t],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bool_t],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bool_t],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bool_t],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bool_t],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bool_t],
        [Shade.Types.bvec2, Shade.Types.bvec2, Shade.Types.bool_t],
        [Shade.Types.bvec3, Shade.Types.bvec3, Shade.Types.bool_t],
        [Shade.Types.bvec4, Shade.Types.bvec4, Shade.Types.bool_t]], 
    constant_evaluator: function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return !(_.all(zipWith(function (x, y) { return x === y; }),
                       left, right));
    }});
Shade.Exp.notEqual = function(other) { return Shade.notEqual(this, other); };

Shade.lessThan = builtin_glsl_function({
    name: "lessThan", 
    type_resolving_list: [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bvec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bvec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bvec4],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bvec2],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bvec3],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bvec4]], 
    constant_evaluator: function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return _.map(left, function(x, i) { return x < right[i]; });
    }});
Shade.Exp.lessThan = function(other) { return Shade.lessThan(this, other); };

Shade.lessThanEqual = builtin_glsl_function({
    name: "lessThanEqual", 
    type_resolving_list: [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bvec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bvec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bvec4],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bvec2],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bvec3],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bvec4]], 
    constant_evaluator: function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return _.map(left, function(x, i) { return x <= right[i]; });
    }});
Shade.Exp.lessThanEqual = function(other) { 
    return Shade.lessThanEqual(this, other); 
};

Shade.greaterThan = builtin_glsl_function({
    name: "greaterThan", 
    type_resolving_list: [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bvec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bvec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bvec4],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bvec2],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bvec3],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bvec4]], 
    constant_evaluator: function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return _.map(left, function(x, i) { return x > right[i]; });
    }});
Shade.Exp.greaterThan = function(other) {
    return Shade.greaterThan(this, other);
};

Shade.greaterThanEqual = builtin_glsl_function({
    name: "greaterThanEqual", 
    type_resolving_list: [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bvec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bvec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bvec4],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bvec2],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bvec3],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bvec4]], 
    constant_evaluator: function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return _.map(left, function(x, i) { return x >= right[i]; });
    }});
Shade.Exp.greaterThanEqual = function(other) {
    return Shade.greaterThanEqual(this, other);
};

Shade.all = builtin_glsl_function({
    name: "all", 
    type_resolving_list: [
        [Shade.Types.bvec2, Shade.Types.bool_t],
        [Shade.Types.bvec3, Shade.Types.bool_t],
        [Shade.Types.bvec4, Shade.Types.bool_t]], 
    constant_evaluator: function(exp) {
        var v = exp.parents[0].constant_value();
        return _.all(v, function(x) { return x; });
    }});
Shade.Exp.all = function() { return Shade.all(this); };

Shade.any = builtin_glsl_function({
    name: "any", 
    type_resolving_list: [
        [Shade.Types.bvec2, Shade.Types.bool_t],
        [Shade.Types.bvec3, Shade.Types.bool_t],
        [Shade.Types.bvec4, Shade.Types.bool_t]], 
    constant_evaluator: function(exp) {
        var v = exp.parents[0].constant_value();
        return _.any(v, function(x) { return x; });
    }});
Shade.Exp.any = function() { return Shade.any(this); };

Shade.matrixCompMult = builtin_glsl_function({
    name: "matrixCompMult", 
    type_resolving_list: [
        [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
        [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
        [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4]], 
    constant_evaluator: function(exp) {
        var v1 = exp.parents[0].constant_value();
        var v2 = exp.parents[1].constant_value();
        return mat.map(v1, function(x, i) { return x * v2[i]; });
    }}
);
Shade.Exp.matrixCompMult = function(other) {
    return Shade.matrixCompMult(this, other);
};

})();
