Shade.sinh = Shade(function(v)
{
    return v.exp().sub(v.neg().exp()).div(2);
});
Shade.Exp.sinh = function() { return Shade.sinh(this); };
