/*
 * FIXME Shade.Camera.ortho currently mixes a view matrix
 * with the projection matrix. This must be factored out.
 */

Shade.Camera.ortho = function(opts)
{
    opts = _.defaults(opts || {}, {
        left: -1,
        right: 1,
        bottom: -1,
        top: 1,
        near: -1,
        far: 1,
        center: Shade.vec(0,0),
        zoom: Shade(1)
    });

    var viewport_ratio;
    var ctx;
    if (opts.aspect_ratio)
        viewport_ratio = opts.aspect_ratio;
    else {
        ctx = Lux._globals.ctx;
        if (_.isUndefined(ctx)) {
            throw "aspect_ratio is only optional with an active Lux context";
        }
        viewport_ratio = ctx.viewportWidth / ctx.viewportHeight;
    };

    var left, right, bottom, top;
    var near = opts.near;
    var far = opts.far;

    left = opts.left;
    right = opts.right;
    bottom = opts.bottom;
    top = opts.top;

    var view_ratio = Shade.sub(right, left).div(Shade.sub(top, bottom));
    var l_or_p = view_ratio.gt(viewport_ratio); // letterbox or pillarbox

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
    
    var view_xform = Shade(function(model_vertex) {
        if (model_vertex.type === Shade.Types.vec2) {
            return model_vertex.sub(opts.center).mul(opts.zoom);
        } else if (model_vertex.type === Shade.Types.vec3) {
            return Shade.vec(
                model_vertex.swizzle("xy").sub(opts.center).mul(opts.zoom),
                model_vertex.z());
        } else if (model_vertex.type === Shade.Types.vec4) {
            return Shade.vec(
                model_vertex.swizzle("xy").sub(opts.center).mul(opts.zoom),
                model_vertex.z());
        } else 
            throw "Shade.ortho requires vec2, vec3, or vec4s";
    });
    var view_xform_invert = Shade(function(view_vertex) {
        return view_vertex.swizzle("xy").div(opts.zoom).add(opts.center);
    });

    function result(obj) {
        return result.project(obj);
    }
    result.model_to_view = view_xform;
    result.view_to_device = function(view_vertex) {
        return m.mul(view_vertex);
    };
    result.project = function(model_vertex) {
        return m.mul(view_xform(model_vertex));
    };
    result.unproject = function(screen_pos) {
        var ctx = Lux._globals.ctx;
        var screen_size = Shade.vec(ctx.parameters.width, ctx.parameters.height);
        var min = Shade.vec(l, b);
        var max = Shade.vec(r, t);
        var view_vtx = min.add(max.sub(min).mul(screen_pos.div(screen_size)));
        return view_xform_invert(view_vtx);
    };
    return result;
};
