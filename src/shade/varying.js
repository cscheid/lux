Shade.varying = function(name, type)
{
    if (_.isUndefined(type)) throw "varying requires type";
    if (lux_typeOf(type) === 'string') type = Shade.Types[type];
    if (_.isUndefined(type)) throw "varying requires valid type";
    var allowed_types = [
        Shade.Types.float_t,
        Shade.Types.vec2,
        Shade.Types.vec3,
        Shade.Types.vec4,
        Shade.Types.mat2,
        Shade.Types.mat3,
        Shade.Types.mat4
    ];
    if (!_.any(allowed_types, function(t) { return t.equals(type); })) {
        throw "varying does not support type '" + type.repr() + "'";
    }
    return Shade._create_concrete_exp( {
        parents: [],
        type: type,
        expression_type: 'varying',
        _varying_name: name,
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw this.type.repr() + " is an atomic type";
            } else
                return this.at(i);
        }),
        glsl_expression: function() { 
            if (this._must_be_function_call) {
                return this.glsl_name + "()";
            } else
                return name; 
        },
        evaluate: function() {
            throw "evaluate unsupported for varying expressions";
        },
        compile: function(ctx) {
            ctx.declare_varying(name, this.type);
            if (this._must_be_function_call) {
                this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                ctx.add_initialization(this.precomputed_value_glsl_name + " = " + name);
                ctx.value_function(this, this.precomputed_value_glsl_name);
            }
        }
    });
};

