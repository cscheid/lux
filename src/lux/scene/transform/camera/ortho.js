Lux.Scene.Transform.Camera.ortho = function(opts)
{
    opts = _.clone(opts || {});
    var camera = Shade.Camera.ortho(opts);
    opts.transform = function(appearance) {
        if (_.isUndefined(appearance.position))
            return appearance;
        appearance = _.clone(appearance);
        appearance.position = camera(appearance.position);
        return appearance;
    };
    var scene = Lux.scene(opts);
    scene.camera = camera;
    return scene;
};
