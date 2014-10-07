/*
 * Shade.Exp.append is a convenient way of chaining Shade.vec calls:
 * 
 * Shade.vec(Shade.vec(foo, bar), baz, bah) becomes
 * Shade.vec(foo, bar).append(bar, baz) or
 * Shade.vec(foo, bar).append(bar).append(baz), etc.
 * 
 * FIXME: should I just call this 'vec'?
 */

Shade.Exp.append = function()
{
    return Shade.vec.apply(this, [this].concat(_.toArray(arguments)));
};
