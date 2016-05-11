(function () {

var _structs = {};

function _registerStruct(type) {
    var t = type._structKey;
    var v = _structs[t];
    if (v !== undefined) {
        throw new Error("type " + t + " already registered as " + v.internalTypeName);
    }
    _structs[t] = type;
};

var structKey = function(obj) {
    return _.map(obj, function(value, key) {
        if (value.isFunction()) {
            throw new Error("function types not allowed inside struct");
        }
        if (value.isSampler()) {
            throw new Error("sampler types not allowed inside struct");
        }
        if (value.isStruct()) {
            return "[" + key + ":" + value.internalTypeName + "]";
        }
        return "[" + key + ":" + value.repr() + "]";
    }).sort().join("");
};

function fieldIndices(obj) {
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
    var key = structKey(fields);
    var t = _structs[key];
    if (t) return t;
    var fieldIndex = {};
    _.each(fieldIndices(fields), function(v, i) {
        fieldIndex[v[0]] = i;
    });
    var result = Shade._create(Shade.Types.structT, {
        fields: fields,
        fieldIndex: fieldIndex,
        _structKey: key
    });
    result.internalTypeName = 'type' + result.guid;
    _registerStruct(result);

    _.each(["zero", "infinity", "minusInfinity"], function(value) {
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

Shade.Types.structT = Shade._create(Shade.Types.baseT, {
    isStruct: function() { return true; },
    repr: function() { return this.internalTypeName; }
});

})();
