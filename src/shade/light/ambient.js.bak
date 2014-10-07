// The most basic lighting component, ambient lighting simply multiplies
// the light color by the material color.
Shade.Light.ambient = function(light_opts)
{
    var color;
    if (light_opts.color.type.equals(Shade.Types.vec4)) {
        color = light_opts.color.swizzle("rgb");
    } else if (light_opts.color.type.equals(Shade.Types.vec3)) {
        color = light_opts.color;
    } else throw new Error("expected color of type vec3 or vec4, got " +
                           light_opts.color.type.repr() + " instead");
    return Shade(function(material_opts) {
        if (material_opts("color").type.equals(Shade.Types.vec4)) {
            return Shade.vec(
                material_opts("color").swizzle("xyz").mul(color),
                material_opts("color").swizzle("a")
            );
        } else {
            return material_opts("color").mul(color);
        }
    });
};
