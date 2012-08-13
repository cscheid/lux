Shade.Scale.linear = function(opts)
{
    opts = _.defaults(opts || {}, {
        domain: [0, 1],
        range: [0, 1]
    });

    //////////////////////////////////////////////////////////////////////////
    // typechecking

    // that condition is written awkwardly so it catches
    // opts.domain === undefined as well.
    if (!(opts.domain.length >= 2)) { 
        throw "Shade.Scale.linear requires arrays of length at least 2";
    }
    if (opts.domain.length !== opts.range.length) {
        throw "Shade.Scale.linear requires domain and range to be arrays of the same length";
    }

    opts.domain = _.map(opts.domain, Shade.make);
    opts.range = _.map(opts.range, Shade.make);

    var domain_types = _.map(opts.domain, function(v) { return v.type; });
    var range_types =  _.map(opts.range,  function(v) { return v.type; });
    var allowable_types = [
        Shade.Types.float_t,
        Shade.Types.vec2,
        Shade.Types.vec3,
        Shade.Types.vec4
    ];
    // if (!(domain_types[0].equals(Shade.Types.float_t)))
    //     throw "Shade.Scale.linear requires domain type to be float";
    if (!(_.any(allowable_types, function(v) { return v.equals(domain_types[0]); })))
        throw "Shade.Scale.linear requires domain type to be one of {float, vec2, vec3, vec4}";
    if (!(_.all(domain_types, function(v) { return v.equals(domain_types[0]); })))
        throw "Shade.Scale.linear requires domain elements to have the same type";
    if (!(_.any(allowable_types, function(v) { return v.equals(range_types[0]); })))
        throw "Shade.Scale.linear requires range type to be one of {float, vec2, vec3, vec4}";
    if (!(_.all(range_types, function(v) { return v.equals(range_types[0]); })))
        throw "Shade.Scale.linear requires range elements to have the same type";

    // Special-case the two-element scale for performance
    if (opts.domain.length === 2) {
        var f1 = opts.domain[0];
        var f2 = opts.domain[1];
        var t1 = opts.range[0];
        var t2 = opts.range[1];
        var df = Shade.sub(f2, f1);
        var dt = Shade.sub(t2, t1);

        return Shade(function(x) {
            return x.sub(f1).mul(dt.div(df)).add(t1);
        });
    } else {
        var domain_array = Shade.array(opts.domain);
        var range_array = Shade.array(opts.range);
        
        return Shade(function(v) {
            var bs = domain_array.locate(v);
            var u = v.sub(bs("vl")).div(bs("vr").sub(bs("vl")));
            var color = Shade.mix(range_array.at(bs("l")), range_array.at(bs("r")), u);
            return color;
        });
    }
};
