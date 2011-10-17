Shade.seq = function(parents)
{
    if (parents.length == 1) {
        return parents[0];
    }
    return Shade._create_concrete_exp({
        expression_name: "seq",
        parents: parents,
        eval: function(glsl_name) {
            return this.parents.map(function (n) { return n.eval(); }).join("; ");
        },
        type: Shade.basic('void'),
        compile: function (ctx) {}
    });
};
