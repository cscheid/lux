Facet.Models.square = function() {
    var uv = Shade(Facet.attribute_buffer({
        vertex_array: [0, 0, 1, 0, 0, 1, 1, 1], 
        item_size: 2
    }));
    return Facet.model({
        type: "triangles",
        elements: Facet.element_buffer([0, 1, 2, 1, 3, 2]),
        vertex: uv,
        tex_coord: uv
    });
};
