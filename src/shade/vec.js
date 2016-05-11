Shade.vec = function()
{
    var parents = [];
    var parentOffsets = [];
    var totalSize = 0;
    var vecType;
    for (var i=0; i<arguments.length; ++i) {
        var arg = Shade.make(arguments[i]);
        parents.push(arg);
        parentOffsets.push(totalSize);
        if (_.isUndefined(vecType))
            vecType = arg.type.elementType(0);
        else if (!vecType.equals(arg.type.elementType(0)))
            throw new Error("vec requires equal types");
        totalSize += arg.type.sizeForVecConstructor();
    }
    parentOffsets.push(totalSize);
    if (totalSize < 1 || totalSize > 4) {
        throw new Error("vec constructor requires resulting width to be between "
            + "1 and 4, got " + totalSize + " instead");
    }
    var type;
    if (vecType.equals(Shade.Types.floatT)) {
        type = Shade.Types["vec" + totalSize];
    } else if (vecType.equals(Shade.Types.intT)) {
        type = Shade.Types["ivec" + totalSize];
    } else if (vecType.equals(Shade.Types.boolT)) {
        type = Shade.Types["bvec" + totalSize];
    } else {
        throw new Error("vec type must be bool, int, or float");
    }
    
    return Shade._createConcreteValueExp({
        parents: parents,
        parentOffsets: parentOffsets,
        type: type,
        expressionType: 'vec',
        size: totalSize,
        element: function(i) {
            var oldI = i;
            for (var j=0; j<this.parents.length; ++j) {
                var sz = this.parentOffsets[j+1] - this.parentOffsets[j];
                if (i < sz)
                    return this.parents[j].element(i);
                i = i - sz;
            }
            throw new Error("element " + oldI + " out of bounds (size=" 
                + totalSize + ")");
        },
        elementIsConstant: function(i) {
            var oldI = i;
            for (var j=0; j<this.parents.length; ++j) {
                var sz = this.parentOffsets[j+1] - this.parentOffsets[j];
                if (i < sz)
                    return this.parents[j].elementIsConstant(i);
                i = i - sz;
            }
            throw new Error("element " + oldI + " out of bounds (size=" 
                + totalSize + ")");
        },
        elementConstantValue: function(i) {
            var oldI = i;
            for (var j=0; j<this.parents.length; ++j) {
                var sz = this.parentOffsets[j+1] - this.parentOffsets[j];
                if (i < sz)
                    return this.parents[j].elementConstantValue(i);
                i = i - sz;
            }
            throw new Error("element " + oldI + " out of bounds (size=" 
                + totalSize + ")");
        },
        evaluate: Shade.memoizeOnGuidDict(function(cache) {
            var result = [];
            var parentValues = _.each(this.parents, function(v) {
                var c = v.evaluate(cache);
                if (Lux.typeOf(c) === 'number')
                    result.push(c);
                else
                    for (var i=0; i<c.length; ++i)
                        result.push(c[i]);
            });
            return vec[result.length].make(result);
        }),
        value: function() {
            return this.type.repr() + "(" +
                this.parents.map(function (t) {
                    return t.glslExpression();
                }).join(", ") + ")";
        }
    });
};
