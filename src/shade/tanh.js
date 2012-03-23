Shade.tanh = Shade(function(v)
{
    return v.sinh().div(v.cosh());
});
Shade.Exp.tanh = function() { return Shade.tanh(this); };
