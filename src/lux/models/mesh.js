Lux.Models.mesh = function(uSectors, vSectors) {
    var verts = [];
    var elements = [];
    if (_.isUndefined(vSectors)) vSectors = uSectors;
    if (vSectors <= 0) throw new Error("vSectors must be positive");
    if (uSectors <= 0) throw new Error("uSectors must be positive");
    vSectors = Math.floor(vSectors);
    uSectors = Math.floor(uSectors);
    var i, j;    
    for (i=0; i<=vSectors; ++i) {
        var v = (i / vSectors);
        for (j=0; j<=uSectors; ++j) {
            var u = (j / uSectors);
            verts.push(u, v);
        }
    }
    for (i=0; i<vSectors; ++i) {
        for (j=0; j<=uSectors; ++j) {
            elements.push(i * (uSectors + 1) + j,
                          (i + 1) * (uSectors + 1) + j);
        }
        // set up a non-rasterizing triangle in the middle of the strip
        // to transition between strips.
        if (i < vSectors-1) {
            elements.push((i + 1) * (uSectors + 1) + uSectors,
                          (i + 2) * (uSectors + 1),
                          (i + 2) * (uSectors + 1)
                         );
        }
    }

    var uvAttr = Shade(Lux.attributeBuffer({
        vertexArray: verts, 
        itemSize: 2
    }));
    return Lux.model({
        type: "triangleStrip",
        texCoord: uvAttr,
        vertex: uvAttr.mul(2).sub(1),
        elements: Lux.elementBuffer(elements)
    });
};
