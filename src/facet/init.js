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
    // FIXME This should be a "is Shade expression" check
    if (opts.clearColor.expression_type) {
        if (!opts.clearColor.is_constant())
            throw "clearColor must be constant expression";
        if (!opts.clearColor.type.equals(Shade.Types.vec4))
            throw "clearColor must be vec4";
        clearColor = _.toArray(opts.clearColor.constant_value());
    } else
        clearColor = opts.clearColor;

    // FIXME This should be a "is Shade expression" check
    if (opts.clearDepth.expression_type) {
        if (!opts.clearDepth.is_constant())
            throw "clearDepth must be constant expression";
        if (!opts.clearDepth.type.equals(Shade.Types.float_t))
            throw "clearDepth must be float";
        clearDepth = opts.clearDepth.constant_value();
    } else
        clearDepth = opts.clearDepth;

    Facet._globals.display_callback = (opts.display || function() {});

    try {
        if ("attributes" in opts)
            gl = WebGLUtils.setupWebGL(canvas, opts.attributes);
        else
            gl = WebGLUtils.setupWebGL(canvas);
        if (!gl)
            throw "failed context creation";
        if (opts.debugging) {
            var throwOnGLError = function(err, funcName, args) {
                throw WebGLDebugUtils.glEnumToString(err) + 
                    " was caused by call to " + funcName;
            };
            gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, opts.tracing);
        }
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        var names = ["mouseover", "mousemove", "mousedown", 
                     "mouseout", "mouseup"];
        for (var i=0; i<names.length; ++i) {
            var ename = names[i];
            var listener = opts[ename];
            if (!_.isUndefined(listener))
                canvas.addEventListener(ename, listener, false);
        }
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

    gl.display = function() {
        this.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.clearDepth(clearDepth);
        this.clearColor.apply(gl, clearColor);
        this.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        Facet._globals.display_callback();
    };
    Facet.set_context(gl);

    return gl;
};
