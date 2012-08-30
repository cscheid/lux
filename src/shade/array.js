
// Shade.array denotes an array of Facet values of the same type:
//    Shade.array([2, 3, 4, 5, 6]);

Shade.array = function(v)
{
    var t = facet_typeOf(v);
    if (t === 'array') {
        var new_v = v.map(Shade.make);
        var array_size = new_v.length;
        if (array_size === 0) {
            throw "array constant must be non-empty";
        }

        var new_types = new_v.map(function(t) { return t.type; });
        var array_type = Shade.Types.array(new_types[0], array_size);
        if (_.any(new_types, function(t) { return !t.equals(new_types[0]); })) {
            throw "array elements must have identical types";
        }
        return Shade._create_concrete_exp( {
            parents: new_v,
            type: array_type,
            array_element_type: new_types[0],
            expression_type: "constant", // FIXME: is there a reason this is not "array"?

            evaluate: Shade.memoize_on_guid_dict(function(cache) {
                return _.map(this.parents, function(e) {
                    return e.evaluate(cache);
                });
            }),
            
            glsl_expression: function() { return this.glsl_name; },
            compile: function (ctx) {
                this.array_initializer_glsl_name = ctx.request_fresh_glsl_name();
                ctx.strings.push(this.type.declare(this.glsl_name), ";\n");
                ctx.strings.push("void", this.array_initializer_glsl_name, "(void) {\n");
                for (var i=0; i<this.parents.length; ++i) {
                    ctx.strings.push("    ", this.glsl_name, "[", i, "] =",
                                     this.parents[i].glsl_expression(), ";\n");
                }
                ctx.strings.push("}\n");
                ctx.add_initialization(this.array_initializer_glsl_name + "()");
            },
            is_constant: function() { return false; }, 
            element: function(i) {
                return this.parents[i];
            },
            element_is_constant: function(i) {
                return this.parents[i].is_constant();
            },
            element_constant_value: function(i) {
                return this.parents[i].constant_value();
            },
            locate: function(target, xform) {
                var that = this;
                xform = xform || function(x) { return x; };
                return Shade.locate(function(i) { return xform(that.at(i.as_int())); }, target, 0, array_size-1);
            }
        });
    } else {
        throw "type error: need array";
    }
};
