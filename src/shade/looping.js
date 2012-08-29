/*
 A range expression represents a finite stream of values. 

 It is meant
 to be an abstraction over looping, and provides a few ways to combine values.

 Currently the only operations supported are plain stream
 transformations (like "map") and fold (like "reduce").

 It should be possible to add, at the very least, "filter", "scan", and "firstWhich".

 nb: nested loops will require deep changes to the infrastructure, and
 won't be supported for a while.

 In general, looping in general is pretty unstable.
*/

(function() {

Shade.loop_variable = function(type, force_no_declare)
{
    return Shade._create_concrete_exp({
        parents: [],
        type: type,
        expression_type: "loop_variable",
        glsl_expression: function() {
            return this.glsl_name;
        },
        compile: function(ctx) {
            if (_.isUndefined(force_no_declare))
                ctx.global_scope.add_declaration(type.declare(this.glsl_name));
        },
        loop_variable_dependencies: Shade.memoize_on_field("_loop_variable_dependencies", function () {
            return [this];
        }),
        evaluate: function() {
            throw "evaluate undefined for loop_variable";
        }
    });
};

function BasicRange(range_begin, range_end, value, condition, termination)
{
    this.begin = Shade.make(range_begin).as_int();
    this.end = Shade.make(range_end).as_int();
    this.value = value || function(index) { return index; };
    this.condition = condition || function() { return Shade.make(true); };
    this.termination = termination || function() { return Shade.make(false); };
};

Shade.range = function(range_begin, range_end, value, condition, termination)
{
    return new BasicRange(range_begin, range_end, value, condition, termination);
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

BasicRange.prototype.filter = function(new_condition)
{
    var that = this;
    return Shade.range(
        this.begin,
        this.end,
        this.value,
        function (value, i) {
            var old_condition = that.condition(value, i);
            var result = Shade.and(old_condition, new_condition(value, i));
            return result;
        },
        this.termination
    );
};

BasicRange.prototype.break_if = function(new_termination)
{
    var that = this;
    return Shade.range(
        this.begin,
        this.end,
        this.value,
        this.condition,
        function (value, i) {
            var old_termination = that.termination(value, i);
            var result = Shade.or(old_termination, new_termination(value, i));
            return result;
        }
    );
};

BasicRange.prototype.fold = Shade(function(operation, starting_value)
{
    var index_variable = Shade.loop_variable(Shade.Types.int_t, true);
    var accumulator_value = Shade.loop_variable(starting_value.type, true);
    var element_value = this.value(index_variable);
    var condition_value = this.condition(element_value, index_variable);
    var termination_value = this.termination(element_value, index_variable);
    var result_type = accumulator_value.type;
    var operation_value = operation(accumulator_value, element_value);
    // FIXME: instead of refusing to compile, we should transform
    // violating expressions to a transformed index variable loop 
    // with a termination condition
    if (!this.begin.is_constant())
        throw "WebGL restricts loop index variable initialization to be constant";
    if (!this.end.is_constant())
        throw "WebGL restricts loop index termination check to be constant";

    var result = Shade._create_concrete_exp({
        has_scope: true,
        patch_scope: function() {
            var index_variable = this.parents[2];
            var accumulator_value = this.parents[3];
            var element_value = this.parents[4];
            var operation_value = this.parents[6];
            var condition_value = this.parents[7];
            var termination_value = this.parents[8];
            var that = this;

            function patch_internal(exp) {
                _.each(exp.sorted_sub_expressions(), function(node) {
                    if (_.any(node.loop_variable_dependencies(), function(dep) {
                        return dep.glsl_name === index_variable.glsl_name ||
                            dep.glsl_name === accumulator_value.glsl_name;
                    })) {
                        node.scope = that.scope;
                    };
                });
            }

            _.each([element_value, operation_value, condition_value, termination_value], patch_internal);
        },
        parents: [this.begin, this.end, 
                  index_variable, accumulator_value, element_value,
                  starting_value, operation_value,
                  condition_value, termination_value
                 ],
        type: result_type,
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw this.type.repr() + " is an atomic type";
            } else
                return this.at(i);
        }),
        loop_variable_dependencies: Shade.memoize_on_field("_loop_variable_dependencies", function () {
            return [];
        }),
        compile: function(ctx) {
            var beg = this.parents[0];
            var end = this.parents[1];
            var index_variable = this.parents[2];
            var accumulator_value = this.parents[3];
            var element_value = this.parents[4];
            var starting_value = this.parents[5];
            var operation_value = this.parents[6];
            var condition = this.parents[7];
            var termination = this.parents[8];
            var must_evaluate_condition = !(condition.is_constant() && (condition.constant_value() === true));
            var must_evaluate_termination = !(termination.is_constant() && (termination.constant_value() === false));

            ctx.global_scope.add_declaration(accumulator_value.type.declare(accumulator_value.glsl_name));
            ctx.strings.push(this.type.repr(), this.glsl_name, "() {\n");
            ctx.strings.push("    ",accumulator_value.glsl_name, "=", starting_value.glsl_expression(), ";\n");

            ctx.strings.push("    for (int",
                             index_variable.glsl_expression(),"=",beg.glsl_expression(),";",
                             index_variable.glsl_expression(),"<",end.glsl_expression(),";",
                             "++",index_variable.glsl_expression(),") {\n");

            _.each(this.scope.declarations, function(exp) {
                ctx.strings.push("        ", exp, ";\n");
            });
            if (must_evaluate_condition) {
                ctx.strings.push("      if (", condition.glsl_expression(), ") {\n");
            }
            _.each(this.scope.initializations, function(exp) {
                ctx.strings.push("        ", exp, ";\n");
            });
            ctx.strings.push("        ",
                             accumulator_value.glsl_expression(),"=",
                             operation_value.glsl_expression() + ";\n");
            if (must_evaluate_termination) {
                ctx.strings.push("        if (", termination.glsl_expression(), ") break;\n");
            }
            if (must_evaluate_condition) {
                ctx.strings.push("      }\n");
            }
            ctx.strings.push("    }\n");
            ctx.strings.push("    return", accumulator_value.glsl_expression(), ";\n");
            ctx.strings.push("}\n");

            if (this.children_count > 1) {
                this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                ctx.global_scope.add_declaration(this.type.declare(this.precomputed_value_glsl_name));
                ctx.global_scope.add_initialization(this.precomputed_value_glsl_name + " = " + this.glsl_name + "()");
            }
        },
        glsl_expression: function() {
            if (this.children_count > 1) {
                return this.precomputed_value_glsl_name;
            } else {
                return this.glsl_name + "()";
            }
        },
        evaluate: function() {
            throw "evaluate currently undefined for looping expressions";
        }
    });

    return result;
});

