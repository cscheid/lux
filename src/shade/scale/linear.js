Shade.Scale.linear = function(opts)
{
    var allowable_types = [
        Shade.Types.float_t,
        Shade.Types.vec2,
        Shade.Types.vec3,
        Shade.Types.vec4
    ];
    var vec_types = [
        Shade.Types.vec2,
        Shade.Types.vec3,
        Shade.Types.vec4
    ];
    function is_any(set) {
        return function(t) {
            return _.any(set, function(v) { return v.equals(t); });
        };
    }
    function all_same(set) {
        return _.all(set, function(v) { return v.equals(set[0]); });
    }

    opts = _.defaults(opts || {}, {
        domain: [0, 1],
        range: [0, 1]
    });

    //////////////////////////////////////////////////////////////////////////
    // typechecking

    // that condition is written awkwardly so it catches
    // opts.domain === undefined as well.
    if (!(opts.domain.length >= 2)) { 
        throw new Error("Shade.Scale.linear requires arrays of length at least 2");
    }
    if (opts.domain.length !== opts.range.length) {
        throw new Error("Shade.Scale.linear requires domain and range to be arrays of the same length");
    }

    opts.domain = _.map(opts.domain, Shade.make);
    opts.range = _.map(opts.range, Shade.make);

    var domain_types = _.map(opts.domain, function(v) { return v.type; });
    var range_types =  _.map(opts.range,  function(v) { return v.type; });

    if (!is_any(allowable_types)(domain_types[0]))
        throw new Error("Shade.Scale.linear requires domain type to be one of {float, vec2, vec3, vec4}");
    if (!all_same(domain_types))
        throw new Error("Shade.Scale.linear requires domain elements to have the same type");
    if (!is_any(allowable_types)(range_types[0]))
        throw new Error("Shade.Scale.linear requires range type to be one of {float, vec2, vec3, vec4}");
    if (!all_same(range_types))
        throw new Error("Shade.Scale.linear requires range elements to have the same type");
    if (is_any(vec_types)(domain_types[0]) && (!domain_types[0].equals(range_types[0])))
        throw new Error("Shade.Scale.linear for vec types require equal domain and range types");
    if (opts.domain.length < 2 || opts.range.length < 2)
        throw new Error("Shade.Scale.linear requires domain and range to have at least two elements");

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
        var dt = domain_array.array_element_type;

        return Shade(function(x) {
            function create_shade(i) {
                var segment_at_x = Shade.Scale.linear({
                    domain: [ opts.domain[i], opts.domain[i+1] ],
                    range:  [ opts.range[i],  opts.range[i+1] ] })(x);
                if (i === opts.domain.length-2) {
                    return segment_at_x;
                } else {
                    return Shade.ifelse(x.lt(opts.domain[i+1]),
                                        segment_at_x,
                                        create_shade(i+1));
                }
            }
            return create_shade(0);
        });
    }

/*

 The previous version of the code uses Shade.Array.locate to binary-search the array.
 However, it turns out that we're not allowed to read from arbitrary locations in an
 array (even if we could prove their safety) in WebGL's version of GLSL, which means
 I believe, in principle, that binary search is not implementable inside a for loop 
 in WebGL GLSL. (?!)

 I have temporarily replaced it with a dumb loop over the array.

        var result;

        if (dt.equals(Shade.Types.float_t))
            result = Shade(function(v) {
                var bs = domain_array.locate(v);
                var u = v.sub(bs("vl")).div(bs("vr").sub(bs("vl")));
                var output = Shade.mix(range_array.at(bs("l")), range_array.at(bs("r")), u);
                return output;
            });
        else if (_.any(["vec2", "vec3", "vec4"], function(t) 
                       {
                           return dt.equals(Shade.Types[t]);
                       })) {
            result = Shade(function(v) {
                var result = _.range(dt.vec_dimension()).map(function(i) {
                    var bs = domain_array.locate(v.at(i), function(array_value) {
                        return array_value.at(i);
                    });
                    var u = v.sub(bs("vl")).div(bs("vr").sub(bs("vl")));
                    var output = Shade.mix(range_array.at(bs("l")).at(i), 
                                           range_array.at(bs("r")).at(i), u);
                    return output;
                });
                return Shade.vec.apply(this, result);
            });
        } else {
            throw new Error("internal error on Shade.Scale.linear");
        }
        return result;
*/
};
