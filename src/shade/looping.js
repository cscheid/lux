/*
 A range expression represents a finite stream of values. 

 It is meant
 to be an abstraction over looping, and provides a few ways to combine values.

 Currently the only operations supported are plain stream
 transformations (like "map") and fold (like "reduce").

 It should be possible to add, at the very least, "filter", "scan", and "firstWhich".

 nb: nested loops will require deep changes to the infrastructure, and
 won't be supported for a while.

 Currently, looping is fairly untested.
*/

(function() {

Shade.loopVariable = function(type, forceNoDeclare)
{
    return Shade._createConcreteExp({
        parents: [],
        type: type,
        expressionType: "loopVariable",
        glslExpression: function() {
            return this.glslName;
        },
        compile: function(ctx) {
            if (_.isUndefined(forceNoDeclare))
                ctx.globalScope.addDeclaration(type.declare(this.glslName));
        },
        loopVariableDependencies: Shade.memoizeOnField("_loopVariableDependencies", function () {
            return [this];
        }),
        evaluate: function() {
            throw new Error("evaluate undefined for loopVariable");
        }
    });
};

function BasicRange(rangeBegin, rangeEnd, value, condition, termination)
{
    this.begin = Shade.make(rangeBegin).asInt();
    this.end = Shade.make(rangeEnd).asInt();
    this.value = value || function(index) { return index; };
    this.condition = condition || function() { return Shade.make(true); };
    this.termination = termination || function() { return Shade.make(false); };
};

Shade.range = function(rangeBegin, rangeEnd, value, condition, termination)
{
    return new BasicRange(rangeBegin, rangeEnd, value, condition, termination);
};

BasicRange.prototype.transform = function(xform)
{
    var that = this;
    return Shade.range(
        this.begin,
        this.end,
        function (i) {
            var input = that.value(i);
            var result = xform(input, i);
            return result;
        },
        this.condition,
        this.termination
    );
};

BasicRange.prototype.filter = function(newCondition)
{
    var that = this;
    return Shade.range(
        this.begin,
        this.end,
        this.value,
        function (value, i) {
            var oldCondition = that.condition(value, i);
            var result = Shade.and(oldCondition, newCondition(value, i));
            return result;
        },
        this.termination
    );
};

BasicRange.prototype.breakIf = function(newTermination)
{
    var that = this;
    return Shade.range(
        this.begin,
        this.end,
        this.value,
        this.condition,
        function (value, i) {
            var oldTermination = that.termination(value, i);
            var result = Shade.or(oldTermination, newTermination(value, i));
            return result;
        }
    );
};

BasicRange.prototype.fold = Shade(function(operation, startingValue)
{
    var indexVariable = Shade.loopVariable(Shade.Types.intT, true);
    var accumulatorValue = Shade.loopVariable(startingValue.type, true);
    var elementValue = this.value(indexVariable);
    var conditionValue = this.condition(elementValue, indexVariable);
    var terminationValue = this.termination(elementValue, indexVariable);
    var resultType = accumulatorValue.type;
    var operationValue = operation(accumulatorValue, elementValue);
    // FIXME: instead of refusing to compile, we should transform
    // violating expressions to a transformed index variable loop 
    // with a termination condition
    if (!this.begin.isConstant())
        throw new Error("WebGL restricts loop index variable initialization to be constant");
    if (!this.end.isConstant())
        throw new Error("WebGL restricts loop index termination check to be constant");

    var result = Shade._createConcreteExp({
        hasScope: true,
        patchScope: function() {
            var indexVariable = this.parents[2];
            var accumulatorValue = this.parents[3];
            var elementValue = this.parents[4];
            var operationValue = this.parents[6];
            var conditionValue = this.parents[7];
            var terminationValue = this.parents[8];
            var that = this;

            function patchInternal(exp) {
                _.each(exp.sortedSubExpressions(), function(node) {
                    if (_.any(node.loopVariableDependencies(), function(dep) {
                        return dep.glslName === indexVariable.glslName ||
                            dep.glslName === accumulatorValue.glslName;
                    })) {
                        node.scope = that.scope;
                    };
                });
            }

            _.each([elementValue, operationValue, conditionValue, terminationValue], patchInternal);
        },
        parents: [this.begin, this.end, 
                  indexVariable, accumulatorValue, elementValue,
                  startingValue, operationValue,
                  conditionValue, terminationValue
                 ],
        type: resultType,
        element: Shade.memoizeOnField("_element", function(i) {
            if (this.type.isPod()) {
                if (i === 0)
                    return this;
                else
                    throw new Error(this.type.repr() + " is an atomic type");
            } else
                return this.at(i);
        }),
        loopVariableDependencies: Shade.memoizeOnField("_loopVariableDependencies", function () {
            return [];
        }),
        compile: function(ctx) {
            var beg = this.parents[0];
            var end = this.parents[1];
            var indexVariable = this.parents[2];
            var accumulatorValue = this.parents[3];
            var elementValue = this.parents[4];
            var startingValue = this.parents[5];
            var operationValue = this.parents[6];
            var condition = this.parents[7];
            var termination = this.parents[8];
            var mustEvaluateCondition = !(condition.isConstant() && (condition.constantValue() === true));
            var mustEvaluateTermination = !(termination.isConstant() && (termination.constantValue() === false));

            ctx.globalScope.addDeclaration(accumulatorValue.type.declare(accumulatorValue.glslName));
            ctx.strings.push(this.type.repr(), this.glslName, "() {\n");
            ctx.strings.push("    ",accumulatorValue.glslName, "=", startingValue.glslExpression(), ";\n");

            ctx.strings.push("    for (int",
                             indexVariable.glslExpression(),"=",beg.glslExpression(),";",
                             indexVariable.glslExpression(),"<",end.glslExpression(),";",
                             "++",indexVariable.glslExpression(),") {\n");

            _.each(this.scope.declarations, function(exp) {
                ctx.strings.push("        ", exp, ";\n");
            });
            if (mustEvaluateCondition) {
                ctx.strings.push("      if (", condition.glslExpression(), ") {\n");
            }
            _.each(this.scope.initializations, function(exp) {
                ctx.strings.push("        ", exp, ";\n");
            });
            ctx.strings.push("        ",
                             accumulatorValue.glslExpression(),"=",
                             operationValue.glslExpression() + ";\n");
            if (mustEvaluateTermination) {
                ctx.strings.push("        if (", termination.glslExpression(), ") break;\n");
            }
            if (mustEvaluateCondition) {
                ctx.strings.push("      }\n");
            }
            ctx.strings.push("    }\n");
            ctx.strings.push("    return", accumulatorValue.glslExpression(), ";\n");
            ctx.strings.push("}\n");

            if (this.childrenCount > 1) {
                this.precomputedValueGlslName = ctx.requestFreshGlslName();
                ctx.globalScope.addDeclaration(this.type.declare(this.precomputedValueGlslName));
                ctx.globalScope.addInitialization(this.precomputedValueGlslName + " = " + this.glslName + "()");
            }
        },
        glslExpression: function() {
            if (this.childrenCount > 1) {
                return this.precomputedValueGlslName;
            } else {
                return this.glslName + "()";
            }
        },
        evaluate: function() {
            throw new Error("evaluate currently undefined for looping expressions");
        }
    });

    return result;
});

//////////////////////////////////////////////////////////////////////////////

BasicRange.prototype.sum = function()
{
    var thisBeginV = this.value(this.begin);

    return this.fold(Shade.add, thisBeginV.type.zero);
};

BasicRange.prototype.max = function()
{
    var thisBeginV = this.value(this.begin);
    return this.fold(Shade.max, thisBeginV.type.minusInfinity);
};

BasicRange.prototype.average = function()
{
    // special-case average when we know the total number of samples in advance
    // 
    // this is ugly, but how could I make it better?
    var s = this.sum();
    if ((s.parents[7].isConstant() &&
         s.parents[7].constantValue() === true) &&
        (s.parents[8].isConstant() &&
         s.parents[8].constantValue() === false)) {
        if (s.type.equals(Shade.Types.intT)) s = s.asFloat();
        return s.div(this.end.sub(this.begin).asFloat());
    } else {
        var xf = this.transform(function(v) {
            return Shade({
                s1: 1,
                sx: v
            });
        });
        var sumResult = xf.sum();
        var sx = sumResult("sx");
        if (sx.type.equals(Shade.Types.intT)) {
            sx = sx.asFloat();
        }
        return sx.div(sumResult("s1"));
    }
};

Shade.locate = Shade(function(accessor, target, left, right, nsteps)
{
    function halfway(a, b) { return a.asFloat().add(b.asFloat()).div(2).asInt(); };

    nsteps = nsteps || right.sub(left).log2().ceil();
    var base = Shade.range(0, nsteps);
    var mid = halfway(left, right);
    var initialState = Shade({
        l: left.asInt(),
        r: right.asInt(),
        m: mid.asInt(),
        vl: accessor(left),
        vr: accessor(right),
        vm: accessor(mid)
    });
    return base.fold(function(state, i) {
        var rightNm = halfway(state("m"), state("r"));
        var leftNm = halfway(state("l"), state("m"));
        return state("vm").lt(target).ifelse(Shade({
            l: state("m"), vl: state("vm"),
            m: rightNm,   vm: accessor(rightNm),
            r: state("r"), vr: state("vr")
        }), Shade({
            l: state("l"), vl: state("vl"),
            m: leftNm,    vm: accessor(leftNm),
            r: state("m"), vr: state("vm")
        }));
    }, initialState);
});

})();
