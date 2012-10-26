/*
 * A Facet interactor is an object that exposes a list of events that
 * Facet.init uses to hook up to canvas event handlers.
 * 
 * Facet.UI.center_zoom_interactor provides event handlers for the
 * common interaction mode of zooming and panning. Its main visible variables
 * are center and zoom Shade.parameter objects, together with a Shade.camera
 * that computes the appropriate projection matrix.
 * 
 * usage examples:
 *   demos/beauty_of_roots
 * 
 */

Facet.UI.center_zoom_interactor = function(opts)
{
    opts = _.defaults(opts, {
        mousemove: function() {},
        mousedown: function() {},
        mousewheel: function() {},
        center: vec.make([0,0]),
        zoom: 1,
        widest_zoom: 0.1
    });

    var height = opts.height;
    var width = opts.width;
    var center = Shade.parameter("vec2", opts.center);
    var zoom = Shade.parameter("float", opts.zoom);
    var prev_mouse_pos;

    function mousedown(event) {
        prev_mouse_pos = [event.offsetX, event.offsetY];
        opts.mousedown(event);
    }

    // c stores the compensation for the kahan compensated sum
    var c = vec.make([0, 0]);
    function internal_move(dx, dy) {
        var negdelta = vec.make([-dx / (height * zoom.get() / 2), 
                                  dy / (height * zoom.get() / 2)]);
        // we use a kahan compensated sum here:
        // http://en.wikipedia.org/wiki/Kahan_summation_algorithm
        // to accumulate minute changes in the center that come from deep zooms.
        var y = vec.minus(negdelta, c);
        var t = vec.plus(center.get(), y);
        c = vec.minus(vec.minus(t, center.get()), y);
        center.set(t);
    }

    function mousemove(event) {
        if ((event.which & 1) && !event.shiftKey) {
            internal_move(event.offsetX - prev_mouse_pos[0], event.offsetY - prev_mouse_pos[1]);
            Facet.Scene.invalidate();
        } else if ((event.which & 1) && event.shiftKey) {
            zoom.set(Math.max(opts.widest_zoom, zoom.get() * (1.0 + (event.offsetY - prev_mouse_pos[1]) / 240)));
            Facet.Scene.invalidate();
        }
        prev_mouse_pos = [ event.offsetX, event.offsetY ];
        opts.mousemove(event);
    }

    function mousewheel(event) {
        internal_move(width/2-event.clientX, height/2-event.clientY);
        var new_value = Math.max(opts.widest_zoom, zoom.get() * (1.0 + event.wheelDelta / 1200));
        zoom.set(new_value);
        internal_move(event.clientX-width/2, event.clientY-height/2);
        opts.mousewheel(event);
        Facet.Scene.invalidate();
        return false;
    }

    var aspect_ratio = Shade.parameter("float", width/height);
    var camera = Shade.Camera.ortho({
        center: center,
        zoom: zoom,
        aspect_ratio: aspect_ratio
    });

    return {
        camera: camera,
        center: center,
        zoom: zoom,

        resize: function(w, h) {
            aspect_ratio.set(w/h);
            width = w;
            height = h;
            Facet.Scene.invalidate();
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

            var ticker = Facet.Scene.animate(function() {
                var now = (new Date()).getTime() / 1000.0;
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
            mousemove: mousemove,
            mousewheel: mousewheel
        }
    };
};
