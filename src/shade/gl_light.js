
// replicates something like an opengl light. 
// Fairly bare-bones for now (only diffuse, no attenuation)
Shade.gl_light = function(opts)
{
    var light_pos = opts.light_position;
    var vertex_pos = opts.vertex;
    var material_color = opts.material_color;
    var light_ambient = opts.light_ambient || Shade.vec(0,0,0,1);
    var light_diffuse = opts.light_diffuse || Shade.vec(1,1,1,1);
    var per_vertex = opts.per_vertex || false;
    var N = opts.normal; // this must be appropriately transformed
    var L = light_pos.sub(vertex_pos).normalize();
    var v = Shade.max(L.dot(N), 0);
    if (per_vertex)
        v = Shade.per_vertex(v);

    return Shade.add(light_ambient.mul(material_color),
                     v.mul(light_diffuse).mul(material_color));
};
