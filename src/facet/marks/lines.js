Facet.Marks.lines = function(opts)
{
    opts = _.defaults(opts || {}, {
        mode: Facet.DrawingMode.standard,
        z: function() { return 0; }
    });

    if (_.isUndefined(opts.elements)) throw "elements is a required field";
    if (_.isUndefined(opts.color))    throw "color is a required field";
    if (_.isUndefined(opts.position) && 
        (_.isUndefined(opts.x) || _.isUndefined(opts.y))) {
        throw "either position or x and y are required fields";
    }

    var vertex_index        = Facet.attribute_buffer({
        vertex_array: _.range(opts.elements * 2), 
        item_size: 1
    });
    var primitive_index     = Shade.div(vertex_index, 2).floor();
    var vertex_in_primitive = Shade.mod(vertex_index, 2).floor();

    var position = opts.position 
        ? opts.position(primitive_index, vertex_in_primitive)
        : Shade.vec(opts.x(primitive_index, vertex_in_primitive),
                    opts.y(primitive_index, vertex_in_primitive),
                    opts.z(primitive_index, vertex_in_primitive));
    return Facet.bake({
        type: "lines",
        elements: vertex_index,
        mode: opts.mode
    }, {
        position: position,
        color: opts.color(primitive_index, vertex_in_primitive)
    });
};
