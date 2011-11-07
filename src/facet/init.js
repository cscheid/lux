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
    if (opts.clearColor.expression_type) {
        if (!opts.clearColor.is_constant())
            throw "clearColor must be constant expression";
        if (!opts.clearColor.type.equals(Shade.Types.vec4))
            throw "clearColor must be vec4";
        clearColor = _.toArray(opts.clearColor.constant_value());
    } else
        clearColor = opts.clearColor;

    if (opts.clearDepth.expression_type) {
        if (!opts.clearDepth.is_constant())
            throw "clearDepth must be constant expression";
        if (!opts.clearDepth.type.equals(Shade.Types.float_t))
            throw "clearDepth must be float";
        clearDepth = opts.clearDepth.constant_value();
    } else
        clearDepth = opts.clearDepth;

    Facet._globals.display_callback = (opts.display || function() {});

    if (typeof opts === "undefined")
        opts = {};
    // if (typeof listeners === "undefined")
    //     listeners = {};
    try {
//         gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("experimental-webgl"));
        if ("attributes" in opts)
            gl = WebGLUtils.setupWebGL(canvas, opts.attributes);
        else
            gl = WebGLUtils.setupWebGL(canvas);
        if (!gl)
            throw "Failed context creation";
        if (opts.debugging) {
            function throwOnGLError(err, funcName, args) {
                throw WebGLDebugUtils.glEnumToString(err) + 
                    " was caused by call to " + funcName;
            }
            gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
        }
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        var names = ["mouseover", "mousemove", "mousedown", 
                     "mouseout", "mouseup"];
        for (var i=0; i<names.length; ++i) {
            var ename = names[i];
            var listener = opts[ename];
            if (typeof listener != "undefined")
                canvas.addEventListener(ename, listener, false);
        }
    } catch(e) {
        alert(e);
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
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
