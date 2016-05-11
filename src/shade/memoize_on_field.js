
// only memoizes on value of first argument, so will fail if function
// takes more than one argument!!
Shade.memoizeOnField = function(fieldName, fun, keyFun)
{
    keyFun = keyFun || function(i) { return i; };
    return function() {
        if (_.isUndefined(this._caches[fieldName])) {
            this._caches[fieldName] = {};
        }
        if (_.isUndefined(this._caches[fieldName][arguments[0]])) {
            this._caches[fieldName][arguments[0]] = fun.apply(this, arguments);
        }
        return this._caches[fieldName][arguments[0]];
    };
};
