//////////////////////////////////////////////////////////////////////////////
// make converts objects which can be meaningfully interpreted as
// Exp values to the appropriate Exp values, giving us some poor-man
// static polymorphism

Shade.make = function(value)
{
    if (_.isUndefined(value)) {
        return undefined;
    }
    var t = Lux.typeOf(value);
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
    t = Shade.Types.typeOf(value);
    if (t.isVec() || t.isMat()) {
        return Shade.constant(value);
    } else if (value._shadeType === 'attributeBuffer') {
        return Shade.attributeFromBuffer(value);
    } else if (value._shadeType === 'renderBuffer') {
        return Shade.sampler2dFromTexture(value.texture);
    } else if (value._shadeType === 'texture') {
        return Shade.sampler2dFromTexture(value);
    } else if (t.equals(Shade.Types.otherT)) { // FIXME struct types 
        return Shade.struct(value);
    }

    return value;
};

