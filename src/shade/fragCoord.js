Shade.fragCoord = function() {
    return Shade._create_concrete_exp({
        expression_type: "builtin_input{gl_FragCoord}",
        parents: [],
        type: Shade.Types.vec4,
        evaluate: function() { return "gl_FragCoord"; },
        compile: function(ctx) {
        }
    });
};