//////////////////////////////////////////////////////////////////////////////

BasicRange.prototype.sum = function()
{
    var this_begin_v = this.value(this.begin);

    return this.fold(Shade.add, this_begin_v.type.zero);
};

BasicRange.prototype.max = function()
{
    var this_begin_v = this.value(this.begin);
    return this.fold(Shade.max, this_begin_v.type.minus_infinity);
};

BasicRange.prototype.average = function()
{
    // special-case average when we know the total number of samples in advance
    // 
    // this is ugly, but how could I make it better?
    var s = this.sum();
    if ((s.parents[7].is_constant() &&
         s.parents[7].constant_value() === true) &&
        (s.parents[8].is_constant() &&
         s.parents[8].constant_value() === false)) {
        if (s.type.equals(Shade.Types.int_t)) s = s.as_float();
        return s.div(this.end.sub(this.begin).as_float());
    } else {
        var xf = this.transform(function(v) {
            return Shade({
                s1: 1,
                sx: v
            });
        });
        var sum_result = xf.sum();
        var sx = sum_result("sx");
        if (sx.type.equals(Shade.Types.int_t)) {
            sx = sx.as_float();
        }
        return sx.div(sum_result("s1"));
    }
};

Shade.locate = Shade(function(accessor, target, left, right, nsteps)
{
    function halfway(a, b) { return a.as_float().add(b.as_float()).div(2).as_int(); };

    nsteps = nsteps || right.sub(left).log2().ceil();
    var base = Shade.range(0, nsteps);
    var mid = halfway(left, right);
    var initial_state = Shade({
        l: left.as_int(),
        r: right.as_int(),
        m: mid.as_int(),
        vl: accessor(left),
        vr: accessor(right),
        vm: accessor(mid)
    });
    return base.fold(function(state, i) {
        var right_nm = halfway(state("m"), state("r"));
        var left_nm = halfway(state("l"), state("m"));
        return state("vm").lt(target).ifelse(Shade({
            l: state("m"), vl: state("vm"),
            m: right_nm,   vm: accessor(right_nm),
            r: state("r"), vr: state("vr")
        }), Shade({
            l: state("l"), vl: state("vl"),
            m: left_nm,    vm: accessor(left_nm),
            r: state("m"), vr: state("vm")
        }));
    }, initial_state);
});

})();
