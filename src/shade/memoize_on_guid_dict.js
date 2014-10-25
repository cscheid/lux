Shade.memoizeOnGuidDict = function(ifNotFound) {
    function evaluate(cache) {
        if (_.isUndefined(cache))
            cache = {};
        var t = cache[this.guid];
        if (_.isUndefined(t)) {
            t = ifNotFound.call(this, cache);
            cache[this.guid] = t;
        }
        return t;
    };
    return evaluate;
};
