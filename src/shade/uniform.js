Shade.uniform = function(type, v)
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
    if (typeof type === 'undefined') throw "uniform requires type";
    if (typeof type === 'string') type = Shade.basic(type);
    var value = v;
    var call = _.detect(call_lookup, function(p) { return type.equals(p[0]); });
    if (typeof call !== 'undefined') {
        call = call[1];
    } else {
        throw "Unsupported type " + type.repr() + " for uniform.";
    }
    var result = Shade._create_concrete_exp({
        parents: [],
        type: type,
        expression_type: 'uniform',
        eval: function() {
            if (this._must_be_function_call) {
                return this.glsl_name + "()";
            } else
                return uniform_name; 
        },
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw this.type.repr() + " is an atomic type";
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
        // FIXME: type checking
        set: function(v) {
            value = v;
            if (this._facet_active_uniform) {
                this._facet_active_uniform(v);
            }
        },
        get: function(v) {
            return value;
        },
        uniform_call: call,
        uniform_name: uniform_name
    });
    result._uniforms = [result];
    return result;
};
