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
        compile: function (ctx) {
            this.
        },
    });
};

