//////////////////////////////////////////////////////////////////////////////
// make converts objects which can be meaningfully interpreted as
// Exp values to the appropriate Exp values, giving us some poor-man
// static polymorphism

Shade.make = function(exp)
{
    if (_.isUndefined(exp)) {
        throw new Error("expected a value, got undefined instead");
    }
    var t = lux_typeOf(exp);
    if (t === 'string') {
        // Did you accidentally say exp1 + exp2 when you meant
        // exp1.add(exp2)?
        throw new Error("strings are not valid shade expressions");
    } else if (t === 'boolean' || t === 'number') {
        if (isNaN(exp)) {
            // Did you accidentally say exp1 / exp2 or exp1 - exp2 when you meant
            // exp1.div(exp2) or exp1.sub(exp2)?
            throw new Error("nans are not valid in shade expressions");
        }
        return Shade.constant(exp);
    } else if (t === 'array') {
        return Shade.seq(exp);
    } else if (t === 'function') {
        /* lifts the passed function to a "shade function".
        
        In other words, this creates a function that replaces every
        passed parameter p by Shade.make(p) This way, we save a lot of
        typing and errors. If a javascript function is expected to
        take shade values and produce shade expressions as a result,
        simply wrap that function around a call to Shade.make()

         */

        return function() {
            var wrapped_arguments = [];
            for (var i=0; i<arguments.length; ++i) {
                wrapped_arguments.push(Shade.make(arguments[i]));
            }
            return Shade.make(exp.apply(this, wrapped_arguments));
        };
    }
    t = lux_constant_type(exp);
    if (t === 'vector' || t === 'matrix') {
        return Shade.constant(exp);
    } else if (exp._shade_type === 'attribute_buffer') {
        return Shade.attribute_from_buffer(exp);
    } else if (exp._shade_type === 'render_buffer') {
        return Shade.sampler2D_from_texture(exp.texture);
    } else if (exp._shade_type === 'texture') {
        return Shade.sampler2D_from_texture(exp);
    } else if (t === 'other') {
        return Shade.struct(exp);
    }

    return exp;
};

