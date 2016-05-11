/*
 * nearest-neighbor interpolation
 */

Shade.Scale.ordinal = function(opts)
{
    function allSame(set) {
        return _.all(set, function(v) { return v.equals(set[0]); });
    }
    if (!(opts.range.length >= 2)) { 
        throw new Error("Shade.Scale.ordinal requires arrays of length at least 2");
    }
    var range = _.map(opts.range, Shade.make);
    var rangeTypes = _.map(range,  function(v) { return v.type; });
    if (!allSame(rangeTypes))
        throw new Error("Shade.Scale.linear requires range elements to have the same type");

    var choose = Shade.Utils.choose(range);

    return Shade(function(v) {
        return choose(v.asFloat().add(0.5));
    });
};
