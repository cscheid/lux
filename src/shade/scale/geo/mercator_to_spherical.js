Shade.Scale.Geo.mercator_to_spherical = Shade(function(x, y)
{
    var lat = y.sinh().atan();
    var lon = x;
    return Shade.Scale.Geo.latlong_to_spherical(lat, lon);
});
