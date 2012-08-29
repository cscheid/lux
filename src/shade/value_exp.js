/*
 * FIXME the webgl compiler seems to be having trouble with the
 * conditional expressions in longer shaders.  Temporarily, then, I
 * will replace all "unconditional" checks with "true". The end effect
 * is that the shader always evaluates potentially unused sides of a
 * conditional expression if they're used in two or more places in
 * the shader.
 */

Shade.ValueExp = Shade._create(Shade.Exp, {
    is_constant: Shade.memoize_on_field("_is_constant", function() {
        return _.all(this.parents, function(v) {
            return v.is_constant();
        });
    }),
    element_is_constant: Shade.memoize_on_field("_element_is_constant", function(i) {
        return this.is_constant();
    }),
    element_constant_value: Shade.memoize_on_field("_element_constant_value", function (i) {
        return this.element(i).constant_value();
    }),
    _must_be_function_call: false,
    glsl_expression: function() {
        var unconditional = true; // see comment on top
        if (this._must_be_function_call) {
            return this.glsl_name + "(" + _.map(this.loop_variable_dependencies(), function(exp) {
                return exp.glsl_name;
            }).join(",") + ")";
        }
        // this.children_count will be undefined if object was built
        // during compilation (lifted operators for structs will do that, for example)
        if (_.isUndefined(this.children_count) || this.children_count <= 1)
            return this.value();
        if (unconditional)
            return this.precomputed_value_glsl_name;
        else
            return this.glsl_name + "()";
    },
    // For types which are not POD, element(i) returns a Shade expression
    // whose value is equivalent to evaluating the i-th element of the
    // expression itself. for example:
    // Shade.add(vec1, vec2).element(0) -> Shade.add(vec1.element(0), vec2.element(0));
    element: function(i) {
        if (this.type.is_pod()) {
            if (i === 0)
                return this;
            else
                throw this.type.repr() + " is an atomic type, got this: " + i;
        } else {
            this.debug_print();
            throw "Internal error; this should have been overriden.";
        }
    },
    compile: function(ctx) {
        var unconditional = true; // see comment on top
        if (this._must_be_function_call) {
            if (unconditional) {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    this.scope.add_declaration(this.type.declare(this.precomputed_value_glsl_name));
                    this.scope.add_initialization(this.precomputed_value_glsl_name + " = " + this.value());
                    ctx.value_function(this, this.precomputed_value_glsl_name);
                } else {
                    ctx.value_function(this, this.value());
                }
            } else {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    this.has_precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    this.scope.add_declaration(this.type.declare(this.precomputed_value_glsl_name));
                    this.scope.add_declaration(Shade.Types.bool_t.declare(this.has_precomputed_value_glsl_name));
                    this.scope.add_initialization(this.has_precomputed_value_glsl_name + " = false");

                    ctx.value_function(this, "(" + this.has_precomputed_value_glsl_name + "?"
                                       + this.precomputed_value_glsl_name + ": (("
                                       + this.has_precomputed_value_glsl_name + "=true),("
                                       + this.precomputed_value_glsl_name + "="
                                       + this.value() + ")))");
                } else
                    ctx.value_function(this, this.value());
            }
        } else {
            if (unconditional) {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    this.scope.add_declaration(this.type.declare(this.precomputed_value_glsl_name));
                    this.scope.add_initialization(this.precomputed_value_glsl_name + " = " + this.value());
                } else {
                    // don't emit anything, all is taken care by glsl_expression()
                }
            } else {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    this.has_precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    this.scope.add_declaration(this.type.declare(this.precomputed_value_glsl_name));
                    this.scope.add_declaration(Shade.Types.bool_t.declare(this.has_precomputed_value_glsl_name));
                    this.scope.add_initialization(this.has_precomputed_value_glsl_name + " = false");
                    ctx.value_function(this, "(" + this.has_precomputed_value_glsl_name + "?"
                                       + this.precomputed_value_glsl_name + ": (("
                                       + this.has_precomputed_value_glsl_name + "=true),("
                                       + this.precomputed_value_glsl_name + "="
                                       + this.value() + ")))");
                } else {
                    // don't emit anything, all is taken care by glsl_expression()
                }
            }
        }
    }, call_operator: function(other) {
        return this.mul(other);
    }
});
Shade._create_concrete_value_exp = Shade._create_concrete(Shade.ValueExp, ["parents", "type", "value"]);
