// FIXME This should be Shade.neg = Shade.make(function() ...
// but before I do that I have to make sure that at this point
// in the source Shade.make actually exists.

Shade.neg = function(x)
{
    return Shade.sub(0, x);
};
Shade.Exp.neg = function() { return Shade.neg(this); };

