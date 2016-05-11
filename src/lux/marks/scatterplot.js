Lux.Marks.scatterplot = function(opts)
{
    opts = _.defaults(opts, {
        xScale: function (x) { return x; },
        yScale: function (x) { return x; },
        xyScale: function (x) { return x; }
    });

    function toOpengl(x) { return x.mul(2).sub(1); }
    var S = Shade;
    
    var xScale = opts.xScale;
    var yScale = opts.yScale;

    var position, elements;

    if (!_.isUndefined(opts.x)) {
        position = S.vec(toOpengl(opts.xScale(opts.x)), 
                         toOpengl(opts.yScale(opts.y)));
    } else if (!_.isUndefined(opts.xy)) {
        position = opts.xyScale(opts.xy).mul(2).sub(S.vec(1,1));
    }

    if (opts.model) {
        elements = opts.model.elements;
    } else if (opts.elements) {
        elements = opts.elements;
    }
    return Lux.Marks.dots({
        position: position,
        elements: elements,
        fillColor: opts.fillColor,
        strokeColor: opts.strokeColor,
        pointDiameter: opts.pointDiameter,
        strokeWidth: opts.strokeWidth,
        mode: opts.mode,
        alpha: opts.alpha,
        plain: opts.plain,
        pickId: opts.pickId
    });
};
