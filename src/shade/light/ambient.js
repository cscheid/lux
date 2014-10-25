// The most basic lighting component, ambient lighting simply multiplies
// the light color by the material color.
Shade.Light.ambient = function(lightOpts)
{
    var color;
    if (lightOpts.color.type.equals(Shade.Types.vec4)) {
        color = lightOpts.color.swizzle("rgb");
    } else if (lightOpts.color.type.equals(Shade.Types.vec3)) {
        color = lightOpts.color;
    } else throw new Error("expected color of type vec3 or vec4, got " +
                           lightOpts.color.type.repr() + " instead");
    return Shade(function(materialOpts) {
        if (materialOpts("color").type.equals(Shade.Types.vec4)) {
            return Shade.vec(
                materialOpts("color").swizzle("xyz").mul(color),
                materialOpts("color").swizzle("a")
            );
        } else {
            return materialOpts("color").mul(color);
        }
    });
};
