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
    evaluate: function() {
        if (this._must_be_function_call)
            return this.glsl_name + "()";
        if (this.children_count <= 1)
            return this.value();
        if (this.is_unconditional)
            return this.precomputed_value_glsl_name;
        else
            return this.glsl_name + "()";
    },
    element: function(i) {
        if (this.type.is_pod()) {
            if (i === 0)
                return this;
            else
                throw this.type.repr() + " is an atomic type, got this: " + i;
        }
        return this.at(i);
    },
    compile: function(ctx) {
        if (this._must_be_function_call) {
            if (this.is_unconditional) {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                    ctx.add_initialization(this.precomputed_value_glsl_name + " = " + this.value());
                    ctx.value_function(this, this.precomputed_value_glsl_name);
                } else {
                    ctx.value_function(this, this.value());
                }
            } else {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                    this.has_precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(Shade.Types.bool_t.declare(this.has_precomputed_value_glsl_name), ";\n");
                    ctx.add_initialization(this.has_precomputed_value_glsl_name + " = false");
                    ctx.value_function(this, "(" + this.has_precomputed_value_glsl_name + "?"
                                       + this.precomputed_value_glsl_name + ": (("
                                       + this.has_precomputed_value_glsl_name + "=true),("
                                       + this.precomputed_value_glsl_name + "="
                                       + this.value() + ")))");
                } else
                    ctx.value_function(this, this.value());
            }
        } else {
            if (this.is_unconditional) {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                    ctx.add_initialization(this.precomputed_value_glsl_name + " = " + this.value());
                } else {
                    // don't emit anything, all is taken care by evaluate()
                }
            } else {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                    this.has_precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(Shade.Types.bool_t.declare(this.has_precomputed_value_glsl_name), ";\n");
                    ctx.add_initialization(this.has_precomputed_value_glsl_name + " = false");
                    ctx.value_function(this, "(" + this.has_precomputed_value_glsl_name + "?"
                                       + this.precomputed_value_glsl_name + ": (("
                                       + this.has_precomputed_value_glsl_name + "=true),("
                                       + this.precomputed_value_glsl_name + "="
                                       + this.value() + ")))");
                } else {
                    // don't emit anything, all is taken care by evaluate()
                }
            }
        }
    }
});
Shade._create_concrete_value_exp = Shade._create_concrete(Shade.ValueExp, ["parents", "type", "value"]);
