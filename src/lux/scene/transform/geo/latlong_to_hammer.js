Lux.Scene.Transform.Geo.latlong_to_hammer = function(opts) {
    opts = _.clone(opts || {});
    opts.transform = function(appearance) {
        var pos = appearance.position;
        appearance = _.clone(appearance);
        var out = Shade.Scale.Geo.latlong_to_hammer(appearance.position.x(), appearance.position.y(), opts.B);
        if (pos.type.equals(Shade.Types.vec2))
            appearance.position = out;
        else if (pos.type.equals(Shade.Types.vec3))
            appearance.position = Shade.vec(out, pos.at(2));
        else if (pos.type.equals(Shade.Types.vec4))
            appearance.position = Shade.vec(out, pos.swizzle("zw"));
        return appearance;
    };
    return Lux.scene(opts);
};
