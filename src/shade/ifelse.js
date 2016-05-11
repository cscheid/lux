Shade.ifelse = function(condition, ifTrue, ifFalse)
{
    condition = Shade.make(condition);
    ifTrue = Shade.make(ifTrue);
    ifFalse = Shade.make(ifFalse);

    if (!ifTrue.type.equals(ifFalse.type))
        throw new Error("ifelse return expressions must have same types");
    if (!condition.type.equals(condition.type))
        throw new Error("ifelse condition must be of type bool");

    return Shade._createConcreteValueExp( {
        parents: [condition, ifTrue, ifFalse],
        type: ifTrue.type,
        expressionType: "ifelse",
        // FIXME: works around Chrome Bug ID 103053
        _mustBeFunctionCall: true,
        value: function() {
            return "(" + this.parents[0].glslExpression() + "?"
                + this.parents[1].glslExpression() + ":"
                + this.parents[2].glslExpression() + ")";
        },
        /*
         * The methods isConstant(), constantValue() and evaluate() for
         * Shade.ifelse are designed to handle cases like the following:
         * 
         * Shade.ifelse(Shade.parameter("bool"), 3, 3).isConstant()
         * 
         * That expression should be true.
         * 
         */ 
        constantValue: function() {
            if (!this.parents[0].isConstant()) {
                // This only gets called when this.isConstant() holds, so
                // it must be that this.parents[1].constantValue() == 
                // this.parents[2].constantValue(); we return either
                return this.parents[1].constantValue();
            } else {
                return (this.parents[0].constantValue() ?
                        this.parents[1].constantValue() :
                        this.parents[2].constantValue());
            }
        },
        evaluate: Shade.memoizeOnGuidDict(function(cache) {
            if (this.parents[1].isConstant() &&
                this.parents[2].isConstant() &&
                this.type.valueEquals(this.parents[1].constantValue(),
                                      this.parents[2].constantValue())) {
                // if both sides of the branch have the same value, then
                // this evaluates to the constant, regardless of the condition.
                return this.parents[1].constantValue();
            } else {
                return this.parents[0].evaluate(cache)?
                    this.parents[1].evaluate(cache):
                    this.parents[2].evaluate(cache);
            };
        }),
        isConstant: function() {
            if (!this.parents[0].isConstant()) {
                // if condition is not constant, 
                // then expression is only constant if sides always
                // evaluate to same values.
                if (this.parents[1].isConstant() && 
                    this.parents[2].isConstant()) {
                    var v1 = this.parents[1].constantValue();
                    var v2 = this.parents[2].constantValue();
                    return this.type.valueEquals(v1, v2);
                } else {
                    return false;
                }
            } else {
                // if condition is constant, then
                // the expression is constant if the appropriate
                // side of the evaluation is constant.
                return (this.parents[0].constantValue() ?
                        this.parents[1].isConstant() :
                        this.parents[2].isConstant());
            }
        },
        element: function(i) {
            return Shade.ifelse(this.parents[0],
                                this.parents[1].element(i),
                                this.parents[2].element(i));
        },
        elementConstantValue: function(i) {
            if (!this.parents[0].isConstant()) {
                // This only gets called when this.isConstant() holds, so
                // it must be that this.parents[1].constantValue() == 
                // this.parents[2].constantValue(); we return either
                return this.parents[1].elementConstantValue(i);
            } else {
                return (this.parents[0].constantValue() ?
                        this.parents[1].elementConstantValue(i) :
                        this.parents[2].elementConstantValue(i));
            }
        },
        elementIsConstant: function(i) {
            if (!this.parents[0].isConstant()) {
                // if condition is not constant, 
                // then expression is only constant if sides always
                // evaluate to same values.
                if (this.parents[1].elementIsConstant(i) && 
                    this.parents[2].elementIsConstant(i)) {
                    var v1 = this.parents[1].elementConstantValue(i);
                    var v2 = this.parents[2].elementConstantValue(i);
                    return this.type.elementType(i).valueEquals(v1, v2);
                } else {
                    return false;
                }
            } else {
                // if condition is constant, then
                // the expression is constant if the appropriate
                // side of the evaluation is constant.
                return (this.parents[0].constantValue() ?
                        this.parents[1].elementIsConstant(i) :
                        this.parents[2].elementIsConstant(i));
            }
        },
        parentIsUnconditional: function(i) {
            return i === 0;
        }
    });
};

Shade.Exp.ifelse = function(ifTrue, ifFalse)
{
    return Shade.ifelse(this, ifTrue, ifFalse);
};
