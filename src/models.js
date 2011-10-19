var Models = {
    mesh: function(u_secs, v_secs) {
        var verts = [];
        var elements = [];
        if (typeof v_secs === "undefined") v_secs = u_secs;
        if (v_secs <= 0) throw "v_secs must be positive";
        if (u_secs <= 0) throw "u_secs must be positive";
        v_secs = Math.floor(v_secs);
        u_secs = Math.floor(u_secs);
        
        for (var i=0; i<=v_secs; ++i) {
            var v = (i / v_secs);
            for (var j=0; j<=u_secs; ++j) {
                var u = (j / u_secs);
                verts.push(u, v);
            }
        }
        for (i=0; i<v_secs; ++i) {
            for (var j=0; j<=u_secs; ++j) {
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
    },
    sphere: function(lat_secs, long_secs) {
        var verts = [];
        var elements = [];
        if (typeof long_secs === "undefined") long_secs = lat_secs;
        if (lat_secs <= 0) throw "lat_secs must be positive";
        if (long_secs <= 0) throw "long_secs must be positive";
        lat_secs = Math.floor(lat_secs);
        long_secs = Math.floor(long_secs);
        
        for (var i=0; i<=lat_secs; ++i) {
            var phi = (i / lat_secs);
            for (var j=0; j<long_secs; ++j) {
                var theta = (j / long_secs);
                verts.push(theta, phi);
            }
        }
        for (i=0; i<lat_secs; ++i) {
            for (var j=0; j<long_secs; ++j) {
                elements.push(i * long_secs + j,
                              i * long_secs + ((j + 1) % long_secs),
                              (i + 1) * long_secs + j,
                              i * long_secs + ((j + 1) % long_secs),
                              (i + 1) * long_secs + ((j + 1) % long_secs),
                              (i + 1) * long_secs + j);
            }
        }

        var S = Shade;
        var uv_attr = Facet.attribute_buffer(verts, 2);
        var phi = S.sub(S.mul(Math.PI, S.swizzle(uv_attr, "r")), Math.PI/2);
        var theta = S.mul(2 * Math.PI, S.swizzle(uv_attr, "g"));
        var cosphi = S.cos(phi);
        return Facet.model({
            type: "triangles",
            elements: Facet.element_buffer(elements),
            vertex: S.vec(S.sin(theta).mul(cosphi),
                          S.sin(phi),
                          S.cos(theta).mul(cosphi), 1)
        });
    },

    square: function() {
        var uv = Shade.make(Facet.attribute_buffer([0, 0, 1, 0, 0, 1, 1, 1], 2));
        return Facet.model({
            type: "triangles",
            elements: Facet.element_buffer([0, 1, 2, 1, 3, 2]),
            vertex: uv,
            tex_coord: uv
        });
    },

    flat_cube: function() {
        return Facet.model({
            type: "triangles",
            elements: [0,  1,  2,  0,  2,  3,
                       4,  5,  6,  4,  6,  7,
                       8,  9,  10, 8,  10, 11,
                       12, 13, 14, 12, 14, 15,
                       16, 17, 18, 16, 18, 19,
                       20, 21, 22, 20, 22, 23],
            vertex: [[ 1, 1,-1, -1, 1,-1, -1, 1, 1,  1, 1, 1,
                       1,-1, 1, -1,-1, 1, -1,-1,-1,  1,-1,-1,
                       1, 1, 1, -1, 1, 1, -1,-1, 1,  1,-1, 1,
                       1,-1,-1, -1,-1,-1, -1, 1,-1,  1, 1,-1,
                       -1, 1, 1, -1, 1,-1, -1,-1,-1, -1,-1, 1,
                       1, 1,-1,  1, 1, 1,  1,-1, 1,  1,-1,-1], 3],
            normal: [[ 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                       0,-1, 0, 0,-1, 0, 0,-1, 0, 0,-1, 0,
                       0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                       0, 0,-1, 0, 0,-1, 0, 0,-1, 0, 0,-1,
                       -1, 0, 0,-1, 0, 0,-1, 0, 0,-1, 0, 0,
                       1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0], 3],
            tex_coord: [[0,0, 1,0, 1,1, 0,1,
                         0,0, 1,0, 1,1, 0,1,
                         0,0, 1,0, 1,1, 0,1,
                         0,0, 1,0, 1,1, 0,1,
                         0,0, 1,0, 1,1, 0,1,
                         0,0, 1,0, 1,1, 0,1], 2]
        });
    }
};
