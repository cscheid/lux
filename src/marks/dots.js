// FIXME: alpha=0 points should discard because of depth buffer
Facet.Marks.dots = function(opts)
{
    opts = _.defaults(opts, {
        x_scale: function (x) { return x; },
        y_scale: function (x) { return x; },
        xy_scale: function (x) { return x; },
        fill_color: Shade.vec(0,0,0,1),
        stroke_color: Shade.vec(0,0,0,1),
        point_diameter: 5,
        stroke_width: 2,
        mode: Facet.DrawingMode.over,
        alpha: true,
        plain: false
    });

    function to_opengl(x) { return x.mul(2).sub(1); };
    var S = Shade;

    var fill_color     = Shade.make(opts.fill_color);
    var stroke_color   = Shade.make(opts.stroke_color);
    var point_diameter = Shade.make(opts.point_diameter);
    var stroke_width   = Shade.make(opts.stroke_width).add(1);
    var use_alpha      = Shade.make(opts.alpha);
    
    var x_scale = opts.x_scale;
    var y_scale = opts.y_scale;
    
    var model_opts = {
        type: "points"
    };

    if (opts.x) {
        model_opts.vertex = S.vec(to_opengl(opts.x_scale(opts.x)), 
                                  to_opengl(opts.y_scale(opts.y)));
    } else if (opts.xy) {
        model_opts.vertex = opts.xy_scale(opts.xy).mul(2).sub(S.vec(1,1));
    };

    if (opts.model) {
        model_opts.elements = opts.model.elements;
    } else if (opts.elements) {
        model_opts.elements = opts.elements;
    }
    var model = Facet.model(model_opts);

    var distance_to_center_in_pixels = S.pointCoord().sub(S.vec(0.5, 0.5))
        .length().mul(point_diameter);
    var point_radius = point_diameter.div(2);
    var distance_to_border = point_radius.sub(distance_to_center_in_pixels);
    var gl_Position = S.vec(model.vertex, 0, 1);

    var no_alpha = S.mix(fill_color, stroke_color,
                         S.clamp(stroke_width.sub(distance_to_border), 0, 1));
    
    if (opts.plain) {
        var result = Facet.bake(model, {
            position: gl_Position,
            point_size: point_diameter,
            color: fill_color,
            mode: opts.mode
        });
        result.gl_Position = gl_Position;
        return result;
    } else {
        var result = Facet.bake(model, {
            position: gl_Position,
            point_size: point_diameter,
            color: S.selection(use_alpha,
                               no_alpha.mul(S.vec(1,1,1,S.clamp(distance_to_border, 0, 1))),
                               no_alpha)
                .discard_if(distance_to_center_in_pixels.gt(point_radius)),
            mode: opts.mode
        });
        result.gl_Position = gl_Position;
        return result;
    }
};
