(function () {

var _structs = {};

function _register_struct(type) {
    var t = type._struct_key;
    var v = _structs[t];
    if (v !== undefined) {
        throw "type " + t + " already registered as " + v.internal_type_name;
    }
    _structs[t] = type;
};

var struct_key = function(obj) {
    return _.map(obj, function(value, key) {
        if (value.is_function()) {
            throw "function types not allowed inside struct";
        }
        if (value.is_sampler()) {
            throw "sampler types not allowed inside struct";
        }
        if (value.is_struct()) {
            return "[" + key + ":" + value.internal_type_name + "]";
        }
        return "[" + key + ":" + value.repr() + "]";
    }).sort().join("");
};

function field_indices(obj) {
    var lst = _.map(obj, function(value, key) {
        return [key, value.repr()];
    });
    return lst.sort(function(v1, v2) {
        if (v1[0] < v2[0]) return -1;
        if (v1[0] > v2[0]) return 1;
        if (v1[1] < v2[1]) return -1;
        if (v1[1] > v2[1]) return 1;
        return 0;
    });
};

Shade.Types.struct = function(fields) {
    var key = struct_key(fields);
    var t = _structs[key];
    if (t) return t;
    var field_index = {};
    _.each(field_indices(fields), function(v, i) {
        field_index[v[0]] = i;
    });
    var result = Shade._create(Shade.Types.struct_t, {
        fields: fields,
        field_index: field_index,
        _struct_key: key
    });
    result.internal_type_name = 'type_' + result.guid;
    _register_struct(result);

    _.each(["zero", "infinity", "minus_infinity"], function(value) {
        if (_.all(fields, function(v, k) { return !_.isUndefined(v[value]); })) {
            var c = {};
            _.each(fields, function(v, k) {
                c[k] = v[value];
            });
            result[value] = Shade.struct(c);
        }
    });

    return result;
};

Shade.Types.struct_t = Shade._create(Shade.Types.base_t, {
    is_struct: function() { return true; },
    repr: function() { return this.internal_type_name; }
});

})();
