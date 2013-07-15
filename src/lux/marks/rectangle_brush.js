Lux.Marks.rectangle_brush = function(opts)
{
    opts = _.defaults(opts || {}, {
        color: Shade.vec(1,1,1,0.5),
        mode: Lux.DrawingMode.over,
        on: {}
    });
    var gl = Lux._globals.ctx;
    var brush_is_active = false;
    var unproject;
    var selection_pt1 = Shade.parameter("vec2", vec.make([0,0]));
    var selection_pt2 = Shade.parameter("vec2", vec.make([0,0]));
    var b1;

    var handlers = {
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

    var brush_actor = Lux.Marks.aligned_rects({
        elements: 1,
        left: selection_pt1.x(),
        right: selection_pt2.x(),
        top: selection_pt1.y(),
        bottom: selection_pt2.y(),
        color: opts.color,
        mode: opts.mode
    });

    return {
        dress: function(scene) {
            var xform = scene.get_transform();
            unproject = Shade(function(p) {
                return xform.inverse({position: p}).position;
            }).js_evaluate;
            return brush_actor.dress(scene);
        }, on: function(ename, event) {
            var handler = handlers[ename];
            if (_.isUndefined(handler))
                return true;
            return handler(event);
        }
    };
};
