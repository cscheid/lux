Facet.Camera.perspective = function(opts)
{
    opts = opts || {};
    opts = _.defaults(opts, {
        look_at: [[0, 0, 0], [0, 0, -1], [0, 1, 0]],
        field_of_view_y: 45,
        aspect_ratio: 1,
        near_distance: 0.1,
        far_distance: 100
    });
    
    var field_of_view_y = opts.field_of_view_y;
    var aspect_ratio = opts.aspect_ratio;
    var near_distance = opts.near_distance;
    var far_distance = opts.far_distance;

    var current_projection;
    var current_view = mat4.lookAt(opts.look_at[0],
                                   opts.look_at[1],
                                   opts.look_at[2]);
    var vp_uniform = Shade.uniform("mat4");
    var view_uniform = Shade.uniform("mat4", current_view);

    function update_projection()
    {
        current_projection = mat4.perspective(field_of_view_y, aspect_ratio,
                                              near_distance, far_distance);
        vp_uniform.set(Shade.mul(mat4.product(current_projection, current_view)));
    }

    update_projection();

    var result = function(obj) {
        return result.project(obj);
    };
    result.look_at = function(eye, to, up) {
        current_view = mat4.lookAt(eye, to, up);
        view_uniform.set(current_view);
    };
    result.set_aspect_ratio = function(a) {
        aspect_ratio = a;
        update_projection();
        vp_uniform.set(Shade.mul(mat4.product(current_projection, current_view)));
    };
    result.set_near_distance = function(v) {
        near_distance = v;
        update_projection();
        vp_uniform.set(Shade.mul(mat4.product(current_projection, current_view)));
    };
    result.set_far_distance = function(v) {
        far_distance = v;
        update_projection();
        vp_uniform.set(Shade.mul(mat4.product(current_projection, current_view)));
    };
    result.set_field_of_view_y = function(v) {
        field_of_view_y = v;
        update_projection();
        vp_uniform.set(Shade.mul(mat4.product(current_projection, current_view)));
    };
    result.project = function(model_vertex) {
        var t = model_vertex.type;
        if (t.equals(Shade.Types.vec2))
            return vp_uniform.mul(Shade.vec(model_vertex, 0, 1));
        else if (t.equals(Shade.Types.vec3))
            return vp_uniform.mul(Shade.vec(model_vertex, 1));
        else if (t.equals(Shade.Types.vec4))
            return vp_uniform.mul(model_vertex);
        else
            throw "expected vec, got " + t.repr();
    };
    result.eye_vertex = function(model_vertex) {
        var t = model_vertex.type;
        if (t.equals(Shade.Types.vec2))
            return view_uniform.mul(Shade.vec(model_vertex, 0, 1));
        else if (t.equals(Shade.Types.vec3))
            return view_uniform.mul(Shade.vec(model_vertex, 1));
        else if (t.equals(Shade.Types.vec4))
            return view_uniform.mul(model_vertex);
        else
            throw "expected vec, got " + t.repr();
    };
    return result;
};
