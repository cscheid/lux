Shade.Scale.transformed = function(opts)
{
    if (_.isUndefined(opts.transform)) {
        throw new Error("Shade.Scale.transform expects a domain transformation function");
    };
    var linearScale = Shade.Scale.linear(opts);
    return Shade(function(x) {
        return linearScale(opts.transform(x));
    });
};
