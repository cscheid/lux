Shade.Scale.log10 = function(opts)
{
    var newOpts = _.extend({
        transform: function(x) { return Shade.log(x).div(Math.log(10)); }
    }, opts);
    return Shade.Scale.transformed(newOpts);
};
