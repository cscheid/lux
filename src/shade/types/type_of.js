// Shade.Types.type_of implements the following spec:
// 
// for all shade values s such that s.evaluate() equals v,
// s.type.equals(Shade.Types.type_of(v))

// In addition, if there is no s such that s.evaluate() equals v,
// then Shade.Types.type_of returns other_t. That's a kludge,
// but is convenient.
Shade.Types.type_of = function(v)
{
    var t = typeof v;
    if (t === "boolean") {
        return Shade.Types.bool_t;
    } else if (t === "number") {
        return Shade.Types.float_t;
    } else if (Lux.is_shade_expression(v)) {
        return Shade.Types.shade_t;
    } else if (_.isUndefined(v)) {
        return Shade.Types.undefined_t;
    } else if (!_.isUndefined(v.buffer) && v.buffer._type) {
        return Shade.Types[v.buffer._type];
    } else {
        return Shade.Types.other_t;
    }
};
