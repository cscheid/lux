// FIXME: alpha=0 points should discard because of depth buffer
Facet.Marks.dots = function(opts)
{
    opts = _.defaults(opts, {
        fill_color: Shade.vec(0,0,0,1),
        stroke_color: Shade.vec(0,0,0,1),
        point_diameter: 5,
        stroke_width: 2,
        mode: Facet.DrawingMode.over,
        alpha: true,
        plain: false
    });

    if (!opts.position)
        throw "Facet.Marks.dots expects parameter 'position'";
    if (!opts.elements)
        throw "Facet.Marks.dots expects parameter 'elements'";

    var S = Shade;

    var fill_color     = Shade.make(opts.fill_color);
    var stroke_color   = Shade.make(opts.stroke_color);
    var point_diameter = Shade.make(opts.point_diameter);
    var stroke_width   = Shade.make(opts.stroke_width).add(1);
    var use_alpha      = Shade.make(opts.alpha);
    
    var model_opts = {
        type: "points",
        vertex: opts.position,
        elements: opts.elements
    };

    var model = Facet.model(model_opts);

    var distance_to_center_in_pixels = S.pointCoord().sub(S.vec(0.5, 0.5))
        .length().mul(point_diameter);
    var point_radius = point_diameter.div(2);
    var distance_to_border = point_radius.sub(distance_to_center_in_pixels);
    var gl_Position = model.vertex;

    var no_alpha = S.mix(fill_color, stroke_color,
                         S.clamp(stroke_width.sub(distance_to_border), 0, 1));
    
    var plain_fill_color = fill_color;
    var alpha_fill_color = 
        S.selection(use_alpha,
                    no_alpha.mul(S.vec(1,1,1,S.clamp(distance_to_border, 0, 1))),
                    no_alpha)
        .discard_if(distance_to_center_in_pixels.gt(point_radius));

    var result = Facet.bake(model, {
        position: gl_Position,
        point_size: point_diameter,
        color: Shade.selection(opts.plain, plain_fill_color, alpha_fill_color),
        mode: opts.mode
    });
    // FIXME there must be a better way to do this.
    result.gl_Position = gl_Position;
    return result;
};
