/*
 * Shade.discardIf: conditionally discard fragments from the pipeline
 * 

*********************************************************************************
 * 
 * For future reference, this is a copy of the org discussion on the
 * discard statement as I was designing it.
 * 

Discard is a statement; I don't really have statements in the
language.


*** discard is fragment-only.

How do I implement discard in a vertex shader?

**** Possibilities:
***** Disallow it to happen in the vertex shader
Good: Simplest
Bad: Breaks the model in Lux programs where we don't care much about
what happens in vertex expressions vs fragment expressions
Ugly: The error messages would be really opaque, unless I specifically
detect where the discard statement would appear.
***** Send the vertex outside the homogenous cube
Good: Simple
Bad: doesn't discard the whole primitive
Ugly: would make triangles, etc look really weird.
***** Set some special varying which discards every single fragment in the shader
Good: Discards an entire primitive.
Bad: Wastes a varying, which might be a scarce resource.
Ugly: varying cannot be discrete (bool). The solution would be to
discard if varying is greater than zero, set the discarded varying to be greater
than the largest possible distance between two vertices on the screen,
and the non-discarded to zero.

*** Implementation ideas:

**** special key for the program description

like so:

{
  gl_Position: foo
  gl_FragColor: bar
  discardIf: baz
}

The main disadvantage here is that one application of discard is to
save computation time. This means that my current initialization of
variables used in more than one context will be wasteful if none of
these variables are actually used before the discard condition is
verified. What I would need, then, is some dependency analysis that
determines which variables are used for which discard checks, and
computes those in the correct order.

This discard interacts with the initializer code.

**** new expression called discardIf

We add a discardWhen(condition, valueIfNot) expression, which
issues the discard statement if condition is true. 

But what about discardWhen being executed inside conditional
expressions? Worse: discardWhen would turn case D above from a
performance problem into an actual bug.

 * 
 */

Shade.discardIf = function(exp, condition)
{
    if (_.isUndefined(exp) ||
        _.isUndefined(condition))
        throw new Error("discardIf expects two parameters");
    exp = Shade.make(exp);
    condition = Shade.make(condition);

    var result = Shade._createConcreteExp({
        isConstant: Shade.memoizeOnField("_isConstant", function() {
            var cond = _.all(this.parents, function(v) {
                return v.isConstant();
            });
            return (cond && !this.parents[1].constantValue());
        }),
        _mustBeFunctionCall: true,
        type: exp.type,
        expressionType: "discardIf",
        parents: [exp, condition],
        parentIsUnconditional: function(i) {
            return i === 0;
        },
        compile: function(ctx) {
            ctx.strings.push(this.parents[0].type.repr(), this.glslName, "(void) {\n",
                             "    if (",this.parents[1].glslExpression(),") discard;\n",
                             "    return ", this.parents[0].glslExpression(), ";\n}\n");
        },
        // FIXME How does evaluate interact with fragment discarding?
        // I still need to define the value of a discarded fragment. Currently evaluate
        // on fragment-varying expressions is undefined anyway, so we punt.
        evaluate: function(cache) {
            return exp.evaluate(cache);
        }
    });
    return result;
};
