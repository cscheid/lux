/* Shade.set is essentially an internal method for Shade. Don't use it
   unless you know exactly what you're doing.
 */

Shade.set = function(exp, name)
{
    exp = Shade(exp);
    var type = exp.type;
    return Shade._createConcreteExp({
        expressionType: "set",
        compile: function(ctx) {
            if ((name === "gl_FragColor" ||
                 (name.substring(0, 11) === "gl_FragData")) &&
                ctx.compileType !== Shade.FRAGMENT_PROGRAM_COMPILE) {
                throw new Error("gl_FragColor and gl_FragData assignment"
                       + " only allowed on fragment shaders");
            }
            if ((name === "gl_Position" ||
                 name === "gl_PointSize") &&
                ctx.compileType !== Shade.VERTEX_PROGRAM_COMPILE) {
                throw new Error("gl_Position and gl_PointSize assignment "
                       + "only allowed on vertex shaders");
            }
            if ((ctx.compileType !== Shade.VERTEX_PROGRAM_COMPILE) &&
                (name !== "gl_FragColor") &&
                (name.substring(0, 11) !== "gl_FragData")) {
                throw new Error("the only allowed output variables on a fragment"
                       + " shader are gl_FragColor and gl_FragData[]");
            }
            if (name !== "gl_FragColor" &&
                name !== "gl_Position" &&
                name !== "gl_PointSize" &&
                name.substring(0, 11) !== "gl_FragData") {
                ctx.declareVarying(name, type);
            }
            ctx.voidFunction(this, "(", name, "=", this.parents[0].glslExpression(), ")");
        },
        type: Shade.Types.voidT,
        parents: [exp],
        evaluate: Shade.memoizeOnGuidDict(function(cache) {
            return this.parents[0].evaluate(cache);
        })
    });
};
