// Shade.struct denotes a heterogeneous structure of Facet values:
//   Shade.struct({foo: Shade.vec(1,2,3), bar: Shade.struct({baz: 1, bah: false})});

Shade.struct = function(obj)
{
    var vs = _.map(obj, function(v) { return Shade.make(v); });
    var ks = _.keys(obj);
    var types = _.map(vs, function(v) { return v.type; });
    var t = {};
    _.each(ks, function(k, i) {
        t[k] = types[i];
    });
    var struct_type = Shade.Types.struct(t);
    
    var result = Shade._create_concrete_exp({
        parents: vs,
        fields: ks,
        type: struct_type,
        expression_type: "struct",
        evaluate: function() { return this.glsl_name; },
        compile: function (ctx) {},
        value: function() {
            return [this.type.internal_type_name, "(",
                    this.parents.map(function(t) {
                        return t.evaluate();
                    }).join(", "),
                    ")"].join(" ");
        },
        constant_value: Shade.memoize_on_field("_constant_value", function() {
            var result = {};
            var that = this;
            _.each(this.parents, function(v, i) {
                result[that.fields[i]] = v.constant_value();
            });
            return result;
        })
    });
    return result;
};

