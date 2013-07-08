Shade.Scale.Geo.latlong_to_hammer = Shade(function(lat, lon, B)
{
    if (_.isUndefined(B))
        B = Shade(2);
    else if (!B.type.equals(Shade.Types.float_t))
        throw new Error("B should have type float");
    var phi = lat,
        lambda = lon;
    var eta = phi.cos().mul(lambda.div(B).cos()).add(1).sqrt();
    var x = B.mul(Math.sqrt(2)).mul(phi.cos()).mul(lambda.div(B).sin()).div(eta);
    var y = phi.sin().mul(Math.sqrt(2)).div(eta);
    var out = Shade.vec(x, y);
});
