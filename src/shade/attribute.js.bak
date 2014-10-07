Shade.attribute_from_buffer = function(buffer)
{
    return buffer._shade_expression || function() {
        var itemTypeMap = [ undefined, Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec3, Shade.Types.vec4 ];
        var itemType = itemTypeMap[buffer.itemSize];
        var result = Shade.attribute(itemType);
        buffer._shade_expression = result;
        result.set(buffer);
        return result;
    }();
};

Shade.attribute = function(type)
{
    var name = Shade.unique_name();
    if (_.isUndefined(type)) throw new Error("attribute requires type");
    if (typeof type === 'string') type = Shade.Types[type];
    if (_.isUndefined(type)) throw new Error("attribute requires valid type");
    var bound_buffer;

    return Shade._create_concrete_exp( {
        parents: [],
        type: type,
        expression_type: 'attribute',
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.equals(Shade.Types.float_t)) {
                if (i === 0)
                    return this;
                else
                    throw new Error("float is an atomic type");
            } else
                return this.at(i);
        }),
        evaluate: function() {
            throw new Error("client-side evaluation of attributes is currently unsupported");
        },
        glsl_expression: function() { 
            if (this._must_be_function_call) {
                return this.glsl_name + "()";
            } else
                return name; 
        },
        compile: function(ctx) {
            ctx.declare_attribute(name, this.type);
            if (this._must_be_function_call) {
                this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                ctx.add_initialization(this.precomputed_value_glsl_name + " = " + name);
                ctx.value_function(this, this.precomputed_value_glsl_name);
            }
        },
        get: function() {
            return bound_buffer;
        },
        set: function(buffer) {
            // FIXME buffer typechecking
            var batch_opts = Lux.get_current_batch_opts();
            if (batch_opts.program && (name in batch_opts.program)) {
                var ctx = batch_opts._ctx;
                buffer.bind(batch_opts.program[name]);
            }
            bound_buffer = buffer;
        },
        _attribute_name: name,

        //////////////////////////////////////////////////////////////////////
        // debugging

        _json_helper: Shade.Debug._json_builder("attribute", function(obj) {
            obj.attribute_type = type.repr();
            return obj;
        })

    });
};
