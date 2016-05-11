Shade.seq = function(parents)
{
    if (parents.length == 1) {
        return parents[0];
    }
    return Shade._createConcreteExp({
        expressionName: "seq",
        parents: parents,
        glslExpression: function(glslName) {
            return this.parents.map(function (n) { return n.glslExpression(); }).join("; ");
        },
        type: Shade.Types.voidT,
        compile: function (ctx) {},
        evaluate: Shade.memoizeOnGuidDict(function(cache) {
            return this.parents[this.parents.length-1].evaluate(cache);
        })
    });
};
