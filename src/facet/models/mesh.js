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

    var S = Shade;
    var uv_attr = Facet.attribute_buffer(verts, 2);
    var phi = S.sub(S.mul(Math.PI, S.swizzle(uv_attr, "r")), Math.PI/2);
    var theta = S.mul(2 * Math.PI, S.swizzle(uv_attr, "g"));
    var cosphi = S.cos(phi);
    return Facet.model({
        type: "triangle_strip",
        tex_coord: uv_attr,
        vertex: Shade.mul(uv_attr, 2).sub(Shade.vec(1, 1)),
        elements: Facet.element_buffer(elements)
    });
};
