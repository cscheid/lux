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
                throw "New expression missing " + requirements[i];
            }
            if (typeOf(new_obj[field]) === 'undefined') {
                throw "field '" + field + "' cannot be undefined.";
            }
        }
        return Shade._create(base, new_obj);
    }
    return create_it;
}
