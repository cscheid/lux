Facet.Camera.ortho = function(opts)
{
    opts = _.defaults(opts || {}, {
        aspect_ratio: 1,
        left: -1,
        right: -1,
        bottom: -1,
        top: 1,
        near: -1,
        far: 1
    });

    var left = opts.left;
    var right = opts.right;
    var bottom = opts.bottom;
    var top = opts.top;
    var screen_ratio = opts.aspect_ratio;
    var near = opts.near;
    var far = opts.far;

    var proj_uniform = Shade.uniform("mat4");

    function update_projection()
    {
        var view_ratio = (right - left) / (top - bottom);
        var l, r, t, b;
        if (view_ratio > screen_ratio) {
            // fat view rectangle, "letterbox" the projection
            var cy = (top + bottom) / 2;
            var half_width = (right - left) / 2;
            var half_height = half_width / screen_ratio;
            l = left;
            r = right;
            t = cy + half_height;
            b = cy - half_height;
        } else {
            // tall view rectangle, "pillarbox" the projection
            var cx = (right + left) / 2;
            var half_height = (top - bottom) / 2;
            var half_width = half_height * screen_ratio;
            l = cx - half_width;
            r = cx + half_width;
            t = top;
            b = bottom;
        }
        proj_uniform.set(mat4.ortho(l, r, b, t, near, far));
    }

    update_projection();

    return {
        set_aspect_ratio: function(new_aspect_ratio) {
            screen_ratio = new_aspect_ratio;
            update_projection();
        },
        set_bounds: function(opts) {
            opts = _.defaults(opts, {
                left: -1,
                right: 1,
                bottom: -1,
                top: 1,
                near: -1,
                far: 1
            });
            left = opts.left;
            right = opts.right;
            bottom = opts.bottom;
            top = opts.top;
            near = opts.near;
            far = opts.far;
            update_projection();
        },
        project: function(model_vertex) {
            var t = model_vertex.type;
            if (t.equals(Shade.Types.vec2))
                return proj_uniform.mul(Shade.vec(model_vertex, 0, 1));
            else if (t.equals(Shade.Types.vec3))
                return proj_uniform.mul(Shade.vec(model_vertex, 1));
            else if (t.equals(Shade.Types.vec4))
                return proj_uniform.mul(model_vertex);
            else
                throw "Type mismatch: expected vec, got " + t.repr();
        }
    };
};
