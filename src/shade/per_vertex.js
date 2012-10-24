// per_vertex is an identity operation value-wise, but it tags the AST
// so the optimizer can do its thing.
Shade.per_vertex = function(exp)
{
    exp = Shade.make(exp);
    return Shade._create_concrete_exp({
        expression_name: "per_vertex",
        parents: [exp],
        type: exp.type,
        stage: "vertex",
        glsl_expression: function() { return this.parents[0].glsl_expression(); },
        evaluate: function () { return this.parents[0].evaluate(); },
        compile: function () {}
    });
};
