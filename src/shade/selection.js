Shade.selection = function(condition, if_true, if_false)
{
    condition = Shade.make(condition);
    if_true = Shade.make(if_true);
    if_false = Shade.make(if_false);

    if (!if_true.type.equals(if_false.type))
        throw "selection return expressions must have same types";
    if (!condition.type.equals(condition.type))
        throw "selection condition must be of type bool";

    return Shade._create_concrete_value_exp( {
        parents: [condition, if_true, if_false],
        type: if_true.type,
        expression_type: "selection",
        // FIXME: works around Chrome Bug ID 103053
        _must_be_function_call: true,
        value: function() {
            return "(" + this.parents[0].evaluate() + "?"
                + this.parents[1].evaluate() + ":"
                + this.parents[2].evaluate() + ")";
        },
        constant_value: function() {
            return (this.parents[0].constant_value() ?
                    this.parents[1].constant_value() :
                    this.parents[2].constant_value());
        }, 
        parent_is_unconditional: function(i) {
            return i === 0;
        }
    });
};

Shade.Exp.selection = function(if_true, if_false)
{
    return Shade.selection(this, if_true, if_false);
};
