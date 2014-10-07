Lux.Geometry.triangulate = function(opts) {
    var poly = _.map(opts.contour, function(contour) {
        var p = [];
        for (var i=0; i<contour.length; ++i) {
            p.push(contour[i][0], contour[i][1]);
        }
        return p;
    });
    return Lux.Lib.tessellate(poly);
};
