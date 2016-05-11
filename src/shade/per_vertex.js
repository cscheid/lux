// perVertex is an identity operation value-wise, but it tags the AST
// so the optimizer can do its thing.
Shade.perVertex = function(exp)
{
    exp = Shade.make(exp);
    return Shade._createConcreteExp({
        expressionName: "perVertex",
        parents: [exp],
        type: exp.type,
        stage: "vertex",
        glslExpression: function() { return this.parents[0].glslExpression(); },
        evaluate: function () { return this.parents[0].evaluate(); },
        compile: function () {}
    });
};
