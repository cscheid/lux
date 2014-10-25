Shade.Scale.Geo.mercatorToLatlong = Shade(function(x, y)
{
    // http://stackoverflow.com/a/1166095
    return Shade.vec(y.sinh().atan(), x);
});
