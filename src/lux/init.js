(function() {

function initialize_context_globals(gl)
{
    gl._lux_globals = {};

    // batches can currently be rendered in "draw" or "pick" mode.
    // draw: 0
    // pick: 1
    // these are indices into an array defined inside Lux.bake
    // For legibility, they should be strings, but for speed, they'll be integers.
    gl._lux_globals.batch_render_mode = 0;

    // epoch is the initial time being tracked by the context.
    gl._lux_globals.epoch = new Date().getTime() / 1000;

    gl._lux_globals.devicePixelRatio = undefined;

    // Optional, enabled WebGL extensions go here.
    gl._lux_globals.webgl_extensions = {};

    // from https://developer.mozilla.org/en-US/docs/JavaScript/Typed_arrays/DataView
    gl._lux_globals.little_endian = (function() {
        var buffer = new ArrayBuffer(2);
        new DataView(buffer).setInt16(0, 256, true);
        return new Int16Array(buffer)[0] === 256;
    })();
}

////////////////////////////////////////////////////////////////////////////////

function polyfill_event(event, gl)
{
    // polyfill event.offsetX and offsetY in Firefox,
    // according to http://bugs.jquery.com/ticket/8523
    if(typeof event.offsetX === "undefined" || typeof event.offsetY === "undefined") {
        var targetOffset = $(event.target).offset();
        event.offsetX = event.pageX - targetOffset.left;
        event.offsetY = event.pageY - targetOffset.top;
    }
    
    event.luxX = event.offsetX * gl._lux_globals.devicePixelRatio;
    event.luxY = gl.viewportHeight - event.offsetY * gl._lux_globals.devicePixelRatio;
}

Lux.init = function(opts)
{
    opts = _.defaults(opts || {}, {
        clearColor: [1,1,1,0],
        clearDepth: 1.0,
        attributes: {
            alpha: true,
            depth: true,
            preserveDrawingBuffer: true
        },
        highDPS: true
    });

    var canvas = opts.canvas;
    if (_.isUndefined(canvas)) {
        var q = $("canvas");
        if (q.length === 0) {
            throw new Error("no canvas elements found in document");
        }
        if (q.length > 1) {
            throw new Error("More than one canvas element found in document; please specify a canvas option in Lux.init");
        }
        canvas = q[0];
    }

    canvas.unselectable = true;
    canvas.onselectstart = function() { return false; };
    var gl;

    var devicePixelRatio = 1;

    if (opts.highDPS) {
        devicePixelRatio = window.devicePixelRatio || 1;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;
        canvas.width = (canvas.clientWidth || canvas.width) * devicePixelRatio;
        canvas.height = (canvas.clientHeight || canvas.height) * devicePixelRatio;
    }

    try {
        if ("attributes" in opts) {
            gl = WebGLUtils.setupWebGL(canvas, opts.attributes);
            var x = gl.getContextAttributes();
            for (var key in opts.attributes) {
                if (opts.attributes[key] !== x[key]) {
                    throw new Error("requested attribute " + 
                           key + ": " + opts.attributes[key] +
                           " could not be satisfied");
                }
            }
        } else
            gl = WebGLUtils.setupWebGL(canvas);
        if (!gl)
            throw new Error("failed context creation");
        initialize_context_globals(gl);
        if ("interactor" in opts) {
            for (var key in opts.interactor.events) {
                if (opts[key]) {
                    opts[key] = (function(handler, interactor_handler) {
                        return function(event) {
                            var v = handler(event);
                            return v && interactor_handler(event);
                        };
                    })(opts[key], opts.interactor.events[key]);
                } else {
                    opts[key] = opts.interactor.events[key];
                }
            }
        }
        
        if (opts.debugging) {
            var throwOnGLError = function(err, funcName, args) {
                throw new Error(WebGLDebugUtils.glEnumToString(err) + 
                    " was caused by call to " + funcName);
            };
            gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, opts.tracing);
        }

        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        //////////////////////////////////////////////////////////////////////
        // event handling

        var canvas_events = ["mouseover", "mousemove", "mousedown", "mouseout", 
                             "mouseup", "dblclick"];
        _.each(canvas_events, function(ename) {
            var listener = opts[ename];
            function internal_listener(event) {
                polyfill_event(event, gl);
                if (!Lux.Scene.on(ename, event, gl))
                    return false;
                if (listener)
                    return listener(event);
                return true;
            }
            canvas.addEventListener(ename, Lux.on_context(gl, internal_listener), false);
        });
        
        if (!_.isUndefined(opts.mousewheel)) {
            $(canvas).bind('mousewheel', function(event, delta, deltaX, deltaY) {
                polyfill_event(event, gl);
                return opts.mousewheel(event, delta, deltaX, deltaY);
            });
        };

        //////////////////////////////////////////////////////////////////////

        var ext;
        var exts = gl.getSupportedExtensions();
        _.each(["OES_texture_float", "OES_standard_derivatives"], function(ext) {
            if (exts.indexOf(ext) === -1 ||
                (gl.getExtension(ext)) === null) { // must call this to enable extension
                alert(ext + " is not available on your browser/computer! " +
                      "Lux will not work, sorry.");
                throw new Error("insufficient GPU support");
            }
        });
        _.each(["WEBKIT_EXT_texture_filter_anisotropic",
                "EXT_texture_filter_anisotropic"], 
               function(ext) {
                   if (exts.indexOf(ext) !== -1 && (gl.getExtension(ext) !== null)) {
                       gl._lux_globals.webgl_extensions.EXT_texture_filter_anisotropic = true;
                       gl.TEXTURE_MAX_ANISOTROPY_EXT     = 0x84FE;
                       gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;
                   }
               });
        if (exts.indexOf("OES_element_index_uint") !== -1 &&
            gl.getExtension("OES_element_index_uint") !== null) {
            gl._lux_globals.webgl_extensions.OES_element_index_uint = true;
        }
    } catch(e) {
        alert(e);
        throw e;
    }
    if (!gl) {
        alert("Could not initialize WebGL, sorry :-(");
        throw new Error("failed initalization");
    }

    gl._lux_globals.devicePixelRatio = devicePixelRatio;

    Lux.set_context(gl);

    gl.resize = function(width, height) {
        this.parameters.width.set(width);
        this.parameters.height.set(height);
        if (opts.highDPS) {
            this.viewportWidth = width * devicePixelRatio;
            this.viewportHeight = height * devicePixelRatio;
            this.canvas.style.width = width;
            this.canvas.style.height = height;
            this.canvas.width = this.canvas.clientWidth * devicePixelRatio;
            this.canvas.height = this.canvas.clientHeight * devicePixelRatio;
            if (opts.resize)
                opts.resize(width, height);
        } else {
            this.viewportWidth = width;
            this.viewportHeight = height;
            this.canvas.width = width;
            this.canvas.height = height;
            if (opts.resize)
                opts.resize(width, height);
        }
    };
    gl.parameters = {};
    if (opts.highDPS) {
        gl.parameters.width = Shade.parameter("float", gl.viewportWidth / devicePixelRatio);
        gl.parameters.height = Shade.parameter("float", gl.viewportHeight / devicePixelRatio);
    } else {
        gl.parameters.width = Shade.parameter("float", gl.viewportWidth);
        gl.parameters.height = Shade.parameter("float", gl.viewportHeight);
    }
    gl.parameters.now = Shade.parameter("float", gl._lux_globals.epoch);
    gl.parameters.frame_duration = Shade.parameter("float", 0);

    gl._lux_globals.scene = Lux.default_scene({
        context: gl,
        clearColor: opts.clearColor,
        clearDepth: opts.clearDepth,
        pre_draw: function() {
            var raw_t = new Date().getTime() / 1000;
            var new_t = raw_t - gl._lux_globals.epoch;
            var old_t = gl.parameters.now.get();
            gl.parameters.frame_duration.set(new_t - old_t);
            gl.parameters.now.set(new_t);
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        }
    });

    if ("interactor" in opts) {
        gl._lux_globals.scene.add(opts.interactor.scene);
        gl._lux_globals.scene = opts.interactor.scene;
    }

    return gl;
};

})();
