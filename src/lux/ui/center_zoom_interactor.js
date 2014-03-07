/*
 * A Lux interactor is an object that exposes a list of events that
 * Lux.init uses to hook up to canvas event handlers.
 * 
 * Lux.UI.center_zoom_interactor provides event handlers for the
 * common interaction mode of zooming and panning. Its main visible variables
 * are center and zoom Shade.parameter objects, together with a Shade.camera
 * that computes the appropriate projection matrix.
 * 
 * usage examples:
 *   demos/beauty_of_roots
 * 
 */

Lux.UI.center_zoom_interactor = function(opts)
{
    opts = _.defaults(opts || {}, {
        mousemove: function() {},
        mouseup: function() {},
        mousedown: function() {},
        mousewheel: function() {},
        dblclick: function() {},
        center: vec.make([0,0]),
        zoom: 1,
        widest_zoom: 0.1,
        width: 100,
        height: 100
    });

    var height = opts.height;
    var width = opts.width;

    var aspect_ratio = Shade.parameter("float", width/height);
    var center = Shade.parameter("vec2", opts.center);
    var zoom = Shade.parameter("float", opts.zoom);
    var camera = Shade.Camera.ortho({
        left: opts.left,
        right: opts.right,
        top: opts.top,
        bottom: opts.bottom,
        center: center,
        zoom: zoom,
        aspect_ratio: aspect_ratio
    });

    var prev_mouse_pos, down_mouse_pos;
    var current_button = 0;

    function dblclick(event) {
        internal_move(result.width/2-event.luxX, result.height/2-event.luxY);
        zoom.set(zoom.get() * 2);
        internal_move(event.luxX-result.width/2, event.luxY-result.height/2);
        Lux.Scene.invalidate();
        opts.dblclick(event);
    }

    function mousedown(event) {
        if (_.isUndefined(event.buttons)) {
            // webkit
            current_button = event.which;
        } else {
            // firefox
            current_button = event.buttons;
        }

        prev_mouse_pos = [event.luxX, event.luxY];
        down_mouse_pos = [event.luxX, event.luxY];
        opts.mousedown(event);
    }

    function mouseup(event) {
        current_button = 0;
        opts.mouseup(event);
    }

    // c stores the compensation for the kahan compensated sum
    var c = vec.make([0, 0]);

    // f computes the change in the center position, relative to the
    // current camera parameters. Since camera is a Lux expression,
    // to get the javascript value we create a Shade function and
    // use js_evaluate.
    var f = Shade(function (delta_vec) {
        return result.camera.unproject(Shade.vec(0,0))
            .sub(result.camera.unproject(delta_vec));
    }).js_evaluate;

    var internal_move = function(dx, dy) {
        debugger;
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
        if ((current_button & 1) && !event.shiftKey) {
            internal_move(event.luxX - prev_mouse_pos[0], 
                         (event.luxY - prev_mouse_pos[1]));
            Lux.Scene.invalidate();
        } else if ((current_button & 1) && event.shiftKey) {
            internal_move(result.width/2-down_mouse_pos[0], result.height/2-down_mouse_pos[1]);
            var new_value = Math.max(opts.widest_zoom, zoom.get() * (1.0 + (prev_mouse_pos[1] - event.luxY) / 240));
            zoom.set(new_value);
            internal_move(down_mouse_pos[0]-result.width/2, down_mouse_pos[1]-result.height/2);
            Lux.Scene.invalidate();
        }
        prev_mouse_pos = [ event.luxX, event.luxY ];
        opts.mousemove(event);
    }

    // FIXME mousewheel madness
    function mousewheel(event, delta, deltaX, deltaY) {
        debugger;
        internal_move(result.width/2-event.luxX, result.height/2-event.luxY);
	var new_value = Math.max(opts.widest_zoom, zoom.get() * (1.0 + deltaY/10));
        // var new_value = Math.max(opts.widest_zoom, zoom.get() * (1.0 + event.wheelDelta / 1200));
        zoom.set(new_value);
        internal_move(event.luxX-result.width/2, event.luxY-result.height/2);
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
        var new_appearance = _.clone(appearance);
        new_appearance.position = result.project(new_appearance.position);
        return new_appearance;
    };
    transform.inverse = function(appearance) {
        if (_.isUndefined(appearance.position))
            return appearance;
        var new_appearance = _.clone(appearance);
        new_appearance.position = result.unproject(new_appearance.position);
        return new_appearance;
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
            aspect_ratio.set(w/h);
            this.width = w;
            this.height = h;
        },

        // Transitions between two projections using van Wijk and Nuij's scale-space geodesics
        // from "Smooth and Efficient zooming and panning", IEEE Infovis 2003.
        transition_to: function(new_center, new_zoom, seconds) {
            if (_.isUndefined(seconds))
                seconds = 3;
            new_zoom = 1.0 / new_zoom;
            var old_zoom = 1.0 / zoom.get(),
                old_center = center.get();
            var start = (new Date()).getTime() / 1000.0;
            var rho = 1.6;
            var direction = vec.minus(new_center, old_center);
            var d = vec.length(direction);

            if (d < 1e-6) {
                console.log("unimplemented"); 
                return;
            }

            var u = [0, d],
                w = [old_zoom, new_zoom],
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
                var u_s = (w[0] / (rho * rho)) * (cosh(r[0]) * tanh(rho * s + r[0]) - sinh(r[0])) + u[0];
                var w_s = w[0] * cosh(r[0]) / cosh(rho * s + r[0]);
                var this_center = vec.plus(old_center, vec.scaling(direction, u_s / d));
                var this_zoom = w_s;
                that.center.set(this_center);
                that.zoom.set(1.0 / this_zoom);
                if (s >= S) {
                    that.center.set(new_center);
                    that.zoom.set(1.0 / new_zoom);
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
