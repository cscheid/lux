Lux.Marks.rectangle_brush = function(opts)
{
    opts = _.defaults(opts || {}, {
        color: Shade.vec(1,1,1,0.5),
        mode: Lux.DrawingMode.over_no_depth,
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
                var xy_v = unproject(vec.make([event.luxX / gl._luxGlobals.devicePixelRatio, event.luxY / gl._lux_globals.devicePixelRatio]));
                b1 = xy_v;
                selection_pt1.set(xy_v);
                brush_is_active = true;
                opts.on.brush_started && opts.on.brush_started(b1);
                return false;
            }
            return true;
        },
        mousemove: function(event) { 
            if (!brush_is_active)
                return true;
            if (opts.accept_event(event)) {
                var xy_v = unproject(vec.make([event.luxX / gl._luxGlobals.devicePixelRatio, event.luxY / gl._lux_globals.devicePixelRatio]));
                selection_pt2.set(xy_v);
                var b2 = xy_v;
                opts.on.brush_changed && opts.on.brush_changed(b1, b2);
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
                var xy_v = unproject(vec.make([event.luxX / gl._luxGlobals.devicePixelRatio, event.luxY / gl._lux_globals.devicePixelRatio]));
                selection_pt2.set(xy_v);
                var b2 = xy_v;
                if (opts.on.brush_changed) {
                    opts.on.brush_changed(b1, b2);
                } else if (opts.on.brush_ended) {
                    opts.on.brush_ended(b1, b2);
                }
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
            var ctx = Lux._globals.ctx;
            var xform = scene.getTransform();
            var half_screen_size = Shade.vec(ctx.parameters.width, ctx.parameters.height).div(2);
            unproject = Shade(function(p) {
                return xform.inverse({position: p.div(half_screen_size).sub(Shade.vec(1,1))}).position;
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
