Lux.Marks.rectangleBrush = function(opts)
{
    opts = _.defaults(opts || {}, {
        color: Shade.vec(1,1,1,0.5),
        mode: Lux.DrawingMode.overNoDepth,
        on: {}
    });
    var gl = Lux._globals.ctx;
    var brushIsActive = false;
    var unproject;
    var selectionPt1 = Shade.parameter("vec2", vec.make([0,0]));
    var selectionPt2 = Shade.parameter("vec2", vec.make([0,0]));
    var b1;

    var handlers = {
        mousedown: function(event) {
            if (opts.acceptEvent(event)) {
                var xyV = unproject(vec.make([event.luxX / gl._luxGlobals.devicePixelRatio, event.luxY / gl._luxGlobals.devicePixelRatio]));
                b1 = xyV;
                selectionPt1.set(xyV);
                brushIsActive = true;
                opts.on.brushStarted && opts.on.brushStarted(b1);
                return false;
            }
            return true;
        },
        mousemove: function(event) { 
            if (!brushIsActive)
                return true;
            if (opts.acceptEvent(event)) {
                var xyV = unproject(vec.make([event.luxX / gl._luxGlobals.devicePixelRatio, event.luxY / gl._luxGlobals.devicePixelRatio]));
                selectionPt2.set(xyV);
                var b2 = xyV;
                opts.on.brushChanged && opts.on.brushChanged(b1, b2);
                Lux.Scene.invalidate();
                return false;
            }
            return true;
        },
        mouseup: function(event) {
            if (!brushIsActive)
                return true;
            brushIsActive = false;
            if (opts.acceptEvent(event)) {
                var xyV = unproject(vec.make([event.luxX / gl._luxGlobals.devicePixelRatio, event.luxY / gl._luxGlobals.devicePixelRatio]));
                selectionPt2.set(xyV);
                var b2 = xyV;
                if (opts.on.brushChanged) {
                    opts.on.brushChanged(b1, b2);
                } else if (opts.on.brushEnded) {
                    opts.on.brushEnded(b1, b2);
                }
                Lux.Scene.invalidate();
                return false;
            }
            return true;
        }
    };

    var brushActor = Lux.Marks.alignedRects({
        elements: 1,
        left: selectionPt1.x(),
        right: selectionPt2.x(),
        top: selectionPt1.y(),
        bottom: selectionPt2.y(),
        color: opts.color,
        mode: opts.mode
    });

    return {
        dress: function(scene) {
            var ctx = Lux._globals.ctx;
            var xform = scene.getTransform();
            var halfScreenSize = Shade.vec(ctx.parameters.width, ctx.parameters.height).div(2);
            unproject = Shade(function(p) {
                return xform.inverse({position: p.div(halfScreenSize).sub(Shade.vec(1,1))}).position;
            }).jsEvaluate;
            return brushActor.dress(scene);
        }, on: function(ename, event) {
            var handler = handlers[ename];
            if (_.isUndefined(handler))
                return true;
            return handler(event);
        }
    };
};
