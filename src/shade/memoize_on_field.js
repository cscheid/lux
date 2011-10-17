
// only memoizes on value of first argument, so will fail if function
// takes more than one argument!!
Shade.memoize_on_field = function(field_name, fun)
{
    return function() {
        if (typeOf(this[field_name]) === "undefined") {
            this[field_name] = {};
        }
        if (typeOf(this[field_name][arguments[0]]) === "undefined") {
            this[field_name][arguments[0]] = fun.apply(this, arguments);
        }
        return this[field_name][arguments[0]];
    };
}
