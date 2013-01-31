Shade.Colors.Brewer = {};

// based on d3/src/scale/category.js, which is in turn based on Cynthia Brewer's
// colorbrewer.org

Shade.Colors.Brewer.category10 = function(alpha) {
    if (_.isUndefined(alpha))
        alpha = 1;
    return _.map([
        "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
        "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
    ], function(spec) {
        return Shade.color(spec, alpha);
    });
};
