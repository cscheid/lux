// Shade.constant creates a constant value in the Shade language.
// 
// This value can be one of:
// - a single float: 
//    Shade.constant(1)
//    Shade.constant(3.0, Shade.Types.float_t)
// - a single integer:
//    Shade.constant(1, Shade.Types.int_t)
// - a boolean:
//    Shade.constant(false);
// - a GLSL vec2, vec3 or vec4 (of floating point values):
//    Shade.constant(2, vec.make([1, 2]));
// - a GLSL matrix of dimensions 2x2, 3x3, 4x4 (Lux currently does not support GLSL rectangular matrices):
//    Shade.constant(2, mat.make([1, 0, 0, 1]));
// - an array
// - a struct

Shade.constant = function(v, type)
{
    var mat_length_to_dimension = {16: 4, 9: 3, 4: 2, 1: 1};

    var constant_tuple_fun = function(type, args)
    {
        function to_glsl(type, args) {
            // this seems incredibly ugly, but we need something
            // like it, so that numbers are appropriately promoted to floats
            // in GLSL's syntax.

            var string_args = _.map(args, function(arg) {
                var v = String(arg);
                if (lux_typeOf(arg) === "number" && v.indexOf(".") === -1) {
                    return v + ".0";
                } else
                    return v;
            });
            return type + '(' + _.toArray(string_args).join(', ') + ')';
        }

        function matrix_row(i) {
            var sz = type.array_size();
            var result = [];
            for (var j=0; j<sz; ++j) {
                result.push(args[i + j*sz]);
            }
            return result;
        }

        return Shade._create_concrete_exp( {
            glsl_expression: function(glsl_name) {
                return to_glsl(this.type.repr(), args);
            },
            expression_type: "constant{" + args + "}",
            is_constant: function() { return true; },
            element: Shade.memoize_on_field("_element", function(i) {
                if (this.type.is_pod()) {
                    if (i === 0)
                        return this;
                    else
                        throw new Error(this.type.repr() + " is an atomic type, got this: " + i);
                } else if (this.type.is_vec()) {
                    return Shade.constant(args[i]);
                } else {
                    return Shade.vec.apply(matrix_row(i));
                }
            }),
            element_is_constant: function(i) {
                return true;
            },
            element_constant_value: Shade.memoize_on_field("_element_constant_value", function(i) {
                if (this.type.equals(Shade.Types.float_t)) {
                    if (i === 0)
                        return args[0];
                    else
                        throw new Error("float is an atomic type");
                } if (this.type.is_vec()) {
                    return args[i];
                }
                return vec[this.type.array_size()].make(matrix_row(i));
            }),
            evaluate: Shade.memoize_on_guid_dict(function(cache) {
                // FIXME boolean_vector
                if (this.type.is_pod())
                    return args[0];
                if (this.type.equals(Shade.Types.vec2) ||
                    this.type.equals(Shade.Types.vec3) ||
                    this.type.equals(Shade.Types.vec4))
                    return vec[args.length].make(args);
                if (this.type.equals(Shade.Types.mat2) ||
                    this.type.equals(Shade.Types.mat3) ||
                    this.type.equals(Shade.Types.mat4))
                    return mat[mat_length_to_dimension[args.length]].make(args);
                else
                    throw new Error("internal error: constant of unknown type");
            }),
            compile: function(ctx) {},
            parents: [],
            type: type
        });
    };

    // FIXME refactor this since type_of result is now a Shade.Types.*
    var t = Shade.Types.type_of(v);
    var d, computed_t;
    if (t.equals(Shade.Types.float_t)) {
        if (type && !(type.equals(Shade.Types.float_t) ||
                      type.equals(Shade.Types.int_t))) {
            throw new Error("expected specified type for numbers to be float or int," +
                   " got " + type.repr() + " instead.");
        }
        return constant_tuple_fun(type || Shade.Types.float_t, [v]);
    } else if (t.equals(Shade.Types.bool_t)) {
        if (type && !type.equals(Shade.Types.bool_t))
            throw new Error("boolean constants cannot be interpreted as " + 
                   type.repr());
        return constant_tuple_fun(Shade.Types.bool_t, [v]);
    } else if (t.repr().substr(0,3) === 'vec') {
        d = v.length;
        if (d < 2 && d > 4)
            throw new Error("invalid length for constant vector: " + v);
        var el_ts = _.map(v, function(t) { return lux_typeOf(t); });
        if (!_.all(el_ts, function(t) { return t === el_ts[0]; })) {
            throw new Error("not all constant params have the same types");
        }
        if (el_ts[0] === "number") {
            computed_t = Shade.Types['vec' + d];
            if (type && !computed_t.equals(type)) {
                throw new Error("passed constant must have type " + computed_t.repr()
                    + ", but was request to have incompatible type " 
                    + type.repr());
            }
            return constant_tuple_fun(computed_t, v);
        }
        else
            throw new Error("bad datatype for constant: " + el_ts[0]);
    } else if (t.repr().substr(0,3) === 'mat') {
        d = mat_length_to_dimension[v.length];
        computed_t = Shade.Types['mat' + d];
        if (type && !computed_t.equals(type)) {
            throw new Error("passed constant must have type " + computed_t.repr()
                            + ", but was requested to have incompatible type " 
                            + type.repr());
        }
        return constant_tuple_fun(computed_t, v);
    } else if (type.is_struct()) {
        var obj = {};
        _.each(v, function(val, k) {
            obj[k] = Shade.constant(val, type.fields[k]);
        });
        return Shade.struct(obj);
    } else {
        throw new Error("type error: constant should be bool, number, vector, matrix, array or struct. got " + t
                        + " instead");
    }
    throw new Error("internal error: Shade.Types.type_of returned bogus value");
};

Shade.as_int = function(v) { return Shade.make(v).as_int(); };
Shade.as_bool = function(v) { return Shade.make(v).as_bool(); };
Shade.as_float = function(v) { return Shade.make(v).as_float(); };
