Facet.Marks.scatterplot = function(opts)
{
    opts = _.defaults(opts, {
        x_scale: function (x) { return x; },
        y_scale: function (x) { return x; },
        xy_scale: function (x) { return x; }
    });

    function to_opengl(x) { return x.mul(2).sub(1); }
    var S = Shade;
    
    var x_scale = opts.x_scale;
    var y_scale = opts.y_scale;

    var position, elements;

    if (!_.isUndefined(opts.x)) {
        position = S.vec(to_opengl(opts.x_scale(opts.x)), 
                         to_opengl(opts.y_scale(opts.y)));
    } else if (!_.isUndefined(opts.xy)) {
        position = opts.xy_scale(opts.xy).mul(2).sub(S.vec(1,1));
    }

    if (opts.model) {
        elements = opts.model.elements;
    } else if (opts.elements) {
        elements = opts.elements;
    }
    return Facet.Marks.dots({
        position: position,
        elements: elements,
        fill_color: opts.fill_color,
        stroke_color: opts.stroke_color,
        point_diameter: opts.point_diameter,
        stroke_width: opts.stroke_width,
        mode: opts.mode,
        alpha: opts.alpha,
        plain: opts.plain,
        pick_id: opts.pick_id
    });
};
