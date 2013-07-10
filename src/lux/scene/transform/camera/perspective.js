Lux.Scene.Transform.Camera.perspective = function(opts)
{
    opts = _.clone(opts || {});
    var camera = Shade.Camera.perspective(opts);
    opts.transform = function(appearance) {
        appearance = _.clone(appearance);
        appearance.position = camera(appearance.position);
        return appearance;
    };
    var scene = Lux.scene(opts);
    scene.camera = camera;
    return scene;
};
