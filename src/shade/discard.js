Shade.discard_if = function(exp, condition)
{
    exp = Shade.make(exp);
    condition = Shade.make(condition);

    var result = Shade._create_concrete_exp({
        is_constant: Shade.memoize_on_field("_is_constant", function() {
            var cond = _.all(this.parents, function(v) {
                return v.is_constant();
            });
            return (cond && !this.parents[0].constant_value());
        }),
        _must_be_function_call: true,
        type: exp.type,
        expression_type: "discard_if",
        parents: [condition, exp],
        parent_is_unconditional: function(i) {
            return i === 0;
        },
        compile: function(ctx) {
            ctx.strings.push(exp.type.repr(), this.glsl_name, "(void) {\n",
                             "    if (",this.parents[0].eval(),") discard;\n",
                             "    return ", this.parents[1].eval(), ";\n}\n");
        },
        constant_value: function() {
            return exp.constant_value();
        }
    });
    return result;
};
