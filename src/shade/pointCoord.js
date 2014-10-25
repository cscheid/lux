Shade.pointCoord = function() {
    return Shade._createConcreteExp({
        expressionType: "builtinInput{gl_PointCoord}",
        parents: [],
        type: Shade.Types.vec2,
        glslExpression: function() { return "gl_PointCoord"; },
        compile: function(ctx) {
        },
        evaluate: function() {
            throw new Error("evaluate undefined for pointCoord");
        },
        element: function(i) {
            return this.at(i);
        },
        _jsonKey: function() { return 'pointCoord'; }
    });
};
