Facet.Scale.Geo.latlong_to_spherical = function(lat, lon)
{
    lat = Shade.make(lat);
    lon = Shade.make(lon);
    var stretch = lat.cos();
    return Shade.vec(lon.sin().mul(stretch),
                     lat.sin(),
                     lon.cos().mul(stretch), 1);
};
