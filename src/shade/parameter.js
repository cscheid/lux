Shade.parameter = function(type, v)
{
    var call_lookup = [
        [Shade.Types.float_t, "uniform1f"],
        [Shade.Types.int_t, "uniform1i"],
        [Shade.Types.bool_t, "uniform1i"],
        [Shade.Types.sampler2D, "uniform1i"],
        [Shade.Types.vec2, "uniform2fv"],
        [Shade.Types.vec3, "uniform3fv"],
        [Shade.Types.vec4, "uniform4fv"],
        [Shade.Types.mat2, "uniformMatrix2fv"],
        [Shade.Types.mat3, "uniformMatrix3fv"],
        [Shade.Types.mat4, "uniformMatrix4fv"]
    ];

    var uniform_name = Shade.unique_name();
    if (_.isUndefined(type)) throw new Error("parameter requires type");
    if (typeof type === 'string') type = Shade.Types[type];
    if (_.isUndefined(type)) throw new Error("parameter requires valid type");

    // the local variable value stores the actual value of the
    // parameter to be used by the GLSL uniform when it is set.
    var value;

    var call = _.detect(call_lookup, function(p) { return type.equals(p[0]); });
    if (!_.isUndefined(call)) {
        call = call[1];
    } else {
        throw new Error("Unsupported type " + type.repr() + " for parameter.");
    }
    var result = Shade._create_concrete_exp({
        parents: [],
        watchers: [],
        type: type,
        expression_type: 'parameter',
        glsl_expression: function() {
            if (this._must_be_function_call) {
                return this.glsl_name + "()";
            } else
                return uniform_name; 
        },
        evaluate: function() {
            return value;
        },
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw new Error(this.type.repr() + " is an atomic type");
            } else
                return this.at(i);
        }),
        compile: function(ctx) {
            ctx.declare_uniform(uniform_name, this.type);
            if (this._must_be_function_call) {
                this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                ctx.add_initialization(this.precomputed_value_glsl_name + " = " + uniform_name);
                ctx.value_function(this, this.precomputed_value_glsl_name);
            }
        },
        set: function(v) {
            // Ideally, we'd like to do type checking here, but I'm concerned about
            // performance implications. setting a uniform might be a hot path
            // then again, lux_constant_type is unlikely to be particularly fast.
            // FIXME check performance
            var t = lux_constant_type(v);
            if (t === "shade_expression")
                v = v.evaluate();
            value = v;
            if (this._lux_active_uniform) {
                this._lux_active_uniform(v);
            }
            _.each(this.watchers, function(f) { f(v); });
        },
        get: function(v) {
            return value;
        },
        watch: function(callback) {
            this.watchers.push(callback);
        },
        unwatch: function(callback) {
            this.watchers.splice(this.watchers.indexOf(callback), 1);
        },
        uniform_call: call,
        uniform_name: uniform_name
    });
    result._uniforms = [result];
    result.set(v);
    return result;
};
