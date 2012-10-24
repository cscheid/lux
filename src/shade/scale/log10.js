Shade.Scale.log10 = function(opts)
{
    var new_opts = _.extend({
        transform: function(x) { return Shade.log(x).div(Math.log(10)); }
    }, opts);
    return Shade.Scale.transformed(new_opts);
};
