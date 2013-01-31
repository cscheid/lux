/*
 * nearest-neighbor interpolation
 */

Shade.Scale.ordinal = function(opts)
{
    function all_same(set) {
        return _.all(set, function(v) { return v.equals(set[0]); });
    }
    if (!(opts.range.length >= 2)) { 
        throw "Shade.Scale.ordinal requires arrays of length at least 2";
    }
    var range = _.map(opts.range, Shade.make);
    var range_types = _.map(range,  function(v) { return v.type; });
    if (!all_same(range_types))
        throw "Shade.Scale.linear requires range elements to have the same type";

    var choose = Shade.Utils.choose(range);

    return Shade(function(v) {
        return choose(v.as_float().add(0.5));
    });
};
