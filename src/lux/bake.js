(function() {

var previousBatchOpts = {};
Lux.getCurrentBatchOpts = function()
{
    return previousBatchOpts;
};

Lux.unloadBatch = function()
{
    if (!previousBatchOpts._ctx)
        return;
    var ctx = previousBatchOpts._ctx;
    if (previousBatchOpts.attributes) {
        for (var key in previousBatchOpts.attributes) {
            ctx.disableVertexAttribArray(previousBatchOpts.program[key]);
        }
        _.each(previousBatchOpts.program.uniforms, function (uniform) {
            delete uniform._luxActiveUniform;
        });
    }

    if (previousBatchOpts.lineWidth)
        ctx.lineWidth(1.0);
    if (previousBatchOpts.polygonOffset) {
        ctx.disable(ctx.POLYGON_OFFSET_FILL);
    }

    // reset the opengl capabilities which are determined by
    // Lux.DrawingMode.*
    ctx.disable(ctx.DEPTH_TEST);
    ctx.disable(ctx.BLEND);
    ctx.depthMask(true);

    previousBatchOpts = {};
};

function drawIt(batchOpts)
{
    if (_.isUndefined(batchOpts))
        throw new Error("drawing mode undefined");

    // When the batchOptions object is different from the one previously drawn,
    // we must set up the appropriate state for drawing.
    if (batchOpts.batchId !== previousBatchOpts.batchId) {
        var attributes = batchOpts.attributes || {};
        var uniforms = batchOpts.uniforms || {};
        var program = batchOpts.program;
        var key;

        Lux.unloadBatch();
        previousBatchOpts = batchOpts;
        batchOpts.setCaps();

        var ctx = batchOpts._ctx;
        ctx.useProgram(program);

        for (key in attributes) {
            var attr = program[key];
            if (!_.isUndefined(attr)) {
                ctx.enableVertexAttribArray(attr);
                var buffer = attributes[key].get();
                if (!buffer) {
                    throw new Error("Unset Shade.attribute " + attributes[key]._attributeName);
                }
                buffer.bind(attr);
            }
        }
        
        var currentActiveTexture = 0;
        _.each(program.uniforms, function(uniform) {
            var key = uniform.uniformName;
            var call = uniform.uniformCall,
                value = uniform.get();
            if (_.isUndefined(value)) {
                throw new Error("parameter " + key + " has not been set.");
            }
            var t = Shade.Types.typeOf(value);
            if (t.equals(Shade.Types.otherT)) {
                uniform._luxActiveUniform = (function(uid, cat) {
                    return function(v) {
                        ctx.activeTexture(ctx.TEXTURE0 + cat);
                        ctx.bindTexture(ctx.TEXTURE_2D, v);
                        ctx.uniform1i(uid, cat);
                    };
                })(program[key], currentActiveTexture);
                currentActiveTexture++;
            } else if (t.equals(Shade.Types.floatT) || 
                       t.equals(Shade.Types.boolT) ||
                       t.repr().substr(0,3) === "vec") {
                uniform._luxActiveUniform = (function(call, uid) {
                    return function(v) {
                        call.call(ctx, uid, v);
                    };
                })(ctx[call], program[key]);
            } else if (t.repr().substr(0,3) === "mat") {
                uniform._luxActiveUniform = (function(call, uid) {
                    return function(v) {
                        ctx[call](uid, false, v);
                    };
                })(call, program[key]);
            } else {
                throw new Error("could not figure out parameter type! " + t);
            }
            uniform._luxActiveUniform(value);
        });
    }

    batchOpts.drawChunk();
}

var largestBatchId = 1;

Lux.bake = function(model, appearance, opts)
{
    appearance = Shade.canonicalizeProgramObject(appearance);
    opts = _.defaults(opts || {}, {
        forceNoDraw: false,
        forceNoPick: false,
        forceNoUnproject: false
    });
    var ctx = model._ctx || Lux._globals.ctx;

    if (_.isUndefined(appearance.gl_FragColor)) {
        appearance.gl_FragColor = Shade.vec(1,1,1,1);
    }

    // these are necessary outputs which must be compiled by Shade.program
    function isProgramOutput(key)
    {
        return ["color", "position", "point_size",
                "gl_FragColor", "gl_Position", "gl_PointSize"].indexOf(key) != -1;
    };

    if (appearance.gl_Position.type.equals(Shade.Types.vec2)) {
        appearance.gl_Position = Shade.vec(appearance.gl_Position, 0, 1);
    } else if (appearance.gl_Position.type.equals(Shade.Types.vec3)) {
        appearance.gl_Position = Shade.vec(appearance.gl_Position, 1);
    } else if (!appearance.gl_Position.type.equals(Shade.Types.vec4)) {
        throw new Error("position appearance attribute must be vec2, vec3 or vec4");
    }

    var batchId = Lux.freshPickId();

    function buildAttributeArraysObj(prog) {
        return _.build(_.map(
            prog.attributeBuffers, function(v) { return [v._attributeName, v]; }
        ));
    }

    function processAppearance(valKeyFunction) {
        var result = {};
        _.each(appearance, function(value, key) {
            if (isProgramOutput(key)) {
                result[key] = valKeyFunction(value, key);
            }
        });
        return Shade.program(result);
    }

    function createDrawProgram() {
        return processAppearance(function(value, key) {
            return value;
        });
    }

    function createPickProgram() {
        var pickId;
        if (appearance.pickId)
            pickId = Shade(appearance.pickId);
        else {
            pickId = Shade(Shade.id(batchId));
        }
        return processAppearance(function(value, key) {
            if (key === 'gl_FragColor') {
                var pickIf = (appearance.pickIf || 
                              Shade(value).swizzle("a").gt(0));
                return pickId.discardIf(Shade.not(pickIf));
            } else
                return value;
        });
    }

    /* Lux unprojecting uses the render-as-depth technique suggested
     by Benedetto et al. in the SpiderGL paper in the context of
     shadow mapping:

     SpiderGL: A JavaScript 3D Graphics Library for Next-Generation
     WWW

     Marco Di Benedetto, Federico Ponchio, Fabio Ganovelli, Roberto
     Scopigno. Visual Computing Lab, ISTI-CNR

     http://vcg.isti.cnr.it/Publications/2010/DPGS10/spidergl.pdf

     FIXME: Perhaps there should be an option of doing this directly as
     render-to-float-texture.

     */
    
    function createUnprojectProgram() {
        return processAppearance(function(value, key) {
            if (key === 'gl_FragColor') {
                var positionZ = appearance.gl_Position.swizzle('z'),
                    positionW = appearance.gl_Position.swizzle('w');
                var normalizedZ = positionZ.div(positionW).add(1).div(2);

                // normalizedZ ranges from 0 to 1.

                // an opengl z-buffer actually stores information as
                // 1/z, so that more precision is spent on the close part
                // of the depth range. Here, we are storing z, and so our efficiency won't be great.
                // 
                // However, even 1/z is only an approximation to the ideal scenario, and 
                // if we're already doing this computation on a shader, it might be worthwhile to use
                // Thatcher Ulrich's suggestion about constant relative precision using 
                // a logarithmic mapping:

                // http://tulrich.com/geekstuff/log_depth_buffer.txt

                // That mapping, incidentally, is more directly interpretable as
                // linear interpolation in log space.

                var resultRgba = Shade.vec(
                    normalizedZ,
                    normalizedZ.mul(1 << 8),
                    normalizedZ.mul(1 << 16),
                    normalizedZ.mul(1 << 24)
                );
                return resultRgba;
            } else
                return value;
        });
    }

    var primitiveTypes = {
        points: ctx.POINTS,
        lineStrip: ctx.LINE_STRIP,
        lineLoop: ctx.LINE_LOOP,
        lines: ctx.LINES,
        triangleStrip: ctx.TRIANGLE_STRIP,
        triangleFan: ctx.TRIANGLE_FAN,
        triangles: ctx.TRIANGLES
    };

    var primitiveType = primitiveTypes[model.type];
    var elements = model.elements;
    var drawChunk;
    if (Lux.typeOf(elements) === 'number') {
        drawChunk = function() {
            // it's important to use "model.elements" here instead of "elements" because
            // the indirection captures the fact that the model might have been updated with
            // a different number of elements, by changing the attribute buffers.
            // 
            // FIXME This is a phenomentally bad way to go about this problem, but let's go with it for now.
            ctx.drawArrays(primitiveType, 0, model.elements);
        };
    } else {
        if (elements._shadeType === 'attributeBuffer') {
            drawChunk = function() {
                model.elements.draw(primitiveType);
            };
        } else if (elements._shadeType === 'elementBuffer') {
            drawChunk = function() {
                model.elements.bindAndDraw(primitiveType);
            };
        } else
            throw new Error("model.elements must be a number, an element buffer or an attribute buffer");
    }

    // FIXME the batchId field in the batchOpts objects is not
    // the same as the batchId in the batch itself. 
    // 
    // The former is used to avoid state switching, while the latter is
    // a generic automatic id which might be used for picking, for
    // example.
    // 
    // This should not lead to any problems right now but might be confusing to
    // readers.

    function createBatchOpts(program, capsName) {
        function ensureParameter(v) {
            if (Lux.typeOf(v) === 'number')
                return Shade.parameter("float", v);
            else if (Lux.isShadeExpression(v) === 'parameter')
                return v;
            else throw new Error("expected float or parameter, got " + v + " instead.");
        }
        var result = {
            _ctx: ctx,
            program: program,
            attributes: buildAttributeArraysObj(program),
            setCaps: function() {
                var ctx = Lux._globals.ctx;
                var modeCaps = ((appearance.mode && appearance.mode[capsName]) ||
                       Lux.DrawingMode.standard[capsName]);
                modeCaps();
                if (this.lineWidth) {
                    ctx.lineWidth(this.lineWidth.get());
                }
                if (this.polygonOffset) {
                    ctx.enable(ctx.POLYGON_OFFSET_FILL);
                    ctx.polygonOffset(this.polygonOffset.factor.get(), 
                                      this.polygonOffset.units.get());
                }
            },
            drawChunk: drawChunk,
            batchId: largestBatchId++
        };
        if (!_.isUndefined(appearance.lineWidth))
            result.lineWidth = ensureParameter(appearance.lineWidth);
        if (!_.isUndefined(appearance.polygonOffset))
            result.polygonOffset = {
                factor: ensureParameter(appearance.polygonOffset.factor),
                units: ensureParameter(appearance.polygonOffset.units)
            };
        return result;
    }

    var drawOpts, pickOpts, unprojectOpts;

    if (!opts.forceNoDraw)
        drawOpts = createBatchOpts(createDrawProgram(), "setDrawCaps");

    if (!opts.forceNoPick)
        pickOpts = createBatchOpts(createPickProgram(), "setPickCaps");

    if (!opts.forceNoUnproject)
        unprojectOpts = createBatchOpts(createUnprojectProgram(), "setUnprojectCaps");

    var whichOpts = [ drawOpts, pickOpts, unprojectOpts ];

    var result = {
        model: model,
        batchId: batchId,
        draw: function() {
            drawIt(whichOpts[ctx._luxGlobals.batchRenderMode]);
        },
        // in case you want to force the behavior, or that
        // single array lookup is too slow for you.
        _draw: function() {
            drawIt(drawOpts);
        },
        _pick: function() {
            drawIt(pickOpts);
        },
        // for debugging purposes
        _batchOpts: function() { return whichOpts; }
    };
    return result;
};
})();
