Shade.sinh = function(v)
{
    return Shade.exp(v).sub(v.neg().exp()).div(2);
};
Shade.Exp.sinh = function() { return Shade.sinh(this); };
