Lux.Scene.Transform.Geo.latlong_to_spherical = function(opts) {
    opts = _.clone(opts || {});
    opts.transform = function(appearance) {
        var pos = appearance.position;
        appearance = _.clone(appearance);
        var lat = appearance.position.x();
        var lon = appearance.position.y();
        var out = Shade.Scale.Geo.latlong_to_spherical(lat, lon);
        if (pos.type.equals(Shade.Types.vec3))
            appearance.position = out;
        else if (pos.type.equals(Shade.Types.vec4))
            appearance.position = Shade.vec(out, pos.w());
        return appearance;
    };
    return Lux.scene(opts);
};
