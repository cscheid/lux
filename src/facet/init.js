(function() {

function initialize_context_globals(gl)
{
    gl._facet_globals = {};

    // when Facet.init is called with a display callback, that gets stored in
    // gl._globals.display_callback
    gl._facet_globals.display_callback = Facet.Scene.render;

    // Objects stored in the scene are automatically drawn
    gl._facet_globals.scene = [];

    // batches can currently be rendered in "draw" or "pick" mode.
    // draw: 0
    // pick: 1
    // these are indices into an array defined inside Facet.bake
    // For legibility, they should be strings, but for speed, they'll be integers.
    gl._facet_globals.batch_render_mode = 0;
}

Facet.init = function(canvas, opts)
{
    canvas.unselectable = true;
    canvas.onselectstart = function() { return false; };
    var gl;
    var clearColor, clearDepth;
    opts = _.defaults(opts || {}, { clearColor: [1,1,1,0],
                                    clearDepth: 1.0,
                                    attributes: {
                                        alpha: true,
                                        depth: true
                                    }
                                  });
    if (Facet.is_shade_expression(opts.clearColor)) {
        if (!opts.clearColor.is_constant())
            throw "clearColor must be constant expression";
        if (!opts.clearColor.type.equals(Shade.Types.vec4))
            throw "clearColor must be vec4";
        clearColor = _.toArray(opts.clearColor.constant_value());
    } else
        clearColor = opts.clearColor;

    // FIXME This should be a "is Shade expression" check
    if (Facet.is_shade_expression(opts.clearDepth)) {
        if (!opts.clearDepth.is_constant())
            throw "clearDepth must be constant expression";
        if (!opts.clearDepth.type.equals(Shade.Types.float_t))
            throw "clearDepth must be float";
        clearDepth = opts.clearDepth.constant_value();
    } else
        clearDepth = opts.clearDepth;

    try {
        if ("attributes" in opts) {
            gl = WebGLUtils.setupWebGL(canvas, opts.attributes);
            var x = gl.getContextAttributes();
            for (var key in opts.attributes) {
                if (opts.attributes[key] !== x[key]) {
                    throw ("requested attribute " + 
                           key + ": " + opts.attributes[key] +
                           " could not be satisfied");
                }
            }
        } else
            gl = WebGLUtils.setupWebGL(canvas);
        if (!gl)
            throw "failed context creation";
        if ("interactor" in opts) {
            for (var key in opts.interactor.events) {
                opts[key] = opts.interactor.events[key];
            }
        }
        
        if (opts.debugging) {
            var throwOnGLError = function(err, funcName, args) {
                throw WebGLDebugUtils.glEnumToString(err) + 
                    " was caused by call to " + funcName;
            };
            gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, opts.tracing);
        }
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        var canvas_events = ["mouseover", "mousemove", "mousedown", "mouseout", "mouseup"];
        for (var i=0; i<canvas_events.length; ++i) {
            var ename = canvas_events[i];
            var listener = opts[ename];
            if (!_.isUndefined(listener)) {
                (function(listener) {
                    function internal_listener(event) {
                        event.facetX = event.offsetX;
                        event.facetY = gl.viewportHeight - event.offsetY;
                        return listener(event);
                    }
                    canvas.addEventListener(ename, Facet.on_context(gl, internal_listener), false);
                })(listener);
            }
        }
        if (!_.isUndefined(opts.mousewheel)) {
            $(canvas).bind('mousewheel', opts.mousewheel);
        };

        var ext;
        var exts = _.map(gl.getSupportedExtensions(), function (x) { 
            return x.toLowerCase();
        });
        if (exts.indexOf("oes_texture_float") == -1) {
            // FIXME design something like progressive enhancement for these cases. HARD!
            alert("OES_texture_float is not available on your browser/computer! " +
                  "Facet will not work, sorry.");
            throw "insufficient GPU support";
        } else {
            gl.getExtension("oes_texture_float");
        }
    } catch(e) {
        alert(e);
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
        throw "failed initalization";
    }

    initialize_context_globals(gl);
    Facet.set_context(gl);

    if (opts.display) {
        gl._facet_globals.display_callback = opts.display;
    }

    gl.display = function() {
        this.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.clearDepth(clearDepth);
        this.clearColor.apply(gl, clearColor);
        this.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this._facet_globals.display_callback();
    };
    gl.resize = function(width, height) {
        this.viewportWidth = width;
        this.viewportHeight = height;
        gl.parameters.width.set(width);
        gl.parameters.height.set(height);
        this.canvas.width = width;
        this.canvas.height = height;
        this.display();
    };
    gl.parameters = {};
    gl.parameters.width = Shade.parameter("float", gl.viewportWidth);
    gl.parameters.height = Shade.parameter("float", gl.viewportHeight);

    return gl;
};

})();
