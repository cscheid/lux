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
            var index = this.fields.indexOf(field_name);
            if (index === -1) {
                throw "field " + field_name + " not existent";
            };
            return Shade._create_concrete_value_exp({
                parents: [this],
                type: this.parents[index].type,
                expression_type: "struct-accessor",
                value: function() {
                    return "(" + this.parents[0].evaluate() + "." + field_name + ")";
                },
                constant_value: Shade.memoize_on_field("_constant_value", function() {
                    return this.parents[0].parents[index].constant_value();
                }),
                is_constant: Shade.memoize_on_field("_is_constant", function() {
                    return this.parents[0].parents[index].is_constant();
                })
            });
        },
        call_operator: function(v) {
            return this.field(v);
        }
    });

    _.each(ks, function(k) {
        // I can't use _.has because result is actually a javascript function..
        if (!_.isUndefined(result[k])) {
            console.log("Warning: Field",k,"is reserved. JS struct notation (a.b) will not be usable");
        } else
            result[k] = result.field(k);
    });
    return result;
};

