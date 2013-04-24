// Shade.Types.type_of will implement the following spec:
// 
// for all shade values s such that s.evaluate() equals v,
// s.type.equals(Shade.Types.type_of(v))
Shade.Types.type_of = function(v)
{
    var t = typeof v;
    if (t === "boolean")         return "boolean";
    if (t === "number")          return "number";
    if (v) {
        var b = v._type;
        if (!_.isUndefined(b))
            return b;
        if (!_.isUndefined(v.buffer) && v.buffer._type)
            return v.buffer._type;
        else
            return "other";
    }
    return t;
};
