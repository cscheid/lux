Shade.pointCoord = function() {
    return Shade._create_concrete_exp({
        expression_type: "builtin_input{gl_PointCoord}",
        parents: [],
        type: Shade.Types.vec2,
        evaluate: function() { return "gl_PointCoord"; },
        compile: function(ctx) {
        }
    });
};
