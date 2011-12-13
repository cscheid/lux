Facet.Models.square = function() {
    var uv = Shade.make(Facet.attribute_buffer([0, 0, 1, 0, 0, 1, 1, 1], 2));
    return Facet.model({
        type: "triangles",
        elements: Facet.element_buffer([0, 1, 2, 1, 3, 2]),
        vertex: uv,
        tex_coord: uv
    });
};
