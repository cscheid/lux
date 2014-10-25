Shade.parameter = function(type, v)
{
    var callLookup = [
        [Shade.Types.floatT, "uniform1f"],
        [Shade.Types.intT, "uniform1i"],
        [Shade.Types.boolT, "uniform1i"],
        [Shade.Types.sampler2D, "uniform1i"],
        [Shade.Types.vec2, "uniform2fv"],
        [Shade.Types.vec3, "uniform3fv"],
        [Shade.Types.vec4, "uniform4fv"],
        [Shade.Types.mat2, "uniformMatrix2fv"],
        [Shade.Types.mat3, "uniformMatrix3fv"],
        [Shade.Types.mat4, "uniformMatrix4fv"]
    ];

    var uniformName = Shade.uniqueName();
    if (_.isUndefined(type)) throw new Error("parameter requires type");
    if (typeof type === 'string') type = Shade.Types[type];
    if (_.isUndefined(type)) throw new Error("parameter requires valid type");

    // the local variable value stores the actual value of the
    // parameter to be used by the GLSL uniform when it is set.
    var value;

    var call = _.detect(callLookup, function(p) { return type.equals(p[0]); });
    if (!_.isUndefined(call)) {
        call = call[1];
    } else {
        throw new Error("Unsupported type " + type.repr() + " for parameter.");
    }
    var result = Shade._createConcreteExp({
        parents: [],
        watchers: [],
        type: type,
        expressionType: 'parameter',
        glslExpression: function() {
            if (this._mustBeFunctionCall) {
                return this.glslName + "()";
            } else
                return uniformName; 
        },
        evaluate: function() {
            return value;
        },
        element: Shade.memoizeOnField("_element", function(i) {
            if (this.type.isPod()) {
                if (i === 0)
                    return this;
                else
                    throw new Error(this.type.repr() + " is an atomic type");
            } else
                return this.at(i);
        }),
        compile: function(ctx) {
            ctx.declareUniform(uniformName, this.type);
            if (this._mustBeFunctionCall) {
                this.precomputedValueGlslName = ctx.requestFreshGlslName();
                ctx.strings.push(this.type.declare(this.precomputedValueGlslName), ";\n");
                ctx.addInitialization(this.precomputedValueGlslName + " = " + uniformName);
                ctx.valueFunction(this, this.precomputedValueGlslName);
            }
        },
        set: function(v) {
            // Ideally, we'd like to do type checking here, but I'm concerned about
            // performance implications. setting a uniform might be a hot path
            // then again, Shade.Types.typeOf is unlikely to be particularly fast.
            // FIXME check performance
            var t = Shade.Types.typeOf(v);
            if (t === "shadeExpression")
                v = v.evaluate();
            value = v;
            if (this._luxActiveUniform) {
                this._luxActiveUniform(v);
            }
            _.each(this.watchers, function(f) { f(v); });
        },
        get: function(v) {
            return value;
        },
        watch: function(callback) {
            this.watchers.push(callback);
        },
        unwatch: function(callback) {
            this.watchers.splice(this.watchers.indexOf(callback), 1);
        },
        uniformCall: call,
        uniformName: uniformName,

        //////////////////////////////////////////////////////////////////////
        // debugging

        _jsonHelper: Shade.Debug._jsonBuilder("parameter", function(obj) {
            obj.parameterType = type.repr();
            return obj;
        })
    });
    result._uniforms = [result];
    result.set(v);
    return result;
};
