Lux.Scene.Transform.Geo = {};

(function() {

var twoDPositionXform = function(xform, inverseXform) {
    function makeIt(xf) {
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
        opts.transform = makeIt(xform);
        if (!_.isUndefined(inverseXform)) {
            opts.transform.inverse = makeIt(inverseXform);
            opts.transform.inverse.inverse = opts.transform;
        }
        return Lux.scene(opts);
    };
};
