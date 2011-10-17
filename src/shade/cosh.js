Shade.cosh = function(v)
{
    return Shade.exp(v).add(v.neg().exp()).div(2);
};
Shade.Exp.cosh = function() { return Shade.cosh(this); };
