Shade.ThreeD.cull_backface = Shade(function(position, ccw)
{
    if (_.isUndefined(ccw)) ccw = Shade(true);
    ccw = ccw.ifelse(1, -1);
    var n = Shade.ThreeD.normal(position);
    return position.discard_if(n.cross(Shade.vec(0,0,ccw)).z().gt(0));
});
