/*
 A range expression represents a finite stream of values.

 It is meant to be an abstraction over looping.

 a range object should have the following fields:
 
 - begin, the first value of the stream, which must be of type int.
 
 - end, the first value past the end of the stream, which also must be of type int.
 
 - value, a function which takes an Shade expression of type integer
   and returns the value of the stream at that particular index.
   **This function must not have side effects!** Most importantly, it
   must not leak the reference to the passed parameter. Bad things
   will happen if it does.

 With range expressions, we can build safe equivalents of loops
*/

Shade.variable = function(type)
{
    return Shade._create_concrete_exp( {
        parents: [],
        type: type,
        evaluate: function() {
            return this.glsl_name;
        },
        compile: function() {}
    });
};

Shade.range = function(range_begin, range_end)
{
    var beg = Shade.make(range_begin).as_int(),
        end = Shade.make(range_end).as_int();
//     console.log(beg, beg.type.repr());
//     console.log(end, end.type.repr());
    return {
        begin: beg,
        end: end,
        value: function(index) {
            return index;
        },

        // this returns a shade expression which, when evaluated, returns
        // the average of the values in the range.
        average: function() {
            var index_variable = Shade.variable(Shade.Types.int_t);
            var stream_value = this.value(index_variable);
            var stream_type = stream_value.type;
            var average_type;
            var accumulator_value = Shade.variable(stream_type);
            if (stream_value.type.equals(Shade.Types.int_t)) {
                average_type = Shade.Types.float_t;
            } else if (_.any([Shade.Types.float_t,
                              Shade.Types.vec2, Shade.Types.vec3, Shade.Types.vec4, 
                              Shade.Types.mat2, Shade.Types.mat3, Shade.Types.mat4],
                             function(t) { return t.equals(stream_type); })) {
                average_type = stream_type;
            } else
                throw ("Type error, average can't support range of type " +
                       stream_type.repr());

            return Shade._create_concrete_exp({
                parents: [this.begin, this.end, 
                          index_variable, accumulator_value, stream_value],
                type: average_type,
                evaluate: function() {
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
                    var stream_value = this.parents[4];
                    ctx.strings.push(this.type.repr(), this.glsl_name, "() {\n");
                    ctx.strings.push("    ", accumulator_value.type.declare(accumulator_value.glsl_name), "=", 
                      accumulator_value.type.zero, ";\n");
                    ctx.strings.push("    for (int",
                      index_variable.evaluate(),"=",beg.evaluate(),";",
                      index_variable.evaluate(),"<",end.evaluate(),";",
                      "++",index_variable.evaluate(),") {\n");
                    ctx.strings.push("        ",
                      accumulator_value.evaluate(),"=",
                      accumulator_value.evaluate(),"+",
                      stream_value.evaluate(),";\n");
                    ctx.strings.push("    }\n");
                    ctx.strings.push("    return", 
                                     this.type.repr(), "(", accumulator_value.evaluate(), ")/float(",
                      end.evaluate(), "-", beg.evaluate(), ");\n");
                    ctx.strings.push("}\n");
                }
            });
        }
    };
};
