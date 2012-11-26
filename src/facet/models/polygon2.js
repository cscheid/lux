Facet.Models.polygon2 = function(opts) {
    opts = _.defaults(opts, {
        type: "triangles",
        keep_array: false
    });
    var poly = opts.contour;
    var style = opts.type;
    var keep_array = opts.keep_array;
    var vertexColor = opts.vertex_color;
    if (_.isUndefined(poly)) {
        throw "Facet.Models.polygon requires contour option";
    };

    var triangles = Facet.Geometry.triangulate({ contour: poly });
    var verts = [];
    var elements = [].concat.apply([], triangles);
    _.each(poly, function(v) { verts.push.apply(verts, v); });

    var uv = Shade(Facet.attribute_buffer({
        vertex_array: verts, 
        item_size: 2, 
        keep_array: keep_array
    }));

    return Facet.model({
        type: style,
        elements: Facet.element_buffer(elements),
        vertex: uv
    });
};

