Shade.pointCoord = function() {
    return Shade._create_concrete_exp({
        expression_type: "builtin_input{gl_PointCoord}",
        parents: [],
        type: Shade.Types.vec2,
        glsl_expression: function() { return "gl_PointCoord"; },
        compile: function(ctx) {
        },
        evaluate: function() {
            throw new Error("evaluate undefined for pointCoord");
        },
        element: function(i) {
            return this.at(i);
        },
        _json_key: function() { return 'pointCoord'; }
    });
};
