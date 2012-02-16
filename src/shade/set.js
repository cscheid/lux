Shade.set = function(exp, name)
{
    exp = Shade.make(exp);
    var type = exp.type;
    return Shade._create_concrete_exp({
        expression_type: "set",
        compile: function(ctx) {
            if ((name === "gl_FragColor" ||
                 (name.substring(0, 11) === "gl_FragData")) &&
                ctx.compile_type !== Shade.FRAGMENT_PROGRAM_COMPILE) {
                throw ("gl_FragColor and gl_FragData assignment"
                       + " only allowed on fragment shaders");
            }
            if ((name === "gl_Position" ||
                 name === "gl_PointSize") &&
                ctx.compile_type !== Shade.VERTEX_PROGRAM_COMPILE) {
                throw ("gl_Position and gl_PointSize assignment "
                       + "only allowed on vertex shaders");
            }
            if ((ctx.compile_type !== Shade.VERTEX_PROGRAM_COMPILE) &&
                (name !== "gl_FragColor") &&
                (name.substring(0, 11) !== "gl_FragData")) {
                throw ("the only allowed output variables on a fragment"
                       + " shader are gl_FragColor and gl_FragData[]");
            }
            if (name !== "gl_FragColor" &&
                name !== "gl_Position" &&
                name !== "gl_PointSize" &&
                name.substring(0, 11) !== "gl_FragData") {
                ctx.declare_varying(name, type);
            }
            ctx.void_function(this, "(", name, "=", this.parents[0].evaluate(), ")");
        },
        type: Shade.basic('void'),
        parents: [exp]
    });
};
