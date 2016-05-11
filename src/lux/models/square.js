Lux.Models.square = function() {
    var uv = Shade(Lux.attributeBuffer({
        vertexArray: [0, 0, 1, 0, 0, 1, 1, 1], 
        itemSize: 2
    }));
    return Lux.model({
        type: "triangles",
        elements: Lux.elementBuffer([0, 1, 2, 1, 3, 2]),
        vertex: uv,
        texCoord: uv
    });
};
