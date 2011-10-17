// FIXME: typechecking
Shade.varying = function(name, type)
{
    if (typeof type === 'undefined') throw "varying requires type";
    if (typeof type === 'string') type = Shade.basic(type);
    return Shade._create_concrete_exp( {
        parents: [],
        type: type,
        expression_type: 'varying',
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw this.type.repr() + " is an atomic type";
            } else
                return this.at(i);
        }),
        eval: function() { return name; },
        compile: function(ctx) {
            ctx.declare_varying(name, this.type);
        }
    });
};

