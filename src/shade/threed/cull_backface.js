Shade.ThreeD.cullBackface = Shade(function(position, normal, ccw)
{
    if (_.isUndefined(ccw)) ccw = Shade(true);
    ccw = ccw.ifelse(1, -1);
    return position.discardIf(normal.dot(Shade.vec(0,0,ccw)).le(0));
});
