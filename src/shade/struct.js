// Shade.struct denotes a heterogeneous structure of Shade values:
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
    var structType = Shade.Types.struct(t), newVs = [], newKs = [];

    // javascript object order is arbitrary;
    // make sure structs follow the type field order, which is unique
    _.each(structType.fieldIndex, function(index, key) {
        var oldIndex = ks.indexOf(key);
        newVs[index] = vs[oldIndex];
        newKs[index] = key;
    });
    vs = newVs;
    ks = newKs;
    
    var result = Shade._createConcreteValueExp({
        parents: vs,
        fields: ks,
        type: structType,
        expressionType: "struct",
        value: function() {
            return [this.type.internalTypeName, "(",
                    this.parents.map(function(t) {
                        return t.glslExpression();
                    }).join(", "),
                    ")"].join(" ");
        },
        evaluate: Shade.memoizeOnGuidDict(function(cache) {
            var result = {};
            var that = this;
            _.each(this.parents, function(v, i) {
                result[that.fields[i]] = v.evaluate(cache);
            });
            return result;
        }),
        hasField: function(fieldName) {
            var index = this.type.fieldIndex[fieldName];
            return !_.isUndefined(index);
        },
        field: function(fieldName) {
            var index = this.type.fieldIndex[fieldName];
            if (_.isUndefined(index)) {
                throw new Error("field " + fieldName + " not existent");
            }

            /* Since fieldName is always an immediate string, 
             it will never need to be "computed" on a shader.            
             This means that in this case, its value can always
             be resolved in compile time and 
             val(constructor(foo=bar).foo) is always val(bar).
             */

            return this.parents[index];
        },
        callOperator: function(v) {
            return this.field(v);
        },
        element: function(i) {
            throw new Error("element() not supported for structs");
        },
        _jsonHelper: Shade.Debug._jsonBuilder("struct", function(obj) {
            obj.fields = ks;
            return obj;
        })
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

