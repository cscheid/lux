Shade.scaling = Shade(function() {
    function build(v1, v2, v3) {
        return Shade.mat(Shade.vec(v1, 0, 0, 0),
                         Shade.vec( 0,v2, 0, 0),
                         Shade.vec( 0, 0,v3, 0),
                         Shade.vec( 0, 0, 0, 1));
    }
    if (arguments.length === 1) {
        var t = arguments[0];
        if (t.type.equals(Shade.Types.float_t))
            return build(t, t, t);
        if (t.type.equals(Shade.Types.vec3))
            return build(t.x(), t.y(), t.z());
        throw new Error("expected float or vec3, got " + t.type.repr() + " instead");
    } else if (arguments.length === 3) {
        return build(arguments[0], arguments[1], arguments[2]);
    } else {
        throw new Error("expected one or three parameters, got " + arguments.length + " instead");
    }
});
