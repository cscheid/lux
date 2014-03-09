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
        center: vec.make([0,0]),
        zoom: 1
    });

    var viewport_ratio;
    var ctx;
    if (opts.aspect_ratio)
        viewport_ratio = opts.aspect_ratio;
    else {
        ctx = Lux._globals.ctx;
        if (_.isUndefined(ctx)) {
            throw new Error("aspect_ratio is only optional with an active Lux context");
        }
        viewport_ratio = ctx.parameters.width.div(ctx.parameters.height);
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

    function replace_xy_with(vec, new_vec) {
        if (vec.type === Shade.Types.vec2)
            return new_vec;
        else if (vec.type === Shade.Types.vec3)
            return Shade.vec(new_vec, vec.z());
        else if (vec.type === Shade.Types.vec4)
            return Shade.vec(new_vec, vec.swizzle("zw"));
        else
            throw new Error("Shade.ortho requires vec2, vec3, or vec4s");
    };

    var view_xform = Shade(function(model_vertex) {
        var new_v = model_vertex.swizzle("xy").sub(opts.center).mul(opts.zoom);
        return replace_xy_with(model_vertex, new_v);
    });
    var view_xform_invert = Shade(function(view_vertex) {
        var new_v = view_vertex.swizzle("xy").div(opts.zoom).add(opts.center);
        return replace_xy_with(view_vertex, new_v);
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
    result.unproject = function(normalized_view_pos) {
        // var inv_m = Shade.Scale.linear({
        //     domain: [Shade.vec(-1,-1,-1),
        //              Shade.vec( 1, 1, 1)],
        //     range: [Shade.vec(l, b, near),
        //             Shade.vec(r, t, far)]});
        var inv_m = Shade.Scale.linear({
            domain: [Shade.vec(-1,-1),
                     Shade.vec( 1, 1)],
            range: [Shade.vec(l, b),
                    Shade.vec(r, t)]});
        return view_xform_invert(inv_m(normalized_view_pos));
        // var ctx = Lux._globals.ctx;
        // var screen_size = Shade.vec(ctx.parameters.width, ctx.parameters.height);
        // var view_vtx = min.add(max.sub(min).mul(screen_pos.div(screen_size)));
        // return view_xform_invert(view_vtx);
    };
    return result;
};
