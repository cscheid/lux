Shade.Scale.Geo.latlong_to_mercator = Shade(function(lat, lon)
{
    lat = lat.div(2).add(Math.PI/4).tan().log();
    return Shade.vec(lat, lon);
});
