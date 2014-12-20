Lux.Models.sphere = function(latSecs, longSecs) {
    if (_.isUndefined(latSecs)) {
        latSecs = 5;
        longSecs = 5;
    }
    var verts = [];
    var elements = [];
    if (_.isUndefined(longSecs)) longSecs = latSecs;
    if (latSecs <= 0) throw new Error("latSecs must be positive");
    if (longSecs <= 0) throw new Error("longSecs must be positive");
    latSecs = Math.floor(latSecs);
    longSecs = Math.floor(longSecs);
    var i, j, phi, theta;
    for (i=0; i<=latSecs; ++i) {
        phi = (i / latSecs);
        for (j=0; j<=longSecs; ++j) {
            theta = (j / longSecs);
            verts.push(theta, phi);
        }
    }
    for (i=0; i<latSecs; ++i) {
        for (j=0; j<longSecs; ++j) {
            var thisX = j;
            var nextX = j+1;
            var thisY = i;
            var nextY = i+1;
            elements.push(thisY * (longSecs + 1) + thisX,
                          thisY * (longSecs + 1) + nextX,
                          nextY * (longSecs + 1) + thisX,
                          thisY * (longSecs + 1) + nextX,
                          nextY * (longSecs + 1) + nextX,
                          nextY * (longSecs + 1) + thisX);
        }
    }

    var S = Shade;
    var uvAttr = Lux.attributeBuffer({ vertexArray: verts, itemSize: 2});
    theta = S.mul(2 * Math.PI, S.swizzle(uvAttr, "r"));
    phi = S.sub(S.mul(Math.PI, S.swizzle(uvAttr, "g")), Math.PI/2);
    var cosphi = S.cos(phi);
    var position = S.vec(S.sin(theta).mul(cosphi),
                         S.sin(phi),
                         S.cos(theta).mul(cosphi), 1);
    return Lux.model({
        type: "triangles",
        elements: Lux.elementBuffer(elements),
        vertex: position,
        texCoord: uvAttr,
        normal: position
    });
};
