Shade.Light.diffuse = function(lightOpts)
{
    lightOpts = _.defaults(lightOpts || {}, {
        color: Shade.vec(1,1,1,1)
    });

    function vec3(v) {
        return v.type.equals(Shade.Types.vec4) ? v.swizzle("xyz").div(v.at(3)) : v;
    }
    var lightDiffuse = lightOpts.color;
    if (lightDiffuse.type.equals(Shade.Types.vec4))
        lightDiffuse = lightDiffuse.swizzle("xyz");
    var lightPos = vec3(lightOpts.position);

    return Shade(function(materialOpts) {
        var twoSided;
        if (materialOpts.hasField("twoSided")) {
            twoSided = materialOpts("twoSided");
        } else {
            twoSided = Shade(false);
        }

        var vertexPos = vec3(materialOpts("position"));
        var materialColor = materialOpts("color");

        if (materialColor.type.equals(Shade.Types.vec4))
            materialColor = materialColor.swizzle("xyz");

        var vertexNormal;
        if (materialOpts.hasField("normal")) {
            vertexNormal = vec3(materialOpts("normal")).normalize();
        } else {
            vertexNormal = Shade.ThreeD.normal(vertexPos);
        }

        var L = lightPos.sub(vertexPos).normalize();
        var v = Shade.max(Shade.ifelse(twoSided,
                                       L.dot(vertexNormal).abs(),
                                       L.dot(vertexNormal)), 0);

        var c = Shade.add(v.mul(lightDiffuse).mul(materialColor));

        return materialOpts("color").type.equals(Shade.Types.vec4) ?
            Shade.vec(c, materialOpts("color").a()) : c;
    });
};
