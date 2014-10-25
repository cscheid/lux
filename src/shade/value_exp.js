/*
 * FIXME the webgl compiler seems to be having trouble with the
 * conditional expressions in longer shaders.  Temporarily, then, I
 * will replace all "unconditional" checks with "true". The end effect
 * is that the shader always evaluates potentially unused sides of a
 * conditional expression if they're used in two or more places in
 * the shader.
 */

Shade.ValueExp = Shade._create(Shade.Exp, {
    isConstant: Shade.memoizeOnField("_isConstant", function() {
        return _.all(this.parents, function(v) {
            return v.isConstant();
        });
    }),
    elementIsConstant: Shade.memoizeOnField("_elementIsConstant", function(i) {
        return this.isConstant();
    }),
    elementConstantValue: Shade.memoizeOnField("_elementConstantValue", function (i) {
        return this.element(i).constantValue();
    }),
    _mustBeFunctionCall: false,
    glslExpression: function() {
        var unconditional = true; // see comment on top
        if (this._mustBeFunctionCall) {
            return this.glslName + "(" + _.map(this.loopVariableDependencies(), function(exp) {
                return exp.glslName;
            }).join(",") + ")";
        }
        // this.childrenCount will be undefined if object was built
        // during compilation (lifted operators for structs will do that, for example)
        if (_.isUndefined(this.childrenCount) || this.childrenCount <= 1)
            return this.value();
        if (unconditional)
            return this.precomputedValueGlslName;
        else
            return this.glslName + "()";
    },
    element: function(i) {
        if (this.type.isPod()) {
            if (i === 0)
                return this;
            else
                throw new Error(this.type.repr() + " is an atomic type, got this: " + i);
        } else {
            this.debugPrint();
            throw new Error("Internal error; this should have been overriden.");
        }
    },
    compile: function(ctx) {
        var unconditional = true; // see comment on top
        if (this._mustBeFunctionCall) {
            if (unconditional) {
                if (this.childrenCount > 1) {
                    this.precomputedValueGlslName = ctx.requestFreshGlslName();
                    this.scope.addDeclaration(this.type.declare(this.precomputedValueGlslName));
                    this.scope.addInitialization(this.precomputedValueGlslName + " = " + this.value());
                    ctx.valueFunction(this, this.precomputedValueGlslName);
                } else {
                    ctx.valueFunction(this, this.value());
                }
            } else {
                if (this.childrenCount > 1) {
                    this.precomputedValueGlslName = ctx.requestFreshGlslName();
                    this.hasPrecomputedValueGlslName = ctx.requestFreshGlslName();
                    this.scope.addDeclaration(this.type.declare(this.precomputedValueGlslName));
                    this.scope.addDeclaration(Shade.Types.boolT.declare(this.hasPrecomputedValueGlslName));
                    this.scope.addInitialization(this.hasPrecomputedValueGlslName + " = false");

                    ctx.valueFunction(this, "(" + this.hasPrecomputedValueGlslName + "?"
                                       + this.precomputedValueGlslName + ": (("
                                       + this.hasPrecomputedValueGlslName + "=true),("
                                       + this.precomputedValueGlslName + "="
                                       + this.value() + ")))");
                } else
                    ctx.valueFunction(this, this.value());
            }
        } else {
            if (unconditional) {
                if (this.childrenCount > 1) {
                    this.precomputedValueGlslName = ctx.requestFreshGlslName();
                    this.scope.addDeclaration(this.type.declare(this.precomputedValueGlslName));
                    this.scope.addInitialization(this.precomputedValueGlslName + " = " + this.value());
                } else {
                    // don't emit anything, all is taken care by glslExpression()
                }
            } else {
                if (this.childrenCount > 1) {
                    this.precomputedValueGlslName = ctx.requestFreshGlslName();
                    this.hasPrecomputedValueGlslName = ctx.requestFreshGlslName();
                    this.scope.addDeclaration(this.type.declare(this.precomputedValueGlslName));
                    this.scope.addDeclaration(Shade.Types.boolT.declare(this.hasPrecomputedValueGlslName));
                    this.scope.addInitialization(this.hasPrecomputedValueGlslName + " = false");
                    ctx.valueFunction(this, "(" + this.hasPrecomputedValueGlslName + "?"
                                       + this.precomputedValueGlslName + ": (("
                                       + this.hasPrecomputedValueGlslName + "=true),("
                                       + this.precomputedValueGlslName + "="
                                       + this.value() + ")))");
                } else {
                    // don't emit anything, all is taken care by glslExpression()
                }
            }
        }
    }
});
Shade._createConcreteValueExp = Shade._createConcrete(Shade.ValueExp, ["parents", "type", "value"]);
