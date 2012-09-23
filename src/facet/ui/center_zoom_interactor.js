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
        zoom: 1
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
            zoom.set(zoom.get() * (1.0 + (event.offsetY - prev_mouse_pos[1]) / 240));
            Facet.Scene.invalidate();
        }
        prev_mouse_pos = [ event.offsetX, event.offsetY ];
        opts.mousemove(event);
    }

    function mousewheel(event) {
        internal_move(width/2-event.clientX, height/2-event.clientY);
        zoom.set(zoom.get() * (1.0 + event.wheelDelta / 1200));
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

        events: {
            mousedown: mousedown,
            mousemove: mousemove,
            mousewheel: mousewheel
        }
    };
};
