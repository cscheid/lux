Shade.Camera.perspective = function(opts)
{
    opts = _.defaults(opts || {}, {
        look_at: [Shade.vec(0, 0, 0), 
                  Shade.vec(0, 0, -1), 
                  Shade.vec(0, 1, 0)],
        field_of_view_y: 45,
        near_distance: 0.1,
        far_distance: 100
    });
    
    var field_of_view_y = opts.field_of_view_y;
    var near_distance = opts.near_distance;
    var far_distance = opts.far_distance;
    var aspect_ratio;
    if (opts.aspect_ratio)
        aspect_ratio = opts.aspect_ratio;
    else {
        var ctx = Lux._globals.ctx;
        if (_.isUndefined(ctx)) {
            throw new Error("aspect_ratio is only optional with an active Lux context");
        }
        aspect_ratio = ctx.viewportWidth / ctx.viewportHeight;
    }

    var view = Shade.look_at(opts.look_at[0], opts.look_at[1], opts.look_at[2]);
    var projection = Shade.perspective_matrix(field_of_view_y, aspect_ratio, near_distance, far_distance);
    var vp_parameter = Shade.mul(projection, view);
    var result = function(obj) {
        return result.project(obj);
    };
    result.project = function(model_vertex) {
        return vp_parameter.mul(model_vertex);
    };
    result.eye_vertex = function(model_vertex) {
        var t = model_vertex.type;
        return view.mul(model_vertex);
    };
    return result;
};
