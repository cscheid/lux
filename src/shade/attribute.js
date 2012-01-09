Shade.attribute_from_buffer = function(buffer)
{
    return buffer._shade_expression || function() {
        var itemTypeMap = [ undefined, Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec3, Shade.Types.vec4 ];
        var itemType = itemTypeMap[buffer.itemSize];
        var itemName;
        if (_.isUndefined(buffer._shade_name)) {
            itemName = Shade.unique_name();
            buffer._shade_name = itemName;
        } else {
            itemName = buffer._shade_name;
        }
        var result = Shade.attribute(itemName, itemType);
        result._attribute_buffers = [buffer];
        buffer._shade_expression = result;
        return result;
    }();
};

Shade.attribute = function(name, type)
{
    if (_.isUndefined(type)) throw "attribute requires type";
    if (typeof type === 'string') type = Shade.basic(type);
    return Shade._create_concrete_exp( {
        parents: [],
        type: type,
        expression_type: 'attribute',
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.equals(Shade.Types.float_t)) {
                if (i === 0)
                    return this;
                else
                    throw "float is an atomic type";
            } else
                return this.at(i);
        }),
        eval: function() { 
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
        }
    });
};
