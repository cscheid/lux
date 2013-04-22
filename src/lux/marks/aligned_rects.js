//////////////////////////////////////////////////////////////////////////
// This is like a poor man's instancing/geometry shader. I need a
// general API for it.

Lux.Marks.aligned_rects = function(opts)
{
    opts = _.defaults(opts || {}, {
        mode: Lux.DrawingMode.standard,
        z: function() { return 0; }
    });
    if (!opts.elements) throw "elements is a required field";
    if (!opts.left)     throw "left is a required field";
    if (!opts.right)    throw "right is a required field";
    if (!opts.top)      throw "top is a required field";
    if (!opts.bottom)   throw "bottom is a required field";
    if (!opts.color)    throw "color is a required field";

    var vertex_index = Lux.attribute_buffer({ 
        vertex_array: _.range(opts.elements * 6), 
        item_size: 1
    });
    var primitive_index = Shade.div(vertex_index, 6).floor();
    var vertex_in_primitive = Shade.mod(vertex_index, 6).floor();

    // aif == apply_if_function
    var aif = function(f, params) {
        if (lux_typeOf(f) === 'function')
            return f.apply(this, params);
        else
            return f;
    };

    var left   = aif(opts.left,   [primitive_index]),
        right  = aif(opts.right,  [primitive_index]),
        bottom = aif(opts.bottom, [primitive_index]),
        top    = aif(opts.top,    [primitive_index]),
        color  = aif(opts.color,  [primitive_index, index_in_vertex_primitive]),
        z      = aif(opts.z,      [primitive_index]);

    var lower_left  = Shade.vec(left,  bottom);
    var lower_right = Shade.vec(right, bottom);
    var upper_left  = Shade.vec(left,  top);
    var upper_right = Shade.vec(right, top);
    var vertex_map  = Shade.array([lower_left, upper_right, upper_left,
                                   lower_left, lower_right, upper_right]);
    var index_array = Shade.array([0, 2, 3, 0, 1, 2]);
    var index_in_vertex_primitive = index_array.at(vertex_in_primitive);

    return Lux.bake({
        type: "triangles",
        elements: vertex_index
    }, {
        position: Shade.vec(vertex_map.at(vertex_in_primitive), z),
        color: color,
        pick_id: opts.pick_id,
        mode: opts.mode
    });
};
