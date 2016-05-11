Shade.Scale.Geo.latlongToSpherical = Shade(function(lat, lon)
{
    var stretch = lat.cos();
    return Shade.vec(lon.sin().mul(stretch),
                     lat.sin(),
                     lon.cos().mul(stretch), 1);
});
