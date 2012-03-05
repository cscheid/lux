//////////////////////////////////////////////////////////////////////////
// This is like a poor man's instancing/geometry shader. I need a
// general API for it.

Facet.Marks.aligned_rects = function(opts)
{
    opts = _.defaults(opts || {}, {
        mode: Facet.DrawingMode.standard,
        z: function() { return 0; }
    });
    if (!opts.elements) throw "elements is a required field";
    if (!opts.left)     throw "left is a required field";
    if (!opts.right)    throw "right is a required field";
    if (!opts.top)      throw "top is a required field";
    if (!opts.bottom)   throw "bottom is a required field";
    if (!opts.color)    throw "color is a required field";

    var vertex_index = Facet.attribute_buffer(_.range(opts.elements * 6), 1);
    var primitive_index = Shade.div(vertex_index, 6).floor();
    var vertex_in_primitive = Shade.mod(vertex_index, 6).floor();

    var left   = opts.left  (primitive_index),
        right  = opts.right (primitive_index),
        bottom = opts.bottom(primitive_index),
        top    = opts.top   (primitive_index);

    var lower_left  = Shade.vec(left,  bottom);
    var lower_right = Shade.vec(right, bottom);
    var upper_left  = Shade.vec(left,  top);
    var upper_right = Shade.vec(right, top);
    var vertex_map  = Shade.array([lower_left, upper_right, upper_left,
                                   lower_left, lower_right, upper_right]);
    var index_array = Shade.array([0, 2, 3, 0, 1, 2]);
    var index_in_vertex_primitive = index_array.at(vertex_in_primitive);

    return Facet.bake({
        type: "triangles",
        elements: vertex_index,
        mode: opts.mode
    }, {
        position: Shade.vec(vertex_map.at(vertex_in_primitive), 
                            opts.z(vertex_in_primitive)),
        color: opts.color(primitive_index, index_in_vertex_primitive)
    });
};
