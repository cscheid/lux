Lux.Scene.Transform.Geo = {};

(function() {

var two_d_position_xform = function(xform, inverse_xform) {
    function make_it(xf) {
        return function(appearance) {
            if (_.isUndefined(appearance.position))
                return appearance;
            appearance = _.clone(appearance);
            var pos = appearance.position;
            var out = xf(appearance.position.x(), appearance.position.y());
            if (pos.type.equals(Shade.Types.vec2))
                appearance.position = out;
            else if (pos.type.equals(Shade.Types.vec3))
                appearance.position = Shade.vec(out, pos.at(2));
            else if (pos.type.equals(Shade.Types.vec4))
                appearance.position = Shade.vec(out, pos.swizzle("zw"));
            return appearance;
        };
    };
    return function(opts) {
        opts = _.clone(opts || {});
        opts.transform = make_it(xform);
        if (!_.isUndefined(inverse_xform)) {
            opts.transform.inverse = make_it(inverse_xform);
            opts.transform.inverse.inverse = opts.transform;
        }
        return Lux.scene(opts);
    };
};
