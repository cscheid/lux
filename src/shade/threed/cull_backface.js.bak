Shade.ThreeD.cull_backface = Shade(function(position, normal, ccw)
{
    if (_.isUndefined(ccw)) ccw = Shade(true);
    ccw = ccw.ifelse(1, -1);
    return position.discard_if(normal.dot(Shade.vec(0,0,ccw)).le(0));
});
