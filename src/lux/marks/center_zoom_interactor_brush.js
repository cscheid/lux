Lux.Marks.center_zoom_interactor_brush = function(opts)
{
    opts = _.defaults(opts || {}, {
        color: Shade.vec(1,1,1,0.5),
        mode: Lux.DrawingMode.over,
        on: {}
    });

    if (_.isUndefined(opts.interactor)) {
        throw new Error("center_zoom_interactor_brush needs an interactor");
    }
    var interactor = opts.interactor;

    var unproject = Shade(function(p) {
        return interactor.unproject(p);
    }).js_evaluate;
    var selection_pt1 = Shade.parameter("vec2", vec.make([0,0]));
    var selection_pt2 = Shade.parameter("vec2", vec.make([0,0]));
    var proj_pt1 = interactor.project(selection_pt1);
    var proj_pt2 = interactor.project(selection_pt2);

    var brush_batch = Lux.Marks.aligned_rects({
        elements: 1,
        left: proj_pt1.x(),
        right: proj_pt2.x(),
        top: proj_pt1.y(),
        bottom: proj_pt2.y(),
        color: opts.color,
        mode: opts.mode
    });

    var gl = Lux._globals.ctx;
    var brush_is_active = false;
    var b1;
    brush_batch.on = {
        mousedown: function(event) {
            if (opts.accept_event(event)) {
                var xy_v = unproject(vec.make([event.luxX / gl._lux_globals.devicePixelRatio, event.luxY / gl._lux_globals.devicePixelRatio]));
                b1 = xy_v;
                selection_pt1.set(xy_v);
                brush_is_active = true;
                return false;
            }
            return true;
        },
        mousemove: function(event) { 
            if (!brush_is_active)
                return true;
            if (opts.accept_event(event)) {
                var xy_v = unproject(vec.make([event.luxX / gl._lux_globals.devicePixelRatio, event.luxY / gl._lux_globals.devicePixelRatio]));
                selection_pt2.set(xy_v);
                Lux.Scene.invalidate();
                return false;
            }
            return true;
        },
        mouseup: function(event) {
            if (!brush_is_active)
                return true;
            brush_is_active = false;
            if (opts.accept_event(event)) {
                var xy_v = unproject(vec.make([event.luxX / gl._lux_globals.devicePixelRatio, event.luxY / gl._lux_globals.devicePixelRatio]));
                selection_pt2.set(xy_v);
                var b2 = xy_v;
                opts.on.brush_updated && opts.on.brush_updated(b1, b2);
                Lux.Scene.invalidate();
                return false;
            }
            return true;
        }
    };

    return brush_batch;
};
