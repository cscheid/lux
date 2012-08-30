Shade.memoize_on_guid_dict = function(if_not_found) {
    function evaluate(cache) {
        if (_.isUndefined(cache))
            cache = {};
        var t = cache[this.guid];
        if (_.isUndefined(t)) {
            t = if_not_found.call(this, cache);
            cache[this.guid] = t;
        }
        return t;
    };
    return evaluate;
};
