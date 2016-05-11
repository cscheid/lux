Shade.Scale.Geo.mercatorToSpherical = Shade(function(x, y)
{
    var lat = y.sinh().atan();
    var lon = x;
    return Shade.Scale.Geo.latlongToSpherical(lat, lon);
});
