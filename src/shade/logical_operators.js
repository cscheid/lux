(function() {

var logical_operator_binexp = function(exp1, exp2, operator_name, constant_evaluator,
                                       parent_is_unconditional)
{
    parent_is_unconditional = parent_is_unconditional ||
        function (i) { return true; };
    return Shade._create_concrete_value_exp({
        parents: [exp1, exp2],
        type: Shade.Types.bool_t,
        expression_type: "operator" + operator_name,
        value: function() {
            return "(" + this.parents[0].eval() + " " + operator_name + " " +
                this.parents[1].eval() + ")";
        },
        constant_value: Shade.memoize_on_field("_constant_value", function() {
            return constant_evaluator(this);
        }),
        parent_is_unconditional: parent_is_unconditional
    });
};

var lift_binfun_to_evaluator = function(binfun) {
    return function(exp) {
        var exp1 = exp.parents[0], exp2 = exp.parents[1];
        return binfun(exp1.constant_value(), exp2.constant_value());
    };
};

var logical_operator_exp = function(operator_name, binary_evaluator,
                                    parent_is_unconditional)
{
    return function() {
        if (arguments.length === 0) 
            throw ("operator " + operator_name 
                   + " requires at least 1 parameter");
        if (arguments.length === 1) return Shade.make(arguments[0]).as_bool();
        var first = Shade.make(arguments[0]);
        if (!first.type.equals(Shade.Types.bool_t))
            throw ("operator " + operator_name + 
                   " requires booleans, got argument 1 as " +
                   arguments[0].type.repr() + " instead.");
        var current_result = first;
        for (var i=1; i<arguments.length; ++i) {
            var next = Shade.make(arguments[i]);
            if (!next.type.equals(Shade.Types.bool_t))
                throw ("operator " + operator_name + 
                       " requires booleans, got argument " + (i+1) +
                       " as " + next.type.repr() + " instead.");
            current_result = logical_operator_binexp(
                current_result, next,
                operator_name, binary_evaluator,
                parent_is_unconditional);
        }
        return current_result;
    };
};

Shade.or = logical_operator_exp(
    "||", lift_binfun_to_evaluator(function(a, b) { return a || b; }),
    function(i) { return i == 0; }
);

Shade.Exp.or = function(other)
{
    return Shade.or(this, other);
};

Shade.and = logical_operator_exp(
    "&&", lift_binfun_to_evaluator(function(a, b) { return a && b; }),
    function(i) { return i == 0; }
);

Shade.Exp.and = function(other)
{
    return Shade.and(this, other);
};

Shade.xor = logical_operator_exp(
    "^^", lift_binfun_to_evaluator(function(a, b) { return ~~(a ^ b); }));
Shade.Exp.xor = function(other)
{
    return Shade.xor(this, other);
};

Shade.not = function(exp)
{
    exp = Shade.make(exp);
    if (!exp.type.equals(Shade.Types.bool_t)) {
        throw "logical_not requires bool expression";
    }
    return Shade._create_concrete_value_exp({
        parents: [exp],
        type: Shade.Types.bool_t,
        expression_type: "operator!",
        value: function() {
            return "(!" + this.parents[0].eval() + ")";
        },
        constant_value: Shade.memoize_on_field("_constant_value", function() {
            return !this.parents[0].constant_value();
        })
    });
};

Shade.Exp.not = function() { return Shade.not(this); };

var comparison_operator_exp = function(operator_name, type_checker, binary_evaluator)
{
    return function(left, right) {
        var first = Shade.make(left);
        var second = Shade.make(right);
        type_checker(first.type, second.type);

        return logical_operator_binexp(
            first, second, operator_name, binary_evaluator);
    };
};

var inequality_type_checker = function(name) {
    return function(t1, t2) {
        if (!(t1.equals(Shade.Types.float_t) && 
              t2.equals(Shade.Types.float_t)) &&
            !(t1.equals(Shade.Types.int_t) && 
              t2.equals(Shade.Types.int_t)))
            throw ("operator" + name + 
                   " requires two ints or two floats, got " +
                   t1.repr() + " and " + t2.repr() +
                   " instead.");
    };
};

var equality_type_checker = function(name) {
    return function(t1, t2) {
        if (!t1.equals(t2))
            throw ("operator" + name +
                   " requires same types, got " +
                   t1.repr() + " and " + t2.repr() +
                   " instead.");
        if (t1.is_array() && !t1.is_vec())
            throw ("operator" + name +
                   " does not support arrays");
    };
};

Shade.lt = comparison_operator_exp("<", inequality_type_checker("<"),
    lift_binfun_to_evaluator(function(a, b) { return a < b; }));
Shade.Exp.lt = function(other) { return Shade.lt(this, other); };

Shade.le = comparison_operator_exp("<=", inequality_type_checker("<="),
    lift_binfun_to_evaluator(function(a, b) { return a <= b; }));
Shade.Exp.le = function(other) { return Shade.le(this, other); };

Shade.gt = comparison_operator_exp(">", inequality_type_checker(">"),
    lift_binfun_to_evaluator(function(a, b) { return a > b; }));
Shade.Exp.gt = function(other) { return Shade.gt(this, other); };

Shade.ge = comparison_operator_exp(">=", inequality_type_checker(">="),
    lift_binfun_to_evaluator(function(a, b) { return a >= b; }));
Shade.Exp.ge = function(other) { return Shade.ge(this, other); };

Shade.eq = comparison_operator_exp("==", equality_type_checker("=="),
    lift_binfun_to_evaluator(function(a, b) { 
        if (facet_typeOf(a) === 'number' ||
            facet_typeOf(a) === 'boolean')
            return a === b;
        if (facet_typeOf(a) === 'array')
            return _.all(zipWith(function(a, b) { return a === b; }, a, b),
                         function (x) { return x; });
        throw "internal error: unrecognized type " + facet_typeOf(a) + 
            " " + facet_constant_type(a);
    }));
Shade.Exp.eq = function(other) { return Shade.eq(this, other); };

Shade.ne = comparison_operator_exp("!=", equality_type_checker("!="),
    lift_binfun_to_evaluator(function(a, b) { 
        if (facet_typeOf(a) === 'number' ||
            facet_typeOf(a) === 'boolean')
            return a !== b;
        if (facet_typeOf(a) === 'array')
            return _.any(zipWith(function(a, b) { return a !== b; }, a, b),
                         function (x) { return x; });
        throw "internal error: unrecognized type " + facet_typeOf(a) + 
            " " + facet_constant_type(a);
    }));
Shade.Exp.ne = function(other) { return Shade.ne(this, other); };

// component-wise comparisons are defined on builtins.js

})();
