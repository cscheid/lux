Lux.Scene.Transform.Geo = {};

(function() {

var two_d_position_xform = function(xform) {
    return function(opts) {
        opts = _.clone(opts || {});
        opts.transform = function(appearance) {
            var pos = appearance.position;
            appearance = _.clone(appearance);
            var lat = appearance.position.x();
            var lon = appearance.position.y();
            var out = xform(lat, lon);
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
};
