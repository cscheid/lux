Shade.Scale.log = function(opts)
{
    var newOpts = _.extend({
        transform: function(x) { return Shade.log(x); }
    }, opts);
    return Shade.Scale.transformed(newOpts);
};
