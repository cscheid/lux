/*
 A range expression represents a finite stream of values. It is meant
 to be an abstraction over looping, and provides a few ways to combine values,
 such as a 

 NB: NESTED LOOPS WILL REQUIRE DEEP CHANGES TO THE INFRASTRUCTURE, AND
 WON'T BE SUPPORTED FOR A WHILE.

*/

(function() {

Shade.variable = function(type)
{
    return Shade._create_concrete_exp( {
        parents: [],
        type: type,
        eval: function() {
            return this.glsl_name;
        },
        compile: function() {}
    });
};

function BasicRange(range_begin, range_end, value)
{
    this.begin = Shade.make(range_begin).as_int();
    this.end = Shade.make(range_end).as_int();
    this.value = value || function(index) { return index; };
};

Shade.range = function(range_begin, range_end, value)
{
    return new BasicRange(range_begin, range_end, value);
};

BasicRange.prototype.transform = function(xform)
{
    var that = this;
    return Shade.range(
        this.begin,
        this.end, 
        function (i) {
            var input = that.value(i);
            var result = xform(input);
            return result;
        });
};

BasicRange.prototype.average = function()
{
    return this.sum().div(this.end.sub(this.begin).as_float());
};

BasicRange.prototype.fold = function(operation, starting_value)
{
    operation = Shade.make(operation);
    starting_value = Shade.make(starting_value);
    var index_variable = Shade.variable(Shade.Types.int_t);
    var element_value = this.value(index_variable);
    var accumulator_value = Shade.variable(starting_value.type);
    var result_type = accumulator_value.type;
    var operation_value = operation(accumulator_value, element_value);

    return Shade._create_concrete_exp({
        parents: [this.begin, this.end, 
                  index_variable, accumulator_value, element_value,
                  starting_value, operation_value],
        type: result_type,
        eval: function() {
            return this.glsl_name + "()";
        },
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw this.type.repr() + " is an atomic type";
            } else
                return this.at(i);
        }),
        compile: function(ctx) {
            var beg = this.parents[0];
            var end = this.parents[1];
            var index_variable = this.parents[2];
            var accumulator_value = this.parents[3];
            var element_value = this.parents[4];
            var starting_value = this.parents[5];
            var operation_value = this.parents[6];
            ctx.strings.push(this.type.repr(), this.glsl_name, "() {\n");
            ctx.strings.push("    ", accumulator_value.type.declare(accumulator_value.glsl_name), "=", 
                             starting_value.eval(), ";\n");
            ctx.strings.push("    for (int",
                             index_variable.eval(),"=",beg.eval(),";",
                             index_variable.eval(),"<",end.eval(),";",
                             "++",index_variable.eval(),") {\n");
            ctx.strings.push("        ",
                             accumulator_value.eval(),"=",
                             operation_value.eval() + ";\n");
            ctx.strings.push("    }\n");
            ctx.strings.push("    return", 
                             this.type.repr(), "(", accumulator_value.eval(), ");\n");
            ctx.strings.push("}\n");
        }
    });
};

BasicRange.prototype.sum = function()
{
    var index_variable = Shade.variable(Shade.Types.int_t);
    var element_value = this.value(index_variable);
    var stream_type = element_value.type;
    var sum_type;
    var accumulator_value = Shade.variable(stream_type);
    if (element_value.type.equals(Shade.Types.int_t)) {
        sum_type = Shade.Types.float_t;
    } else if (_.any([Shade.Types.float_t,
                      Shade.Types.vec2, Shade.Types.vec3, Shade.Types.vec4, 
                      Shade.Types.mat2, Shade.Types.mat3, Shade.Types.mat4],
                     function(t) { return t.equals(stream_type); })) {
        sum_type = stream_type;
    } else
        throw ("Type error, sum can't support range of type " +
               stream_type.repr());

    return Shade._create_concrete_exp({
        parents: [this.begin, this.end, 
                  index_variable, accumulator_value, element_value],
        type: sum_type,
        eval: function() {
            return this.glsl_name + "()";
        },
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw this.type.repr() + " is an atomic type";
            } else
                return this.at(i);
        }),
        compile: function(ctx) {
            var beg = this.parents[0];
            var end = this.parents[1];
            var index_variable = this.parents[2];
            var accumulator_value = this.parents[3];
            var element_value = this.parents[4];
            ctx.strings.push(this.type.repr(), this.glsl_name, "() {\n");
            ctx.strings.push("    ", accumulator_value.type.declare(accumulator_value.glsl_name), "=", 
                             accumulator_value.type.zero, ";\n");
            ctx.strings.push("    for (int",
                             index_variable.eval(),"=",beg.eval(),";",
                             index_variable.eval(),"<",end.eval(),";",
                             "++",index_variable.eval(),") {\n");
            ctx.strings.push("        ",
                             accumulator_value.eval(),"=",
                             accumulator_value.eval(),"+",
                             element_value.eval(),";\n");
            ctx.strings.push("    }\n");
            ctx.strings.push("    return", 
                             this.type.repr(), "(", accumulator_value.eval(), ");\n");
            ctx.strings.push("}\n");
        }
    });
};

})();
