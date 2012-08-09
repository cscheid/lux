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
            throw "function types not allowed inside struct";
        }
        if (value.is_struct()) {
            return "[" + key + ":" + value.internal_type_name + "]";
        }
        return "[" + key + ":" + value.repr() + "]";
    }).sort().join("");
};

Shade.Types.struct = function(fields) {
    var key = struct_key(fields);
    var t = _structs[key];
    if (t) return t;

    var result = Shade._create(Shade.Types.struct_t, {
        fields: fields,
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
