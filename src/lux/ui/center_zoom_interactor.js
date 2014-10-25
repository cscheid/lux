/*
 * A Lux interactor is an object that exposes a list of events that
 * Lux.init uses to hook up to canvas event handlers.
 * 
 * Lux.UI.centerZoomInteractor provides event handlers for the
 * common interaction mode of zooming and panning. Its main visible variables
 * are center and zoom Shade.parameter objects, together with a Shade.camera
 * that computes the appropriate projection matrix.
 * 
 * usage examples:
 *   demos/beautyOfRoots
 * 
 */

Lux.UI.centerZoomInteractor = function(opts)
{
    opts = _.defaults(opts || {}, {
        mousemove: function() {},
        mouseup: function() {},
        mousedown: function() {},
        mousewheel: function() {},
        dblclick: function() {},
        center: vec.make([0,0]),
        zoom: 1,
        widestZoom: 0.1,
        width: 100,
        height: 100
    });

    var height = opts.height;
    var width = opts.width;

    var aspectRatio = Shade.parameter("float", width/height);
    var center = Shade.parameter("vec2", opts.center);
    var zoom = Shade.parameter("float", opts.zoom);
    var camera = Shade.Camera.ortho({
        left: opts.left,
        right: opts.right,
        top: opts.top,
        bottom: opts.bottom,
        center: center,
        zoom: zoom,
        aspectRatio: aspectRatio
    });

    var prevMousePos, downMousePos;
    var currentButton = 0;

    function dblclick(event) {
        internalMove(result.width/2-event.luxX, result.height/2-event.luxY);
        zoom.set(zoom.get() * 2);
        internalMove(event.luxX-result.width/2, event.luxY-result.height/2);
        Lux.Scene.invalidate();
        opts.dblclick(event);
    }

    function mousedown(event) {
        if (_.isUndefined(event.buttons)) {
            // webkit
            currentButton = event.which;
        } else {
            // firefox
            currentButton = event.buttons;
        }

        prevMousePos = [event.luxX, event.luxY];
        downMousePos = [event.luxX, event.luxY];
        opts.mousedown(event);
    }

    function mouseup(event) {
        currentButton = 0;
        opts.mouseup(event);
    }

    // c stores the compensation for the kahan compensated sum
    var c = vec.make([0, 0]);

    // f computes the change in the center position, relative to the
    // current camera parameters. Since camera is a Lux expression,
    // to get the javascript value we create a Shade function and
    // use jsEvaluate.
    var f = Shade(function (deltaVec) {
        return result.camera.unproject(Shade.vec(0,0))
            .sub(result.camera.unproject(deltaVec));
    }).jsEvaluate;

    var internalMove = function(dx, dy) {
        var ctx = Lux._globals.ctx;
        var v = vec.make([2*dx/result.width, 2*dy/result.height]);
        var negdelta = f(v);
        // we use a kahan compensated sum here:
        // http://en.wikipedia.org/wiki/Kahan_summation_algorithm
        // to accumulate minute changes in the center that come from deep zooms.
        var y = vec.minus(negdelta, c);
        var t = vec.plus(center.get(), y);
        c = vec.minus(vec.minus(t, center.get()), y);
        center.set(t);
    };

    function mousemove(event) {
        if ((currentButton & 1) && !event.shiftKey) {
            internalMove(event.luxX - prevMousePos[0], 
                         (event.luxY - prevMousePos[1]));
            Lux.Scene.invalidate();
        } else if ((currentButton & 1) && event.shiftKey) {
            internalMove(result.width/2-downMousePos[0], result.height/2-downMousePos[1]);
            var newValue = Math.max(opts.widestZoom, zoom.get() * (1.0 + (prevMousePos[1] - event.luxY) / 240));
            zoom.set(newValue);
            internalMove(downMousePos[0]-result.width/2, downMousePos[1]-result.height/2);
            Lux.Scene.invalidate();
        }
        prevMousePos = [ event.luxX, event.luxY ];
        opts.mousemove(event);
    }

    // FIXME mousewheel madness
    function mousewheel(event, delta, deltaX, deltaY) {
        internalMove(result.width/2-event.luxX, result.height/2-event.luxY);
	var newValue = Math.max(opts.widestZoom, zoom.get() * (1.0 + deltaY/10));
        // var newValue = Math.max(opts.widestZoom, zoom.get() * (1.0 + event.wheelDelta / 1200));
        zoom.set(newValue);
        internalMove(event.luxX-result.width/2, event.luxY-result.height/2);
        // opts.mousewheel(event);
        Lux.Scene.invalidate();
        return false;
    }

    function resize(w, h) {
        result.resize(w, h);
    }

    // implement transform stack inverse requirements
    var transform = function(appearance) {
        if (_.isUndefined(appearance.position))
            return appearance;
        var newAppearance = _.clone(appearance);
        newAppearance.position = result.project(newAppearance.position);
        return newAppearance;
    };
    transform.inverse = function(appearance) {
        if (_.isUndefined(appearance.position))
            return appearance;
        var newAppearance = _.clone(appearance);
        newAppearance.position = result.unproject(newAppearance.position);
        return newAppearance;
    };
    transform.inverse.inverse = transform;

    var result = {
        camera: camera,
        center: center,
        zoom: zoom,
        width: width,
        height: height,

        transform: transform,

        scene: Lux.scene({
            transform: transform
        }),

        project: function(pt) {
            return this.camera.project(pt);
        },

        unproject: function(pt) {
            return this.camera.unproject(pt);
        },

        resize: function(w, h) {
            aspectRatio.set(w/h);
            this.width = w;
            this.height = h;
        },

        // Transitions between two projections using van Wijk and Nuij's scale-space geodesics
        // from "Smooth and Efficient zooming and panning", IEEE Infovis 2003.
        transitionTo: function(newCenter, newZoom, seconds) {
            if (_.isUndefined(seconds))
                seconds = 3;
            newZoom = 1.0 / newZoom;
            var oldZoom = 1.0 / zoom.get(),
                oldCenter = center.get();
            var start = (new Date()).getTime() / 1000.0;
            var rho = 1.6;
            var direction = vec.minus(newCenter, oldCenter);
            var d = vec.length(direction);

            if (d < 1e-6) {
                console.log("unimplemented"); 
                return;
            }

            var u = [0, d],
                w = [oldZoom, newZoom],
                b = [(w[1] * w[1] - w[0] * w[0] + Math.pow(rho, 4) * Math.pow(u[1] - u[0], 2)) / (2 * w[0] * rho * rho * (u[1] - u[0])),
                     (w[1] * w[1] - w[0] * w[0] - Math.pow(rho, 4) * Math.pow(u[1] - u[0], 2)) / (2 * w[1] * rho * rho * (u[1] - u[0]))];
            var r = [Math.log(-b[0] + Math.sqrt(b[0] * b[0] + 1)),
                     Math.log(-b[1] + Math.sqrt(b[1] * b[1] + 1))];
            var S = (r[1] - r[0]) / rho;
            
            function cosh(x) {
                return 0.5 * (Math.exp(x) + Math.exp(-x));
            }
            function sinh(x) {
                return 0.5 * (Math.exp(x) - Math.exp(-x));
            }
            function tanh(x) {
                return sinh(x) / cosh(x);
            }

            var that = this;

            var ticker = Lux.Scene.animate(function() {
                var now = Date.now() / 1000.0;
                var s = (now - start) / seconds * S;
                var uS = (w[0] / (rho * rho)) * (cosh(r[0]) * tanh(rho * s + r[0]) - sinh(r[0])) + u[0];
                var wS = w[0] * cosh(r[0]) / cosh(rho * s + r[0]);
                var thisCenter = vec.plus(oldCenter, vec.scaling(direction, uS / d));
                var thisZoom = wS;
                that.center.set(thisCenter);
                that.zoom.set(1.0 / thisZoom);
                if (s >= S) {
                    that.center.set(newCenter);
                    that.zoom.set(1.0 / newZoom);
                    ticker.stop();
                    return;
                }
            });
        },

        events: {
            mousedown: mousedown,
            mouseup: mouseup,
            mousemove: mousemove,
            mousewheel: mousewheel,
            dblclick: dblclick,
            resize: resize
        }
    };

    return result;
};
