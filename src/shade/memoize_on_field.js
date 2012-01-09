
// only memoizes on value of first argument, so will fail if function
// takes more than one argument!!
Shade.memoize_on_field = function(field_name, fun)
{
    return function() {
        if (_.isUndefined(this._caches[field_name])) {
            this._caches[field_name] = {};
        }
        if (_.isUndefined(this._caches[field_name][arguments[0]])) {
            this._caches[field_name][arguments[0]] = fun.apply(this, arguments);
        }
        return this._caches[field_name][arguments[0]];
    };
}
