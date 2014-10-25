Shade.Scale.Geo.latlongToMercator = Shade(function(lat, lon)
{
    lat = lat.div(2).add(Math.PI/4).tan().log();
    return Shade.vec(lon, lat);
});
