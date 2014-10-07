// Some underscore.js extensions

// build objects from key-value pair lists
_.mixin({
    build: function(iterable) {
        var result = {};
        _.each(iterable, function(v) {
            result[v[0]] = v[1];
        });
        return result;
    }
});
