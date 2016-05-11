
// Shade.array denotes an array of Lux values of the same type:
//    Shade.array([2, 3, 4, 5, 6]);

Shade.array = function(v)
{
    var t = Lux.typeOf(v);
    if (t !== 'array')
        throw new Error("type error: need array");

    var newV = v.map(Shade.make);
    var arraySize = newV.length;
    if (arraySize === 0) {
        throw new Error("array constant must be non-empty");
    }

    var newTypes = newV.map(function(t) { return t.type; });
    var arrayType = Shade.Types.array(newTypes[0], arraySize);
    if (_.any(newTypes, function(t) { return !t.equals(newTypes[0]); })) {
        throw new Error("array elements must have identical types");
    }
    return Shade._createConcreteExp( {
        parents: newV,
        type: arrayType,
        arrayElementType: newTypes[0],
        expressionType: "constant", // FIXME: is there a reason this is not "array"?

        evaluate: Shade.memoizeOnGuidDict(function(cache) {
            return _.map(this.parents, function(e) {
                return e.evaluate(cache);
            });
        }),
        
        glslExpression: function() { return this.glslName; },
        compile: function (ctx) {
            this.arrayInitializerGlslName = ctx.requestFreshGlslName();
            ctx.strings.push(this.type.declare(this.glslName), ";\n");
            ctx.strings.push("void", this.arrayInitializerGlslName, "(void) {\n");
            for (var i=0; i<this.parents.length; ++i) {
                ctx.strings.push("    ", this.glslName, "[", i, "] =",
                                 this.parents[i].glslExpression(), ";\n");
            }
            ctx.strings.push("}\n");
            ctx.addInitialization(this.arrayInitializerGlslName + "()");
        },
        isConstant: function() { return false; }, 
        element: function(i) {
            return this.parents[i];
        },
        elementIsConstant: function(i) {
            return this.parents[i].isConstant();
        },
        elementConstantValue: function(i) {
            return this.parents[i].constantValue();
        },
        locate: function(target, xform) {
            var that = this;
            xform = xform || function(x) { return x; };
            return Shade.locate(function(i) { return xform(that.at(i.asInt())); }, target, 0, arraySize-1);
        },

        _jsonKey: function() { return "array"; }
    });
};
