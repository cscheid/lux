Shade.ifelse = function(condition, if_true, if_false)
{
    condition = Shade.make(condition);
    if_true = Shade.make(if_true);
    if_false = Shade.make(if_false);

    if (!if_true.type.equals(if_false.type))
        throw "ifelse return expressions must have same types";
    if (!condition.type.equals(condition.type))
        throw "ifelse condition must be of type bool";

    return Shade._create_concrete_value_exp( {
        parents: [condition, if_true, if_false],
        type: if_true.type,
        expression_type: "ifelse",
        // FIXME: works around Chrome Bug ID 103053
        _must_be_function_call: true,
        value: function() {
            return "(" + this.parents[0].evaluate() + "?"
                + this.parents[1].evaluate() + ":"
                + this.parents[2].evaluate() + ")";
        },
        constant_value: function() {
            if (!this.parents[0].is_constant()) {
                // This only gets called when this.is_constant() holds, so
                // it must be that this.parents[1].constant_value() == 
                // this.parents[2].constant_value(); we return either
                return this.parents[1].constant_value();
            } else {
                return (this.parents[0].constant_value() ?
                        this.parents[1].constant_value() :
                        this.parents[2].constant_value());
            }
        },
        is_constant: function() {
            if (!this.parents[0].is_constant()) {
                // if condition is not constant, 
                // then expression is only constant if sides always
                // evaluate to same values.
                if (this.parents[1].is_constant() && 
                    this.parents[2].is_constant()) {
                    var v1 = this.parents[1].constant_value();
                    var v2 = this.parents[2].constant_value();
                    return this.type.constant_equal(v1, v2);
                } else {
                    return false;
                }
            } else {
                // if condition is constant, then
                // the expression is constant if the appropriate
                // side of the evaluation is constant.
                return (this.parents[0].constant_value() ?
                        this.parents[1].is_constant() :
                        this.parents[2].is_constant());
            }
        },
        element: function(i) {
            return Shade.ifelse(this.parents[0],
                                   this.parents[1].element(i),
                                   this.parents[2].element(i));
        },
        element_constant_value: function(i) {
            if (!this.parents[0].is_constant()) {
                // This only gets called when this.is_constant() holds, so
                // it must be that this.parents[1].constant_value() == 
                // this.parents[2].constant_value(); we return either
                return this.parents[1].element_constant_value(i);
            } else {
                return (this.parents[0].constant_value() ?
                        this.parents[1].element_constant_value(i) :
                        this.parents[2].element_constant_value(i));
            }
        },
        element_is_constant: function(i) {
            if (!this.parents[0].is_constant()) {
                // if condition is not constant, 
                // then expression is only constant if sides always
                // evaluate to same values.
                if (this.parents[1].element_is_constant(i) && 
                    this.parents[2].element_is_constant(i)) {
                    var v1 = this.parents[1].element_constant_value(i);
                    var v2 = this.parents[2].element_constant_value(i);
                    return this.type.element_type(i).constant_equal(v1, v2);
                } else {
                    return false;
                }
            } else {
                // if condition is constant, then
                // the expression is constant if the appropriate
                // side of the evaluation is constant.
                return (this.parents[0].constant_value() ?
                        this.parents[1].element_is_constant(i) :
                        this.parents[2].element_is_constant(i));
            }
        },
        parent_is_unconditional: function(i) {
            return i === 0;
        }
    });
};

Shade.Exp.ifelse = function(if_true, if_false)
{
    return Shade.ifelse(this, if_true, if_false);
};
