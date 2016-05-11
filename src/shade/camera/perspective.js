Shade.Camera.perspective = function(opts)
{
    opts = _.defaults(opts || {}, {
        lookAt: [Shade.vec(0, 0, 0), 
                  Shade.vec(0, 0, -1), 
                  Shade.vec(0, 1, 0)],
        fieldOfViewY: 45,
        nearDistance: 0.1,
        farDistance: 100
    });
    
    var fieldOfViewY = opts.fieldOfViewY;
    var nearDistance = opts.nearDistance;
    var farDistance = opts.farDistance;
    var aspectRatio;
    if (opts.aspectRatio)
        aspectRatio = opts.aspectRatio;
    else {
        var ctx = Lux._globals.ctx;
        if (_.isUndefined(ctx)) {
            throw new Error("aspectRatio is only optional with an active Lux context");
        }
        // FIXME why is this not using parameters.width and parameters.height?
        aspectRatio = ctx.viewportWidth / ctx.viewportHeight;
    }

    var view = Shade.lookAt(opts.lookAt[0], opts.lookAt[1], opts.lookAt[2]);
    var projection = Shade.perspectiveMatrix(fieldOfViewY, aspectRatio, nearDistance, farDistance);
    var vpParameter = Shade.mul(projection, view);
    var result = function(obj) {
        return result.project(obj);
    };
    result.project = function(modelVertex) {
        return vpParameter.mul(modelVertex);
    };
    result.eyeVertex = function(modelVertex) {
        var t = modelVertex.type;
        return view.mul(modelVertex);
    };
    return result;
};
