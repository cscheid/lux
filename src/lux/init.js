(function() {

function initializeContextGlobals(gl)
{
    gl._luxGlobals = {};

    // batches can currently be rendered in "draw" or "pick" mode.
    // draw: 0
    // pick: 1
    // these are indices into an array defined inside Lux.bake
    // For legibility, they should be strings, but for speed, they'll be integers.
    gl._luxGlobals.batchRenderMode = 0;

    // epoch is the initial time being tracked by the context.
    gl._luxGlobals.epoch = new Date().getTime() / 1000;

    gl._luxGlobals.devicePixelRatio = undefined;

    // Optional, enabled WebGL extensions go here.
    gl._luxGlobals.webglExtensions = {};

    // from https://developer.mozilla.org/en-US/docs/JavaScript/Typed_arrays/DataView
    gl._luxGlobals.littleEndian = (function() {
        var buffer = new ArrayBuffer(2);
        new DataView(buffer).setInt16(0, 256, true);
        return new Int16Array(buffer)[0] === 256;
    })();
}

////////////////////////////////////////////////////////////////////////////////

function polyfillEvent(event, gl)
{
    // polyfill event.offsetX and offsetY in Firefox,
    // according to http://bugs.jquery.com/ticket/8523
    if(typeof event.offsetX === "undefined" || typeof event.offsetY === "undefined") {
        var targetOffset = $(event.target).offset();
        event.offsetX = event.pageX - targetOffset.left;
        event.offsetY = event.pageY - targetOffset.top;
    }
    
    event.luxX = event.offsetX * gl._luxGlobals.devicePixelRatio;
    event.luxY = gl.viewportHeight - event.offsetY * gl._luxGlobals.devicePixelRatio;
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

    if (opts.fullSize) {
        var width = window.innerWidth, height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        $(window).resize(function() {
            var w = window.innerWidth, h = window.innerHeight;
            gl.resize(w, h);
            Lux.Scene.invalidate();
        });
    }

    if (opts.highDPS) {
        devicePixelRatio = window.devicePixelRatio || 1;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;
        canvas.width = (canvas.clientWidth || canvas.width) * devicePixelRatio;
        canvas.height = (canvas.clientHeight || canvas.height) * devicePixelRatio;
    }

    try {
        if ("attributes" in opts) {
            gl = Lux.Lib.WebGLUtils.setupWebGL(canvas, opts.attributes);
            var x = gl.getContextAttributes();
            for (var key in opts.attributes) {
                if (opts.attributes[key] !== x[key]) {
                    throw new Error("requested attribute " + 
                           key + ": " + opts.attributes[key] +
                           " could not be satisfied");
                }
            }
        } else
            gl = Lux.Lib.WebGLUtils.setupWebGL(canvas);
        if (!gl)
            throw new Error("failed context creation");
        initializeContextGlobals(gl);
        if ("interactor" in opts) {
            opts.interactor.resize && opts.interactor.resize(canvas.width, canvas.height);
            for (var key in opts.interactor.events) {
                if (opts[key]) {
                    opts[key] = (function(handler, interactorHandler) {
                        return function(event) {
                            var v = handler(event);
                            return v && interactorHandler(event);
                        };
                    })(opts[key], opts.interactor.events[key]);
                } else {
                    opts[key] = opts.interactor.events[key];
                }
            }
        }
        
        if (opts.debugging) {
            var throwOnGLError = function(err, funcName, args) {
                throw new Error(Lux.Lib.WebGLDebugUtils.glEnumToString(err) + 
                    " was caused by call to " + funcName);
            };
            gl = Lux.Lib.WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, opts.tracing);
        }

        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        //////////////////////////////////////////////////////////////////////
        // event handling

        var canvasEvents = ["mouseover", "mousemove", "mousedown", "mouseout", 
                             "mouseup", "dblclick"];
        _.each(canvasEvents, function(ename) {
            var listener = opts[ename];
            function internalListener(event) {
                polyfillEvent(event, gl);
                if (!Lux.Scene.on(ename, event, gl))
                    return false;
                if (listener)
                    return listener(event);
                return true;
            }
            canvas.addEventListener(ename, Lux.onContext(gl, internalListener), false);
        });
        
        if (!_.isUndefined(opts.mousewheel)) {
            $(canvas).bind('mousewheel', function(event, delta, deltaX, deltaY) {
                polyfillEvent(event, gl);
                return opts.mousewheel(event, delta, deltaX, deltaY);
            });
        };

        //////////////////////////////////////////////////////////////////////

        var ext;
        var exts = gl.getSupportedExtensions();

        function enableIfExisting(name) {
            if (exts.indexOf(name) !== -1 &&
                gl.getExtension(name) !== null) {
                gl._luxGlobals.webglExtensions[name] = true;
            }
        }
        _.each(["OES_texture_float", "OES_standard_derivatives"], function(ext) {
            if (exts.indexOf(ext) === -1 ||
                (gl.getExtension(ext)) === null) { // must call this to enable extension
                alert(ext + " is not available on your browser/computer! " +
                      "Lux will not work, sorry.");
                throw new Error("insufficient GPU support");
            }
        });
        _.each(["OES_texture_float_linear"], enableIfExisting);
        _.each(["WEBKIT_EXT_texture_filter_anisotropic",
                "EXT_texture_filter_anisotropic"], 
               function(ext) {
                   if (exts.indexOf(ext) !== -1 && (gl.getExtension(ext) !== null)) {
                       gl._luxGlobals.webglExtensions.EXT_texture_filter_anisotropic = true;
                       gl.TEXTURE_MAX_ANISOTROPY_EXT     = 0x84FE;
                       gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;
                   }
               });
        if (exts.indexOf("OES_element_index_uint") !== -1 &&
            gl.getExtension("OES_element_index_uint") !== null) {
            gl._luxGlobals.webglExtensions.OES_element_index_uint = true;
        }
    } catch(e) {
        alert(e);
        throw e;
    }
    if (!gl) {
        alert("Could not initialize WebGL, sorry :-(");
        throw new Error("failed initalization");
    }

    gl._luxGlobals.devicePixelRatio = devicePixelRatio;

    Lux.setContext(gl);

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
    gl.parameters.now = Shade.parameter("float", 0);
    gl.parameters.frameDuration = Shade.parameter("float", 0);

    gl._luxGlobals.scene = Lux.defaultScene({
        context: gl,
        clearColor: opts.clearColor,
        clearDepth: opts.clearDepth,
        preDraw: function() {
            var rawT = new Date().getTime() / 1000;
            var newT = rawT - gl._luxGlobals.epoch;
            var oldT = gl.parameters.now.get();
            gl.parameters.frameDuration.set(newT - oldT);
            gl.parameters.now.set(newT);
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        }
    });

    if ("interactor" in opts) {
        gl._luxGlobals.scene.add(opts.interactor.scene);
        gl._luxGlobals.scene = opts.interactor.scene;
    }

    return gl;
};

})();
