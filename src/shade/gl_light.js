// replicates something like an opengl light. 
// Fairly bare-bones for now (only diffuse, no attenuation)
// glLight is deprecated, functionality is being moved to Shade.Light
Shade.glLight = function(opts)
{
    console.log("DEPRECATED: use Shade.Light functionality");
    opts = _.defaults(opts || {}, {
        lightAmbient: Shade.vec(0,0,0,1),
        lightDiffuse: Shade.vec(1,1,1,1),
        twoSided: false,
        perVertex: false
    });
    function vec3(v) {
        return v.type.equals(Shade.Types.vec4) ? v.swizzle("xyz").div(v.at(3)) : v;
    }
    var lightPos = vec3(opts.lightPosition);
    var vertexPos = vec3(opts.vertex);
    var materialColor = opts.materialColor;
    var lightAmbient = opts.lightAmbient;
    var lightDiffuse = opts.lightDiffuse;
    var perVertex = opts.perVertex;
    var vertexNormal = (opts.normal.type.equals(Shade.Types.vec4) ? 
                        opts.normal.swizzle("xyz") : 
                        opts.normal).normalize();

    // this must be appropriately transformed
    var N = vertexNormal;
    var L = lightPos.sub(vertexPos).normalize();
    var v = Shade.max(Shade.ifelse(opts.twoSided,
                                   L.dot(N).abs(),
                                   L.dot(N)), 0);
    if (perVertex)
        v = Shade.perVertex(v);

    return Shade.add(lightAmbient.mul(materialColor),
                     v.mul(lightDiffuse).mul(materialColor));
};
