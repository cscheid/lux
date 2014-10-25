Shade.translation = Shade(function() {
    function fromVec3(v) {
        return Shade.mat(Shade.vec(1,0,0,0),
                         Shade.vec(0,1,0,0),
                         Shade.vec(0,0,1,0),
                         Shade.vec(v, 1));
    }
    if (arguments.length === 1) {
        var t = arguments[0];
        if (!t.type.equals(Shade.Types.vec3)) {
            throw new Error("expected vec3, got " + t.type.repr() + "instead");
        }
        return fromVec3(t);
    } else if (arguments.length === 2) {
        var x = arguments[0], y = arguments[1];
        if (!x.type.equals(Shade.Types.floatT)) {
            throw new Error("expected float, got " + x.type.repr() + "instead");
        }
        if (!y.type.equals(Shade.Types.floatT)) {
            throw new Error("expected float, got " + y.type.repr() + "instead");
        }
        return fromVec3(Shade.vec(x, y, 0));
    } else if (arguments.length === 3) {
        var x = arguments[0], y = arguments[1], z = arguments[2];
        if (!x.type.equals(Shade.Types.floatT)) {
            throw new Error("expected float, got " + x.type.repr() + "instead");
        }
        if (!y.type.equals(Shade.Types.floatT)) {
            throw new Error("expected float, got " + y.type.repr() + "instead");
        }
        if (!z.type.equals(Shade.Types.floatT)) {
            throw new Error("expected float, got " + z.type.repr() + "instead");
        }
        return fromVec3(Shade.vec(x, y, z));
    } else
        throw new Error("expected either 1, 2 or 3 parameters");
});
