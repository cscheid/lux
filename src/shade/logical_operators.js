(function() {

var logicalOperatorBinexp = function(exp1, exp2, operatorName, evaluator,
                                     parentIsUnconditional, shadeName)
{
    parentIsUnconditional = parentIsUnconditional ||
        function (i) { return true; };
    return Shade._createConcreteValueExp({
        parents: [exp1, exp2],
        type: Shade.Types.boolT,
        expressionType: "operator" + operatorName,
        value: function() {
            return "(" + this.parents[0].glslExpression() + " " + operatorName + " " +
                this.parents[1].glslExpression() + ")";
        },
        evaluate: Shade.memoizeOnGuidDict(function(cache) {
            return evaluator(this, cache);
        }),
        parentIsUnconditional: parentIsUnconditional,
        _jsonKey: function() { return shadeName; }
    });
};

var liftBinfunToEvaluator = function(binfun) {
    return function(exp, cache) {
        var exp1 = exp.parents[0], exp2 = exp.parents[1];
        return binfun(exp1.evaluate(cache), exp2.evaluate(cache));
    };
};

var logicalOperatorExp = function(operatorName, binaryEvaluator,
                                  parentIsUnconditional, shadeName)
{
    return function() {
        if (arguments.length === 0) 
            throw new Error("operator " + operatorName 
                   + " requires at least 1 parameter");
        if (arguments.length === 1) return Shade(arguments[0]).asBool();
        var first = Shade(arguments[0]);
        if (!first.type.equals(Shade.Types.boolT))
            throw new Error("operator " + operatorName + 
                   " requires booleans, got argument 1 as " +
                   arguments[0].type.repr() + " instead.");
        var currentResult = first;
        for (var i=1; i<arguments.length; ++i) {
            var next = Shade(arguments[i]);
            if (!next.type.equals(Shade.Types.boolT))
                throw new Error("operator " + operatorName + 
                       " requires booleans, got argument " + (i+1) +
                       " as " + next.type.repr() + " instead.");
            currentResult = logicalOperatorBinexp(
                currentResult, next,
                operatorName, binaryEvaluator,
                parentIsUnconditional, shadeName);
        }
        return currentResult;
    };
};

Shade.or = logicalOperatorExp(
    "||", liftBinfunToEvaluator(function(a, b) { return a || b; }),
    function(i) { return i === 0; }, "or"
);

Shade.Exp.or = function(other)
{
    return Shade.or(this, other);
};

Shade.and = logicalOperatorExp(
    "&&", liftBinfunToEvaluator(function(a, b) { return a && b; }),
    function(i) { return i === 0; }, "and"
);

Shade.Exp.and = function(other)
{
    return Shade.and(this, other);
};

Shade.xor = logicalOperatorExp(
    "^^", liftBinfunToEvaluator(function(a, b) { return ~~(a ^ b); }), undefined, "xor");
Shade.Exp.xor = function(other)
{
    return Shade.xor(this, other);
};

Shade.not = Shade(function(exp)
{
    if (!exp.type.equals(Shade.Types.boolT)) {
        throw new Error("logicalNot requires bool expression");
    }
    return Shade._createConcreteValueExp({
        parents: [exp],
        type: Shade.Types.boolT,
        expressionType: "operator!",
        value: function() {
            return "(!" + this.parents[0].glslExpression() + ")";
        },
        evaluate: Shade.memoizeOnGuidDict(function(cache) {
            return !this.parents[0].evaluate(cache);
        }),
        _jsonKey: function() { return "not"; }
    });
});

Shade.Exp.not = function() { return Shade.not(this); };

var comparisonOperatorExp = function(operatorName, typeChecker, binaryEvaluator, shadeName)
{
    return Shade(function(first, second) {
        typeChecker(first.type, second.type);

        return logicalOperatorBinexp(
            first, second, operatorName, binaryEvaluator, undefined, shadeName);
    });
};

var inequalityTypeChecker = function(name) {
    return function(t1, t2) {
        if (!(t1.equals(Shade.Types.floatT) && 
              t2.equals(Shade.Types.floatT)) &&
            !(t1.equals(Shade.Types.intT) && 
              t2.equals(Shade.Types.intT)))
            throw new Error("operator" + name + 
                   " requires two ints or two floats, got " +
                   t1.repr() + " and " + t2.repr() +
                   " instead.");
    };
};

var equalityTypeChecker = function(name) {
    return function(t1, t2) {
        if (!t1.equals(t2))
            throw new Error("operator" + name +
                   " requires same types, got " +
                   t1.repr() + " and " + t2.repr() +
                   " instead.");
        if (t1.isArray() && !t1.isVec() && !t1.isMat())
            throw new Error("operator" + name +
                   " does not support arrays");
    };
};

Shade.lt = comparisonOperatorExp("<", inequalityTypeChecker("<"),
    liftBinfunToEvaluator(function(a, b) { return a < b; }), "lt");
Shade.Exp.lt = function(other) { return Shade.lt(this, other); };

Shade.le = comparisonOperatorExp("<=", inequalityTypeChecker("<="),
    liftBinfunToEvaluator(function(a, b) { return a <= b; }), "le");
Shade.Exp.le = function(other) { return Shade.le(this, other); };

Shade.gt = comparisonOperatorExp(">", inequalityTypeChecker(">"),
    liftBinfunToEvaluator(function(a, b) { return a > b; }), "gt");
Shade.Exp.gt = function(other) { return Shade.gt(this, other); };

Shade.ge = comparisonOperatorExp(">=", inequalityTypeChecker(">="),
    liftBinfunToEvaluator(function(a, b) { return a >= b; }), "ge");
Shade.Exp.ge = function(other) { return Shade.ge(this, other); };

Shade.eq = comparisonOperatorExp("==", equalityTypeChecker("=="),
    liftBinfunToEvaluator(function(a, b) {
        if (Lux.typeOf(a) === 'array') {
            return _.all(_.map(_.zip(a, b),
                               function(v) { return v[0] === v[1]; }),
                         function (x) { return x; });
        }
        return Shade.Types.typeOf(a).valueEquals(a, b);
    }), "eq");
Shade.Exp.eq = function(other) { return Shade.eq(this, other); };

Shade.ne = comparisonOperatorExp("!=", equalityTypeChecker("!="),
    liftBinfunToEvaluator(function(a, b) { 
        if (Lux.typeOf(a) === 'array') {
            return _.any(_.map(_.zip(a, b),
                               function(v) { return v[0] !== v[1]; } ),
                         function (x) { return x; });
        }
        return !Shade.Types.typeOf(a).valueEquals(a, b);
    }), "ne");
Shade.Exp.ne = function(other) { return Shade.ne(this, other); };

// component-wise comparisons are defined on builtins.js

})();
