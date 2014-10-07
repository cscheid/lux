Shade.Colors.alpha = function(color, alpha)
{
    color = Shade.make(color);
    alpha = Shade.make(alpha);
    if (!alpha.type.equals(Shade.Types.float_t))
        throw new Error("alpha parameter must be float");
    if (color.type.equals(Shade.Types.vec4)) {
        return Shade.vec(color.swizzle("rgb"), alpha);
    }
    if (color.type.equals(Shade.Types.vec3)) {
        return Shade.vec(color, alpha);
    }
    throw new Error("color parameter must be vec3 or vec4");
};

Shade.Exp.alpha = function(alpha)
{
    return Shade.Colors.alpha(this, alpha);
};
