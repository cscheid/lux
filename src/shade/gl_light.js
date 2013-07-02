// replicates something like an opengl light. 
// Fairly bare-bones for now (only diffuse, no attenuation)
// gl_light is deprecated, functionality is being moved to Shade.Light
Shade.gl_light = function(opts)
{
    console.log("DEPRECATED: use Shade.Light functionality");
    opts = _.defaults(opts || {}, {
        light_ambient: Shade.vec(0,0,0,1),
        light_diffuse: Shade.vec(1,1,1,1),
        two_sided: false,
        per_vertex: false
    });
    function vec3(v) {
        return v.type.equals(Shade.Types.vec4) ? v.swizzle("xyz").div(v.at(3)) : v;
    }
    var light_pos = vec3(opts.light_position);
    var vertex_pos = vec3(opts.vertex);
    var material_color = opts.material_color;
    var light_ambient = opts.light_ambient;
    var light_diffuse = opts.light_diffuse;
    var per_vertex = opts.per_vertex;
    var vertex_normal = (opts.normal.type.equals(Shade.Types.vec4) ? 
                         opts.normal.swizzle("xyz") : 
                         opts.normal).normalize();

    // this must be appropriately transformed
    var N = vertex_normal;
    var L = light_pos.sub(vertex_pos).normalize();
    var v = Shade.max(Shade.ifelse(opts.two_sided,
                                   L.dot(N).abs(),
                                   L.dot(N)), 0);
    if (per_vertex)
        v = Shade.per_vertex(v);

    return Shade.add(light_ambient.mul(material_color),
                     v.mul(light_diffuse).mul(material_color));
};
