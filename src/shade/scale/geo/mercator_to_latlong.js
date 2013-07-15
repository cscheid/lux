Shade.Scale.Geo.mercator_to_latlong = Shade(function(x, y)
{
    // http://stackoverflow.com/a/1166095
    x = x.mul(2*Math.PI).sub(Math.PI);
    y = y.mul(2*Math.PI).sub(Math.PI);
    return Shade.vec(y.sinh().atan(), x);
});
