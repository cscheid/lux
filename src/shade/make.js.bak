//////////////////////////////////////////////////////////////////////////////
// make converts objects which can be meaningfully interpreted as
// Exp values to the appropriate Exp values, giving us some poor-man
// static polymorphism

Shade.make = function(value)
{
    if (_.isUndefined(value)) {
        return undefined;
    }
    var t = Lux.type_of(value);
    if (t === 'string') {
        // Did you accidentally say exp1 + exp2 when you meant
        // exp1.add(exp2)?
        throw new Error("strings are not valid shade expressions");
    } else if (t === 'boolean' || t === 'number') {
        if (isNaN(value)) {
            // Did you accidentally say exp1 / exp2 or exp1 - exp2 when you meant
            // exp1.div(exp2) or exp1.sub(exp2)?
            throw new Error("nans are not valid in shade expressions");
        }
        return Shade.constant(value);
    } else if (t === 'array') {
        return Shade.seq(value);
    } else if (t === 'function') {
        return Shade.function(value);
    }
    t = Shade.Types.type_of(value);
    if (t.is_vec() || t.is_mat()) {
        return Shade.constant(value);
    } else if (value._shade_type === 'attribute_buffer') {
        return Shade.attribute_from_buffer(value);
    } else if (value._shade_type === 'render_buffer') {
        return Shade.sampler2D_from_texture(value.texture);
    } else if (value._shade_type === 'texture') {
        return Shade.sampler2D_from_texture(value);
    } else if (t.equals(Shade.Types.other_t)) { // FIXME struct types 
        return Shade.struct(value);
    }

    return value;
};

