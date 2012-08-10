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
    var struct_type = Shade.Types.struct(t), new_vs = [], new_ks = [];

    // javascript object order is arbitrary;
    // make sure structs follow the type field order, which is unique
    _.each(struct_type.field_index, function(index, key) {
        var old_index = ks.indexOf(key);
        new_vs[index] = vs[old_index];
        new_ks[index] = key;
    });
    vs = new_vs;
    ks = new_ks;
    
    var result = Shade._create_concrete_value_exp({
        parents: vs,
        fields: ks,
        type: struct_type,
        expression_type: "struct",
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
        }),
        field: function(field_name) {
            var index = this.type.field_index[field_name];
            if (_.isUndefined(index)) {
                throw "field " + field_name + " not existent";
            }

            /* Since field_name is always an immediate string, 
             it will never need to be "computed" on a shader.            
             This means that in this case, its value can always
             be resolved in compile time and 
             val(constructor(foo=bar).foo) is always val(bar).
             */

            return this.parents[index];
        },
        call_operator: function(v) {
            return this.field(v);
        }
    });

    // _.each(ks, function(k) {
    //     // I can't use _.has because result is actually a javascript function..
    //     if (!_.isUndefined(result[k])) {
    //         console.log("Warning: Field",k,"is reserved. JS struct notation (a.b) will not be usable");
    //     } else
    //         result[k] = result.field(k);
    // });
    return result;
};

