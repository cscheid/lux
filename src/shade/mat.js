Shade.mat = function()
{
    var parents = [];
    var rows = arguments.length, cols;

    for (var i=0; i<arguments.length; ++i) {
        var arg = arguments[i];
        // if (!(arg.expressionType === 'vec')) {
        //     throw new Error("mat only takes vecs as parameters");
        // }
        parents.push(arg);
        if (i === 0)
            cols = arg.type.sizeForVecConstructor();
        else if (cols !== arg.type.sizeForVecConstructor())
            throw new Error("mat: all vecs must have same dimension");
    }

    if (cols !== rows) {
        throw new Error("non-square matrices currently not supported");
    }

    if (rows < 1 || rows > 4) {
        throw new Error("mat constructor requires resulting dimension to be between "
            + "2 and 4");
    }
    var type = Shade.Types["mat" + rows];
    return Shade._createConcreteValueExp( {
        parents: parents,
        type: type,
        expressionType: 'mat',
        size: rows,
        element: function(i) {
            return this.parents[i];
        },
        elementIsConstant: function(i) {
            return this.parents[i].isConstant();
        },
        elementConstantValue: function(i) {
            return this.parents[i].constantValue();
        },
        evaluate: Shade.memoizeOnGuidDict(function(cache) {
            var result = [];
            var ll = _.each(this.parents, function(v) {
                v = v.evaluate(cache);
                for (var i=0; i<v.length; ++i) {
                    result.push(v[i]);
                }
            });
            return mat[this.type.arraySize()].make(result);
        }),
        value: function() {
            return this.type.repr() + "(" +
                this.parents.map(function (t) { 
                    return t.glslExpression(); 
                }).join(", ") + ")";
        }
    });
};

Shade.mat3 = function(m)
{
    var t = m.type;
    if (t.equals(Shade.Types.mat2)) {
        return Shade.mat(Shade.vec(m.at(0), 0),
                         Shade.vec(m.at(1), 0),
                         Shade.vec(0, 0, 1));
    } else if (t.equals(Shade.Types.mat3)) {
        return m;
    } else if (t.equals(Shade.Types.mat4)) {
        return Shade.mat(m.element(0).swizzle("xyz"),
                         m.element(1).swizzle("xyz"),
                         m.element(2).swizzle("xyz"));
    } else {
        throw new Error("need matrix to convert to mat3");
    }
};
