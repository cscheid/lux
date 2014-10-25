Shade.Scale.log2 = function(opts)
{
    var newOpts = _.extend({
        transform: function(x) { return Shade.log(x).div(Math.log(2)); }
    }, opts);
    return Shade.Scale.transformed(newOpts);
};
