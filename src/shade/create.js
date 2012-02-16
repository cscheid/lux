//////////////////////////////////////////////////////////////////////////////
// roll-your-own prototypal inheritance

Shade._create = (function() {
    var guid = 0;
    return function(base_type, new_obj)
    {
        function F() {
            for (var key in new_obj) {
                this[key] = new_obj[key];
            }
            this.guid = "GUID_" + guid;

            // this is where memoize_on_field stashes results. putting
            // them all in a single member variable makes it easy to
            // create a clean prototype
            this._caches = {};

            guid += 1;
        }
        F.prototype = base_type;
        return new F();
    };
})();

Shade._create_concrete = function(base, requirements)
{
    function create_it(new_obj) {
        for (var i=0; i<requirements.length; ++i) {
            var field = requirements[i];
            if (!(field in new_obj)) {
                throw "new expression missing " + requirements[i];
            }
            if (_.isUndefined(new_obj[field])) {
                throw "field '" + field + "' cannot be undefined";
            }
        }
        return Shade._create(base, new_obj);
    }
    return create_it;
};
