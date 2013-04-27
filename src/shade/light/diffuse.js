Shade.Light.diffuse = function(light_opts)
{
    light_opts = _.defaults(light_opts || {}, {
        color: Shade.vec(1,1,1,1)
    });

    function vec3(v) {
        return v.type.equals(Shade.Types.vec4) ? v.swizzle("xyz").div(v.at(3)) : v;
    }
    var light_diffuse = light_opts.color;
    var light_pos = vec3(light_opts.light_position);

    return function(material_opts) {
        material_opts = _.defaults(material_opts || {}, { 
            two_sided: false
        });
        var vertex_pos = vec3(material_opts.vertex);
        var material_color = material_opts.material;

        var vertex_normal = (material_opts.normal.type.equals(Shade.Types.vec4) ? 
                             material_opts.normal.swizzle("xyz") : 
                             material_opts.normal).normalize();

        var N = vertex_normal;
        var L = light_pos.sub(vertex_pos).normalize();
        var v = Shade.max(Shade.ifelse(material_opts.two_sided,
                                       L.dot(N).abs(),
                                       L.dot(N)), 0);

        return Shade.add(v.mul(light_diffuse).mul(material_color));
    };
};
