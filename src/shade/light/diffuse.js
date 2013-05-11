Shade.Light.diffuse = function(light_opts)
{
    light_opts = _.defaults(light_opts || {}, {
        color: Shade.vec(1,1,1,1)
    });

    function vec3(v) {
        return v.type.equals(Shade.Types.vec4) ? v.swizzle("xyz").div(v.at(3)) : v;
    }
    var light_diffuse = light_opts.color;
    if (light_diffuse.type.equals(Shade.Types.vec4))
        light_diffuse = light_diffuse.swizzle("xyz");
    var light_pos = vec3(light_opts.position);

    return function(material_opts) {
        material_opts = _.defaults(material_opts || {}, {
            two_sided: false
        });
        var vertex_pos = vec3(material_opts.position);
        var material_color = material_opts.color;
        if (material_color.type.equals(Shade.Types.vec4))
            material_color = material_color.swizzle("xyz");

        var vertex_normal;
        if (_.isUndefined(material_opts.normal)) {
            vertex_normal = Shade.ThreeD.normal(vertex_pos);
        } else {
            vertex_normal = vec3(material_opts.normal).normalize();
        }

        var L = light_pos.sub(vertex_pos).normalize();
        var v = Shade.max(Shade.ifelse(material_opts.two_sided,
                                       L.dot(vertex_normal).abs(),
                                       L.dot(vertex_normal)), 0);

        var c = Shade.add(v.mul(light_diffuse).mul(material_color));

        return material_opts.color.type.equals(Shade.Types.vec4) ?
            Shade.vec(c, material_opts.color.a()) : c;
    };
};
