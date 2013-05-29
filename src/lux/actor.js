Lux.actor = function(opts)
{
    var appearance = opts.appearance;
    var model = opts.model;
    var batch;
    return {
        dress: function(scene) {
            var xform = scene.get_transform();
            var this_appearance = xform(appearance);
            return Lux.bake(model, this_appearance);
        }
    };
};
