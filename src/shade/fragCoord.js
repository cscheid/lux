Shade.fragCoord = function() {
    return Shade._create_concrete_exp({
        expression_type: "builtin_input{gl_FragCoord}",
        parents: [],
        type: Shade.Types.vec4,
        glsl_expression: function() { return "gl_FragCoord"; },
        evaluate: function() {
            throw new Error("evaluate undefined for fragCoord");
        },
        compile: function(ctx) {
        },
        json_key: function() { return "fragCoord"; }
    });
};
