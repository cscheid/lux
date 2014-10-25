Lux.Scene.Transform.Geo.latlongToSpherical = function(opts) {
    opts = _.clone(opts || {});
    opts.transform = function(appearance) {
        if (_.isUndefined(appearance.position))
            return appearance;
        appearance = _.clone(appearance);
        var pos = appearance.position;
        var lat = appearance.position.x();
        var lon = appearance.position.y();
        var out = Shade.Scale.Geo.latlongToSpherical(lat, lon);
        if (pos.type.equals(Shade.Types.vec3))
            appearance.position = out;
        else if (pos.type.equals(Shade.Types.vec4))
            appearance.position = Shade.vec(out, pos.w());
        return appearance;
    };
    return Lux.scene(opts);
};
