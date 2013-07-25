(function() {

var logical_operator_binexp = function(exp1, exp2, operator_name, evaluator,
                                       parent_is_unconditional, shade_name)
{
    parent_is_unconditional = parent_is_unconditional ||
        function (i) { return true; };
    return Shade._create_concrete_value_exp({
        parents: [exp1, exp2],
        type: Shade.Types.bool_t,
        expression_type: "operator" + operator_name,
        value: function() {
            return "(" + this.parents[0].glsl_expression() + " " + operator_name + " " +
                this.parents[1].glsl_expression() + ")";
        },
        evaluate: Shade.memoize_on_guid_dict(function(cache) {
            return evaluator(this, cache);
        }),
        parent_is_unconditional: parent_is_unconditional,
        _json_key: function() { return shade_name; }
    });
};

var lift_binfun_to_evaluator = function(binfun) {
    return function(exp, cache) {
        var exp1 = exp.parents[0], exp2 = exp.parents[1];
        return binfun(exp1.evaluate(cache), exp2.evaluate(cache));
    };
};

var logical_operator_exp = function(operator_name, binary_evaluator,
                                    parent_is_unconditional, shade_name)
{
    return function() {
        if (arguments.length === 0) 
            throw new Error("operator " + operator_name 
                   + " requires at least 1 parameter");
        if (arguments.length === 1) return Shade(arguments[0]).as_bool();
        var first = Shade(arguments[0]);
        if (!first.type.equals(Shade.Types.bool_t))
            throw new Error("operator " + operator_name + 
                   " requires booleans, got argument 1 as " +
                   arguments[0].type.repr() + " instead.");
        var current_result = first;
        for (var i=1; i<arguments.length; ++i) {
            var next = Shade(arguments[i]);
            if (!next.type.equals(Shade.Types.bool_t))
                throw new Error("operator " + operator_name + 
                       " requires booleans, got argument " + (i+1) +
                       " as " + next.type.repr() + " instead.");
            current_result = logical_operator_binexp(
                current_result, next,
                operator_name, binary_evaluator,
                parent_is_unconditional, shade_name);
        }
        return current_result;
    };
};

Shade.or = logical_operator_exp(
    "||", lift_binfun_to_evaluator(function(a, b) { return a || b; }),
    function(i) { return i === 0; }, "or"
);

Shade.Exp.or = function(other)
{
    return Shade.or(this, other);
};

Shade.and = logical_operator_exp(
    "&&", lift_binfun_to_evaluator(function(a, b) { return a && b; }),
    function(i) { return i === 0; }, "and"
);

Shade.Exp.and = function(other)
{
    return Shade.and(this, other);
};

Shade.xor = logical_operator_exp(
    "^^", lift_binfun_to_evaluator(function(a, b) { return ~~(a ^ b); }), undefined, "xor");
Shade.Exp.xor = function(other)
{
    return Shade.xor(this, other);
};

Shade.not = Shade(function(exp)
{
    if (!exp.type.equals(Shade.Types.bool_t)) {
        throw new Error("logical_not requires bool expression");
    }
    return Shade._create_concrete_value_exp({
        parents: [exp],
        type: Shade.Types.bool_t,
        expression_type: "operator!",
        value: function() {
            return "(!" + this.parents[0].glsl_expression() + ")";
        },
        evaluate: Shade.memoize_on_guid_dict(function(cache) {
            return !this.parents[0].evaluate(cache);
        }),
        _json_key: function() { return "not"; }
    });
});

Shade.Exp.not = function() { return Shade.not(this); };

var comparison_operator_exp = function(operator_name, type_checker, binary_evaluator, shade_name)
{
    console.log(operator_name, shade_name);
    return Shade(function(first, second) {
        type_checker(first.type, second.type);

        return logical_operator_binexp(
            first, second, operator_name, binary_evaluator, undefined, shade_name);
    });
};

var inequality_type_checker = function(name) {
    return function(t1, t2) {
        if (!(t1.equals(Shade.Types.float_t) && 
              t2.equals(Shade.Types.float_t)) &&
            !(t1.equals(Shade.Types.int_t) && 
              t2.equals(Shade.Types.int_t)))
            throw new Error("operator" + name + 
                   " requires two ints or two floats, got " +
                   t1.repr() + " and " + t2.repr() +
                   " instead.");
    };
};

var equality_type_checker = function(name) {
    return function(t1, t2) {
        if (!t1.equals(t2))
            throw new Error("operator" + name +
                   " requires same types, got " +
                   t1.repr() + " and " + t2.repr() +
                   " instead.");
        if (t1.is_array() && !t1.is_vec() && !t1.is_mat())
            throw new Error("operator" + name +
                   " does not support arrays");
    };
};

Shade.lt = comparison_operator_exp("<", inequality_type_checker("<"),
    lift_binfun_to_evaluator(function(a, b) { return a < b; }), "lt");
Shade.Exp.lt = function(other) { return Shade.lt(this, other); };

Shade.le = comparison_operator_exp("<=", inequality_type_checker("<="),
    lift_binfun_to_evaluator(function(a, b) { return a <= b; }), "le");
Shade.Exp.le = function(other) { return Shade.le(this, other); };

Shade.gt = comparison_operator_exp(">", inequality_type_checker(">"),
    lift_binfun_to_evaluator(function(a, b) { return a > b; }), "gt");
Shade.Exp.gt = function(other) { return Shade.gt(this, other); };

Shade.ge = comparison_operator_exp(">=", inequality_type_checker(">="),
    lift_binfun_to_evaluator(function(a, b) { return a >= b; }), "ge");
Shade.Exp.ge = function(other) { return Shade.ge(this, other); };

Shade.eq = comparison_operator_exp("==", equality_type_checker("=="),
    lift_binfun_to_evaluator(function(a, b) {
        if (lux_typeOf(a) === 'array') {
            return _.all(_.map(_.zip(a, b),
                               function(v) { return v[0] === v[1]; }),
                         function (x) { return x; });
        }
        return Shade.Types.type_of(a).value_equals(a, b);
    }), "eq");
Shade.Exp.eq = function(other) { return Shade.eq(this, other); };

Shade.ne = comparison_operator_exp("!=", equality_type_checker("!="),
    lift_binfun_to_evaluator(function(a, b) { 
        if (lux_typeOf(a) === 'array') {
            return _.any(_.map(_.zip(a, b),
                               function(v) { return v[0] !== v[1]; } ),
                         function (x) { return x; });
        }
        return !Shade.Types.type_of(a).value_equals(a, b);
    }), "ne");
Shade.Exp.ne = function(other) { return Shade.ne(this, other); };

// component-wise comparisons are defined on builtins.js

})();
