//////////////////////////////////////////////////////////////////////////////
// make converts objects which can be meaningfully interpreted as
// Exp values to the appropriate Exp values, giving us some poor-man
// static polymorphism
Shade.make = function(exp)
{
    if (_.isUndefined(exp)) {
        throw "expected a value, got undefined instead";
    }
    var t = facet_typeOf(exp);
    if (t === 'boolean' || t === 'number') {
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
            return exp.apply(this, wrapped_arguments);
        };
    }
    t = facet_constant_type(exp);
    if (t === 'vector' || t === 'matrix') {
        return Shade.constant(exp);
    } else if (exp._shade_type === 'attribute_buffer') {
        return Shade.attribute_from_buffer(exp);
    } else if (exp._shade_type === 'render_buffer') {
        return Shade.sampler2D_from_texture(exp.texture);
    } else if (exp._shade_type === 'texture') {
        return Shade.sampler2D_from_texture(exp);
    }
    return exp;
};

