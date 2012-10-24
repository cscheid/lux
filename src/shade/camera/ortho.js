Shade.Camera.ortho = function(opts)
{
    opts = _.defaults(opts || {}, {
        left: -1,
        right: 1,
        bottom: -1,
        top: 1,
        near: -1,
        far: 1
    });

    var viewport_ratio;
    var ctx;
    if (opts.aspect_ratio)
        viewport_ratio = opts.aspect_ratio;
    else {
        ctx = Facet._globals.ctx;
        if (_.isUndefined(ctx)) {
            throw "aspect_ratio is only optional with an active Facet context";
        }
        viewport_ratio = ctx.viewportWidth / ctx.viewportHeight;
    };

    var left, right, bottom, top;
    var near = opts.near;
    var far = opts.far;

    if (!_.isUndefined(opts.center) && !_.isUndefined(opts.zoom)) {
        var viewport_width = Shade.div(1, opts.zoom);
        left   = opts.center.at(0).sub(viewport_width);
        right  = opts.center.at(0).add(viewport_width);
        bottom = opts.center.at(1).sub(viewport_width);
        top    = opts.center.at(1).add(viewport_width);
    } else {
        left = opts.left;
        right = opts.right;
        bottom = opts.bottom;
        top = opts.top;
    }

    // function letterbox_projection() {
    //     var cy = Shade.add(top, bottom).div(2);
    //     var half_width = Shade.sub(right, left).div(2);
    //     var corrected_half_height = half_width.div(viewport_ratio);
    //     var l = left;
    //     var r = right;
    //     var t = cy.add(corrected_half_height);
    //     var b = cy.sub(corrected_half_height);
    //     return Shade.ortho(l, r, b, t, near, far);
    // }

    // function pillarbox_projection() {
    //     var cx = Shade.add(right, left).div(2);
    //     var half_height = Shade.sub(top, bottom).div(2);
    //     var corrected_half_width = corrected_half_height.mul(viewport_ratio);
    //     var l = cx.sub(corrected_half_width);
    //     var r = cx.add(corrected_half_width);
    //     var t = top;
    //     var b = bottom;
    //     return Shade.ortho(l, r, b, t, near, far);
    // }

    var view_ratio = Shade.sub(right, left).div(Shade.sub(top, bottom));
    var l_or_p = view_ratio.gt(viewport_ratio);

    var cx = Shade.add(right, left).div(2);
    var cy = Shade.add(top, bottom).div(2);
    var half_width = Shade.sub(right, left).div(2);
    var half_height = Shade.sub(top, bottom).div(2);
    var corrected_half_width = half_height.mul(viewport_ratio);
    var corrected_half_height = half_width.div(viewport_ratio);

    var l = l_or_p.ifelse(left,  cx.sub(corrected_half_width));
    var r = l_or_p.ifelse(right, cx.add(corrected_half_width));
    var b = l_or_p.ifelse(cy.sub(corrected_half_height), bottom);
    var t = l_or_p.ifelse(cy.add(corrected_half_height), top);
    var m = Shade.ortho(l, r, b, t, near, far);
    
    // var m = view_ratio.gt(viewport_ratio)
    //     .ifelse(letterbox_projection(),
    //             pillarbox_projection());

    function result(obj) {
        return result.project(obj);
    }
    result.project = function(model_vertex) {
        return m.mul(model_vertex);
    };
    result.unproject = function(screen_pos) {
        var ctx = Facet._globals.ctx;
        var screen_size = Shade.vec(ctx.parameters.width, ctx.parameters.height);
        var min = Shade.vec(l, b);
        var max = Shade.vec(r, t);
        return min.add(max.sub(min).mul(screen_pos.div(screen_size)));
    };
    return result;
};
