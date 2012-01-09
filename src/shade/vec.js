Shade.vec = function()
{
    var parents = [];
    var parent_offsets = [];
    var total_size = 0;
    var vec_type;
    for (var i=0; i<arguments.length; ++i) {
        var arg = Shade.make(arguments[i]);
        parents.push(arg);
        parent_offsets.push(total_size);
        if (typeOf(vec_type) === 'undefined')
            vec_type = arg.type.element_type(0);
        else if (!vec_type.equals(arg.type.element_type(0)))
            throw "vec requires equal types";
        total_size += arg.type.size_for_vec_constructor();
    }
    parent_offsets.push(total_size);
    if (total_size < 1 || total_size > 4) {
        throw "vec constructor requires resulting width to be between "
            + "1 and 4, got " + total_size + " instead";
    }
    var type;
    if (vec_type.equals(Shade.Types.float_t)) {
        type = Shade.basic("vec" + total_size);
    } else if (vec_type.equals(Shade.Types.int_t)) {
        type = Shade.basic("ivec" + total_size);
    } else if (vec_type.equals(Shade.Types.bool_t)) {
        type = Shade.basic("bvec" + total_size);
    } else {
        throw "vec type must be bool, int, or float";
    }
    
    return Shade._create_concrete_value_exp({
        parents: parents,
        parent_offsets: parent_offsets,
        type: type,
        expression_type: 'vec',
        size: total_size,
        element: function(i) {
            var old_i = i;
            for (var j=0; j<this.parents.length; ++j) {
                var sz = this.parent_offsets[j+1] - this.parent_offsets[j];
                if (i < sz)
                    return this.parents[j].element(i);
                i = i - sz;
            }
            throw "element " + old_i + " out of bounds (size=" 
                + total_size + ")";
        },
        element_is_constant: function(i) {
            var old_i = i;
            for (var j=0; j<this.parents.length; ++j) {
                var sz = this.parent_offsets[j+1] - this.parent_offsets[j];
                if (i < sz)
                    return this.parents[j].element_is_constant(i);
                i = i - sz;
            }
            throw "element " + old_i + " out of bounds (size=" 
                + total_size + ")";
        },
        element_constant_value: function(i) {
            var old_i = i;
            for (var j=0; j<this.parents.length; ++j) {
                var sz = this.parent_offsets[j+1] - this.parent_offsets[j];
                if (i < sz)
                    return this.parents[j].element_constant_value(i);
                i = i - sz;
            }
            throw "element " + old_i + " out of bounds (size=" 
                + total_size + ")";
        },
        constant_value: Shade.memoize_on_field("_constant_value", function () {
            var result = [];
            var parent_values = _.each(this.parents, function(v) {
                var c = v.constant_value();
                if (typeOf(c) === 'number')
                    result.push(c);
                else
                    for (var i=0; i<c.length; ++i)
                        result.push(c[i]);
            });
            return vec[result.length].make(result);
        }),
        value: function() {
            return this.type.repr() + "(" +
                this.parents.map(function (t) {
                    return t.eval();
                }).join(", ") + ")";
        }
    });
};
