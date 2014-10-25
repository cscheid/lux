Lux.Scene.Transform.Geo.latlongToHammer = function(opts) {
    opts = _.clone(opts || {});
    opts.transform = function(appearance) {
        if (_.isUndefined(appearance.position))
            return appearance;
        appearance = _.clone(appearance);
        var pos = appearance.position;
        var out = Shade.Scale.Geo.latlongToHammer(appearance.position.x(), appearance.position.y(), opts.B);
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
