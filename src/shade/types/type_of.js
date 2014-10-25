// Shade.Types.typeOf implements the following spec:
// 
// for all shade values s such that s.evaluate() equals v,
// s.type.equals(Shade.Types.typeOf(v))

// In addition, if there is no s such that s.evaluate() equals v,
// then Shade.Types.typeOf returns otherT. That's a kludge,
// but is convenient.
Shade.Types.typeOf = function(v)
{
    var t = typeof v;
    if (t === "boolean") {
        return Shade.Types.boolT;
    } else if (t === "number") {
        return Shade.Types.floatT;
    } else if (Lux.isShadeExpression(v)) {
        return Shade.Types.shadeT;
    } else if (t === "function") {
        return Shade.Types.functionT;
    } else if (_.isUndefined(v)) {
        return Shade.Types.undefinedT;
    } else if (!_.isUndefined(v.buffer) && v.buffer._type) {
        return Shade.Types[v.buffer._type];
    } else {
        return Shade.Types.otherT;
    }
};
