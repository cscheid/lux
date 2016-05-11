Shade.fragCoord = function() {
    return Shade._createConcreteExp({
        expressionType: "builtinInput{gl_FragCoord}",
        parents: [],
        type: Shade.Types.vec4,
        glslExpression: function() { return "gl_FragCoord"; },
        evaluate: function() {
            throw new Error("evaluate undefined for fragCoord");
        },
        element: function(i) {
            return this.at(i);
        },
        compile: function(ctx) {
        },
        _jsonKey: function() { return 'fragCoord'; }
    });
};
