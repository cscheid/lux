// FIXME can't be Shade(function()...) because Shade() hasn't been defined yet.
Shade.Scale.Geo.latlong_to_spherical = function(lat, lon)
{
    lat = Shade(lat);
    lon = Shade(lon);
    var stretch = lat.cos();
    return Shade.vec(lon.sin().mul(stretch),
                     lat.sin(),
                     lon.cos().mul(stretch), 1);
};
