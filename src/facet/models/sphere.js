Facet.Models.sphere = function(lat_secs, long_secs) {
    var verts = [];
    var elements = [];
    if (_.isUndefined(long_secs)) long_secs = lat_secs;
    if (lat_secs <= 0) throw "lat_secs must be positive";
    if (long_secs <= 0) throw "long_secs must be positive";
    lat_secs = Math.floor(lat_secs);
    long_secs = Math.floor(long_secs);
    var i, j, phi, theta;    
    for (i=0; i<=lat_secs; ++i) {
        phi = (i / lat_secs);
        for (j=0; j<long_secs; ++j) {
            theta = (j / long_secs);
            verts.push(theta, phi);
        }
    }
    for (i=0; i<lat_secs; ++i) {
        for (j=0; j<long_secs; ++j) {
            elements.push(i * long_secs + j,
                          i * long_secs + ((j + 1) % long_secs),
                          (i + 1) * long_secs + j,
                          i * long_secs + ((j + 1) % long_secs),
                          (i + 1) * long_secs + ((j + 1) % long_secs),
                          (i + 1) * long_secs + j);
        }
    }

    var S = Shade;
    var uv_attr = Facet.attribute_buffer({ vertex_array: verts, item_size: 2});
    phi = S.sub(S.mul(Math.PI, S.swizzle(uv_attr, "r")), Math.PI/2);
    theta = S.mul(2 * Math.PI, S.swizzle(uv_attr, "g"));
    var cosphi = S.cos(phi);
    return Facet.model({
        type: "triangles",
        elements: Facet.element_buffer(elements),
        vertex: S.vec(S.sin(theta).mul(cosphi),
                      S.sin(phi),
                      S.cos(theta).mul(cosphi), 1)
    });
};
