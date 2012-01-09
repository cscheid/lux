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
// - a GLSL matrix of dimensions 2x2, 3x3, 4x4 (Facet currently does not support GLSL rectangular matrices):
//    Shade.constant(2, mat.make([1, 0, 0, 1]));
// - An array of constant values of the same type:
//    Shade.constant([2, 3, 4, 5, 6]);

Shade.constant = function(v, type)
{
    var mat_length_to_dimension = {16: 4, 9: 3, 4: 2, 1: 1};

    var constant_tuple_fun = function(type, args)
    {
        function to_glsl(type, args) {
            // FIXME this seems incredibly ugly, but we need something
            // like it, so that numbers are appropriately promoted to floats
            // in GLSL's syntax.

            var string_args = _.map(args, function(arg) {
                var v = String(arg);
                if (v.indexOf(".") === -1) {
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
            eval: function(glsl_name) {
                return to_glsl(this.type.repr(), args);
            },
            expression_type: "constant{" + args + "}",
            is_constant: function() { return true; },
            element: Shade.memoize_on_field("_element", function(i) {
                if (this.type.is_pod()) {
                    if (i === 0)
                        return this;
                    else
                        throw "float is an atomic type, got this: " + i;
                } if (this.type.is_vec()) {
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
                        throw "float is an atomic type";
                } if (this.type.is_vec()) {
                    return args[i];
                }
                return vec[this.type.array_size()].make(matrix_row(i));
            }),
            constant_value: Shade.memoize_on_field("_constant_value", function() {
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
                    throw "internal error: constant of unknown type";
            }),
            compile: function(ctx) {},
            parents: [],
            type: type
        });
    };

    var t = facet_constant_type(v);
    if (t === 'other') {
        t = facet_typeOf(v);
        if (t === 'array') {
            var new_v = v.map(Shade.make);
            var array_size = new_v.length;
            if (array_size == 0) {
                throw "array constant must be non-empty";
            }

            var new_types = new_v.map(function(t) { return t.type; });
            var array_type = Shade.array(new_types[0], array_size);
            if (_.any(new_types, function(t) { return !t.equals(new_types[0]); })) {
                throw "array elements must have identical types";
            }
            if (_.any(new_v, function(el) { return !el.is_constant(); })) {
                throw "constant array elements must be constant as well";
            }
            return Shade._create_concrete_exp( {
                parents: new_v,
                type: array_type,
                expression_type: "constant",
                eval: function() { return this.glsl_name; },
                compile: function (ctx) {
                    this.array_initializer_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.glsl_name), ";\n");
                    ctx.strings.push("void", this.array_initializer_glsl_name, "(void) {\n");
                    for (var i=0; i<this.parents.length; ++i) {
                        ctx.strings.push("    ", this.glsl_name, "[", i, "] =",
                                         this.parents[i].eval(), ";\n");
                    };
                    ctx.strings.push("}\n");
                    ctx.add_initialization(this.array_initializer_glsl_name + "()");
                },
                is_constant: function() { return true; },
                element: function(i) {
                    return this.parents[i];
                },
                element_is_constant: function(i) {
                    return this.parents[i].is_constant();
                },
                element_constant_value: function(i) {
                    return this.parents[i].constant_value();
                }
            });
        } else {
            throw "type error: constant should be bool, number, vector, matrix or array. got " + t
            + " instead";
        }
    }
    if (t === 'number') {
        if (type && !(type.equals(Shade.Types.float_t) ||
                      type.equals(Shade.Types.int_t))) {
            throw ("expected specified type for numbers to be float or int," +
                   " got " + type.repr() + " instead.");
        }
        return constant_tuple_fun(type || Shade.Types.float_t, [v]);
    }
    if (t === 'boolean') {
        if (type && !type.equals(Shade.Types.bool_t))
            throw ("boolean constants cannot be interpreted as " + 
                   type.repr());
        return constant_tuple_fun(Shade.Types.bool_t, [v]);
    }
    if (t === 'vector') {
        var d = v.length;
        if (d < 2 && d > 4)
            throw "invalid length for constant vector: " + v;
        var el_ts = _.map(v, function(t) { return facet_typeOf(t); });
        if (!_.all(el_ts, function(t) { return t === el_ts[0]; })) {
            throw "not all constant params have the same types";
        }
        if (el_ts[0] === "number") {
            var computed_t = Shade.basic('vec' + d);
            if (type && !computed_t.equals(type)) {
                throw "passed constant must have type " + computed_t.repr()
                    + ", but was request to have incompatible type " 
                    + type.repr();
            }
            return constant_tuple_fun(computed_t, v);
        }
        else
            throw "bad datatype for constant: " + el_ts[0];
    }
    if (t === 'matrix') {
        var d = mat_length_to_dimension[v.length];
        var computed_t = Shade.basic('mat' + d);
        if (type && !computed_t.equals(type)) {
            throw "passed constant must have type " + computed_t.repr()
                + ", but was request to have incompatible type " 
                + type.repr();
        }
        return constant_tuple_fun(computed_t, v);
    }
    throw "internal error: facet_constant_type returned bogus value";
};

Shade.as_int = function(v) { return Shade.make(v).as_int(); };
Shade.as_bool = function(v) { return Shade.make(v).as_bool(); };
Shade.as_float = function(v) { return Shade.make(v).as_float(); };

