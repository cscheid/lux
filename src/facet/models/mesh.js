Facet.Models.mesh = function(u_secs, v_secs) {
    var verts = [];
    var elements = [];
    if (_.isUndefined(v_secs)) v_secs = u_secs;
    if (v_secs <= 0) throw "v_secs must be positive";
    if (u_secs <= 0) throw "u_secs must be positive";
    v_secs = Math.floor(v_secs);
    u_secs = Math.floor(u_secs);
    var i, j;    
    for (i=0; i<=v_secs; ++i) {
        var v = (i / v_secs);
        for (j=0; j<=u_secs; ++j) {
            var u = (j / u_secs);
            verts.push(u, v);
        }
    }
    for (i=0; i<v_secs; ++i) {
        for (j=0; j<=u_secs; ++j) {
            elements.push(i * (u_secs + 1) + j,
                          (i + 1) * (u_secs + 1) + j);
        }
        // set up a non-rasterizing triangle in the middle of the strip
        // to transition between strips.
        if (i < v_secs-1) {
            elements.push((i + 1) * (u_secs + 1) + u_secs,
                          (i + 2) * (u_secs + 1),
                          (i + 2) * (u_secs + 1)
                         );
        }
    }

    var uv_attr = Shade.make(Facet.attribute_buffer(verts, 2));
    return Facet.model({
        type: "triangle_strip",
        tex_coord: uv_attr,
        vertex: uv_attr.mul(2).sub(1),
        elements: Facet.element_buffer(elements)
    });
};
