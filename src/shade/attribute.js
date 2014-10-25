Shade.attributeFromBuffer = function(buffer)
{
    return buffer._shadeExpression || function() {
        var itemTypeMap = [ undefined, Shade.Types.floatT, Shade.Types.vec2, Shade.Types.vec3, Shade.Types.vec4 ];
        var itemType = itemTypeMap[buffer.itemSize];
        var result = Shade.attribute(itemType);
        buffer._shadeExpression = result;
        result.set(buffer);
        return result;
    }();
};

Shade.attribute = function(type)
{
    var name = Shade.uniqueName();
    if (_.isUndefined(type)) throw new Error("attribute requires type");
    if (typeof type === 'string') type = Shade.Types[type];
    if (_.isUndefined(type)) throw new Error("attribute requires valid type");
    var boundBuffer;

    return Shade._createConcreteExp( {
        parents: [],
        type: type,
        expressionType: 'attribute',
        element: Shade.memoizeOnField("_element", function(i) {
            if (this.type.equals(Shade.Types.floatT)) {
                if (i === 0)
                    return this;
                else
                    throw new Error("float is an atomic type");
            } else
                return this.at(i);
        }),
        evaluate: function() {
            throw new Error("client-side evaluation of attributes is currently unsupported");
        },
        glslExpression: function() { 
            if (this._mustBeFunctionCall) {
                return this.glslName + "()";
            } else
                return name; 
        },
        compile: function(ctx) {
            ctx.declareAttribute(name, this.type);
            if (this._mustBeFunctionCall) {
                this.precomputedValueGlslName = ctx.requestFreshGlslName();
                ctx.strings.push(this.type.declare(this.precomputedValueGlslName), ";\n");
                ctx.addInitialization(this.precomputedValueGlslName + " = " + name);
                ctx.valueFunction(this, this.precomputedValueGlslName);
            }
        },
        get: function() {
            return boundBuffer;
        },
        set: function(buffer) {
            // FIXME buffer typechecking
            var batchOpts = Lux.getCurrentBatchOpts();
            if (batchOpts.program && (name in batchOpts.program)) {
                var ctx = batchOpts._ctx;
                buffer.bind(batchOpts.program[name]);
            }
            boundBuffer = buffer;
        },
        _attributeName: name,

        //////////////////////////////////////////////////////////////////////
        // debugging

        _jsonHelper: Shade.Debug._jsonBuilder("attribute", function(obj) {
            obj.attributeType = type.repr();
            return obj;
        })

    });
};
