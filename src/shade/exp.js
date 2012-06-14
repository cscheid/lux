Shade.Exp = {
    debug_print: function(do_what) {
        var lst = [];
        var refs = {};
        function _debug_print(which, indent) {
            var i;
            var str = new Array(indent+2).join(" "); // This is python's '" " * indent'
            // var str = "";
            // for (var i=0; i<indent; ++i) { str = str + ' '; }
            if (which.parents.length === 0) 
                lst.push(str + "[" + which.expression_type + ":" + which.guid + "]"
                            // + "[is_constant: " + which.is_constant() + "]"
                            + " ()");
            else {
                lst.push(str + "[" + which.expression_type + ":" + which.guid + "]"
                            // + "[is_constant: " + which.is_constant() + "]"
                            + " (");
                for (i=0; i<which.parents.length; ++i) {
                    if (refs[which.parents[i].guid])
                        lst.push(str + "  {{" + which.parents[i].guid + "}}");
                    else {
                        _debug_print(which.parents[i], indent + 2);
                        refs[which.parents[i].guid] = 1;
                    }
                }
                lst.push(str + ')');
            }
        };
        _debug_print(this, 0);
        do_what = do_what || function(l) {
            var s = l.join("\n");
            console.log(s);
        };
        do_what(lst);
    },
    evaluate: function() {
        return this.glsl_name + "()";
    },
    parent_is_unconditional: function(i) {
        return true;
    },
    propagate_conditions: function() {
        // the condition for an execution of a node is the
        // disjunction of the conjunction of all its children and their respective
        // edge conditions
        for (var i=0; i<this.parents.length; ++i)
            this.parents[i].is_unconditional = (
                this.parents[i].is_unconditional ||
                    (this.is_unconditional && 
                     this.parent_is_unconditional(i)));

    },
    set_requirements: function() {},
    // if stage is "vertex" then this expression will be hoisted to the vertex shader
    stage: null,
    // returns all sub-expressions in topologically-sorted order
    sorted_sub_expressions: Shade.memoize_on_field("_sorted_sub_expressions", function() {
        var so_far = [];
        var visited_guids = [];
        var topological_sort_internal = function(exp) {
            var guid = exp.guid;
            if (visited_guids[guid]) {
                return;
            }
            var parents = exp.parents;
            var i = parents.length;
            while (i--) {
                topological_sort_internal(parents[i]);
            }
            // for (var i=0; i<l; ++i) {
            // }
            so_far.push(exp);
            visited_guids[guid] = true;
        };
        topological_sort_internal(this);
        return so_far;
    }),

    //////////////////////////////////////////////////////////////////////////
    // constant checking, will be useful for folding and for enforcement

    is_constant: function() {
        return false;
    },
    constant_value: function() {
        throw "invalid call: this.is_constant() == false";
    },
    element_is_constant: function(i) {
        return false;
    },
    element_constant_value: function(i) {
        throw "invalid call: no constant elements";
    },

    //////////////////////////////////////////////////////////////////////////
    // element access for compound expressions

    element: function(i) {
        throw "invalid call: atomic expression";  
    },

    //////////////////////////////////////////////////////////////////////////
    // some sugar

    add: function(op) {
        return Shade.add(this, op);
    },
    mul: function(op) {
        return Shade.mul(this, op);
    },
    div: function(op) {
        return Shade.div(this, op);
    },
    mod: function(op) {
        return Shade.mod(this, op);
    },
    sub: function(op) {
        return Shade.sub(this, op);
    },
    norm: function() {
        return Shade.norm(this);
    },
    distance: function(other) {
        return Shade.distance(this, other);
    },
    dot: function(other) {
        return Shade.dot(this, other);
    },
    cross: function(other) {
        return Shade.cross(this, other);
    },
    normalize: function() {
        return Shade.normalize(this);
    },
    reflect: function(other) {
        return Shade.reflect(this, other);
    },
    refract: function(o1, o2) {
        return Shade.refract(this, o1, o2);
    },
    texture2D: function(coords) {
        return Shade.texture2D(this, coords);
    },
    clamp: function(mn, mx) {
        return Shade.clamp(this, mn, mx);
    },
    min: function(other) {
        return Shade.min(this, other);
    },
    max: function(other) {
        return Shade.max(this, other);
    },

    per_vertex: function() {
        return Shade.per_vertex(this);
    },
    discard_if: function(condition) {
        return Shade.discard_if(this, condition);
    },

    // overload this to overload exp(foo)
    call_operator: function() {
        return this.mul.apply(this, arguments);
    },

    // all sugar for funcs_1op is defined later on in the source

    //////////////////////////////////////////////////////////////////////////

    as_int: function() {
        if (this.type.equals(Shade.Types.int_t))
            return this;
        var parent = this;
        return Shade._create_concrete_value_exp({
            parents: [parent],
            type: Shade.Types.int_t,
            value: function() { return "int(" + this.parents[0].evaluate() + ")"; },
            is_constant: function() { return parent.is_constant(); },
            constant_value: function() {
                var v = parent.constant_value();
                return Math.floor(v);
            },
            expression_type: "cast(int)"
        });
    },
    as_bool: function() {
        if (this.type.equals(Shade.Types.bool_t))
            return this;
        var parent = this;
        return Shade._create_concrete_value_exp({
            parents: [parent],
            type: Shade.Types.bool_t,
            value: function() { return "bool(" + this.parents[0].evaluate() + ")"; },
            is_constant: function() { return parent.is_constant(); },
            constant_value: function() {
                var v = parent.constant_value();
                return ~~v;
            },
            expression_type: "cast(bool)"
        });
    },
    as_float: function() {
        if (this.type.equals(Shade.Types.float_t))
            return this;
        var parent = this;
        return Shade._create_concrete_value_exp({
            parents: [parent],
            type: Shade.Types.float_t,
            value: function() { return "float(" + this.parents[0].evaluate() + ")"; },
            is_constant: function() { return parent.is_constant(); },
            constant_value: function() {
                var v = parent.constant_value();
                return Number(v);
            },
            expression_type: "cast(float)"
        });
    },
    swizzle: function(pattern) {
        function swizzle_pattern_to_indices(pattern) {
            function to_index(v) {
                switch (v.toLowerCase()) {
                case 'r': return 0;
                case 'g': return 1;
                case 'b': return 2;
                case 'a': return 3;
                case 'x': return 0;
                case 'y': return 1;
                case 'z': return 2;
                case 'w': return 3;
                case 's': return 0;
                case 't': return 1;
                case 'p': return 2;
                case 'q': return 3;
                default: throw "invalid swizzle pattern";
                }
            }
            var result = [];
            for (var i=0; i<pattern.length; ++i) {
                result.push(to_index(pattern[i]));
            }
            return result;
        }
        
        var parent = this;
        var indices = swizzle_pattern_to_indices(pattern);
        return Shade._create_concrete_exp( {
            parents: [parent],
            type: parent.type.swizzle(pattern),
            expression_type: "swizzle{" + pattern + "}",
            evaluate: function() {
                if (this._must_be_function_call)
                    return this.glsl_name + "()";
                else
                    return this.parents[0].evaluate() + "." + pattern; 
            },
            is_constant: Shade.memoize_on_field("_is_constant", function () {
                var that = this;
                return _.all(indices, function(i) {
                    return that.parents[0].element_is_constant(i);
                });
            }),
            constant_value: Shade.memoize_on_field("_constant_value", function() {
                if (this.type.is_pod()) {
                    return this.parents[0].element_constant_value(indices[0]);
                } else {
                    var that = this;
                    var ar = _.map(indices, function(index) {
                        return that.parents[0].element_constant_value(index);
                    });
                    var d = this.type.vec_dimension();
                    switch (d) {
                    case 2: return vec2.make(ar);
                    case 3: return vec3.make(ar);
                    case 4: return vec4.make(ar);
                    default:
                        throw "bad vec dimension " + d;
                    }
                }
            }),
            element: function(i) {
                return this.parents[0].element(indices[i]);
            },
            element_is_constant: Shade.memoize_on_field("_element_is_constant", function(i) {
                return this.parents[0].element_is_constant(indices[i]);
            }),
            element_constant_value: Shade.memoize_on_field("_element_constant_value", function(i) {
                return this.parents[0].element_constant_value(indices[i]);
            }),
            compile: function(ctx) {
                if (this._must_be_function_call) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                    ctx.add_initialization(this.precomputed_value_glsl_name + " = " + 
                                           this.parents[0].evaluate() + "." + pattern);
                    ctx.value_function(this, this.precomputed_value_glsl_name);
                }
            }
        });
    },
    at: function(index) {
        var parent = this;
        index = Shade.make(index);
        // this "works around" current constant index restrictions in webgl
        // look for it to get broken in the future as this hole is plugged.
        index._must_be_function_call = true;
        if (!index.type.equals(Shade.Types.float_t) &&
            !index.type.equals(Shade.Types.int_t)) {
            throw "at expects int or float, got '" + 
                index.type.repr() + "' instead";
        }
        return Shade._create_concrete_exp( {
            parents: [parent, index],
            type: parent.type.array_base(),
            expression_type: "index",
            evaluate: function() {
                if (this.parents[1].type.is_integral()) {
                    return this.parents[0].evaluate() + 
                        "[" + this.parents[1].evaluate() + "]"; 
                } else {
                    return this.parents[0].evaluate() + 
                        "[int(" + this.parents[1].evaluate() + ")]"; 
                }
            },
            is_constant: function() {
                if (!this.parents[1].is_constant())
                    return false;
                var ix = Math.floor(this.parents[1].constant_value());
                return (this.parents[1].is_constant() &&
                        this.parents[0].element_is_constant(ix));
            },
            constant_value: Shade.memoize_on_field("_constant_value", function() {
                var ix = Math.floor(this.parents[1].constant_value());
                return this.parents[0].element_constant_value(ix);
            }),

            element: Shade.memoize_on_field("_element", function(i) {
                // FIXME I suspect that a bug here might still arise
                // out of some interaction between the two conditions
                // described below. The right fix will require rewriting the whole
                // constant-folding system :) so it will be a while.

                var array = this.parents[0], 
                    index = this.parents[1];

                if (!index.is_constant()) {
                    // If index is not constant, then we use the following equation:
                    // element(Array(a_1 .. a_n).at(ix), i) ==
                    // Array(element(a_1, i) .. element(a_n, i)).at(ix)
                    var elts = _.map(array.parents, function(parent) {
                        return parent.element(i);
                    });
                    return Shade.array(elts).at(index);
                }
                var index_value = this.parents[1].constant_value();
                var x = this.parents[0].element(index_value);

                // the reason for the (if x === this) checks here is that sometimes
                // the only appropriate description of an element() of an
                // opaque object (uniforms and attributes, notably) is an at() call.
                // This means that (this.parents[0].element(ix) === this) is
                // sometimes true, and we're stuck in an infinite loop.
                if (x === this) {
                    return x.at(i);
                } else
                    return x.element(i);
            }),
            element_is_constant: Shade.memoize_on_field("_element_is_constant", function(i) {
                if (!this.parents[1].is_constant()) {
                    return false;
                }
                var ix = this.parents[1].constant_value();
                var x = this.parents[0].element(ix);
                if (x === this) {
                    return false;
                } else
                    return x.element_is_constant(i);
            }),
            element_constant_value: Shade.memoize_on_field("_element_constant_value", function(i) {
                var ix = this.parents[1].constant_value();
                var x = this.parents[0].element(ix);
                if (x === this) {
                    throw "internal error: would have gone into an infinite loop here.";
                }
                return x.element_constant_value(i);
            }),
            compile: function() {}
        });
    },
    _facet_expression: true, // used by facet_typeOf
    expression_type: "other",
    _type: "shade_expression",
    _attribute_buffers: [],
    _uniforms: [],
    attribute_buffers: function() {
        return _.flatten(this.sorted_sub_expressions().map(function(v) { 
            return v._attribute_buffers; 
        }));
    },
    uniforms: function() {
        return _.flatten(this.sorted_sub_expressions().map(function(v) { 
            return v._uniforms; 
        }));
    },

    // simple re-writing of shaders, useful for moving expressions
    // around, such as the things we move around when attributes are 
    // referenced in fragment programs
    // 
    // NB: it's easy to create bad expressions with these.
    //
    // The general rule is that types should be preserved (although
    // that might not *always* be the case)
    find_if: function(check) {
        return _.select(this.sorted_sub_expressions(), check);
    },

    replace_if: function(check, replacement) {
        // this code is not particularly clear, but this is a compiler
        // hot-path, bear with me.
        var subexprs = this.sorted_sub_expressions();
        var replaced_pairs = {};
        function parent_replacement(x) {
            if (!(x.guid in replaced_pairs)) {
                return x;
            } else
                return replaced_pairs[x.guid];
        }
        var latest_replacement, replaced;
        for (var i=0; i<subexprs.length; ++i) {
            var exp = subexprs[i];
            if (check(exp)) {
                latest_replacement = replacement(exp);
                replaced_pairs[exp.guid] = latest_replacement;
            } else {
                replaced = false;
                for (var j=0; j<exp.parents.length; ++j) {
                    if (exp.parents[j].guid in replaced_pairs) {
                        latest_replacement = Shade._create(exp, {
                            parents: _.map(exp.parents, parent_replacement)
                        });
                        replaced_pairs[exp.guid] = latest_replacement;
                        replaced = true;
                        break;
                    }
                }
                if (!replaced) {
                    latest_replacement = exp;
                }
            }
        }
        return latest_replacement;
    },
};

_.each(["r", "g", "b", "a",
        "x", "y", "z", "w",
        "s", "t", "p", "q"], function(v) {
            Shade.Exp[v] = function() {
                return this.swizzle(v);
            };
        });

Shade._create_concrete_exp = Shade._create_concrete(Shade.Exp, ["parents", "compile", "type"]);
