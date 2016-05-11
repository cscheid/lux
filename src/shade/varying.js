Shade.varying = function(name, type)
{
    if (_.isUndefined(type)) throw new Error("varying requires type");
    if (Lux.typeOf(type) === 'string') type = Shade.Types[type];
    if (_.isUndefined(type)) throw new Error("varying requires valid type");
    var allowedTypes = [
        Shade.Types.floatT,
        Shade.Types.vec2,
        Shade.Types.vec3,
        Shade.Types.vec4,
        Shade.Types.mat2,
        Shade.Types.mat3,
        Shade.Types.mat4
    ];
    if (!_.any(allowedTypes, function(t) { return t.equals(type); })) {
        throw new Error("varying does not support type '" + type.repr() + "'");
    }
    return Shade._createConcreteExp( {
        parents: [],
        type: type,
        expressionType: 'varying',
        _varyingName: name,
        element: Shade.memoizeOnField("_element", function(i) {
            if (this.type.isPod()) {
                if (i === 0)
                    return this;
                else
                    throw new Error(this.type.repr() + " is an atomic type");
            } else
                return this.at(i);
        }),
        glslExpression: function() { 
            if (this._mustBeFunctionCall) {
                return this.glslName + "()";
            } else
                return name; 
        },
        evaluate: function() {
            throw new Error("evaluate unsupported for varying expressions");
        },
        compile: function(ctx) {
            ctx.declareVarying(name, this.type);
            if (this._mustBeFunctionCall) {
                this.precomputedValueGlslName = ctx.requestFreshGlslName();
                ctx.strings.push(this.type.declare(this.precomputedValueGlslName), ";\n");
                ctx.addInitialization(this.precomputedValueGlslName + " = " + name);
                ctx.valueFunction(this, this.precomputedValueGlslName);
            }
        },

        //////////////////////////////////////////////////////////////////////
        // debugging

        _jsonHelper: Shade.Debug._jsonBuilder("varying", function(obj) {
            obj.varyingType = type.repr();
            obj.varyingName = name;
            return obj;
        })
    });
};

