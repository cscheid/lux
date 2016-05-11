//////////////////////////////////////////////////////////////////////////////
// roll-your-own prototypal inheritance

Shade._create = (function() {
    var guid = 0;
    return function(baseType, newObj)
    {
        // function F() {
        //     for (var key in newObj) {
        //         this[key] = newObj[key];
        //     }
        //     this.guid = "guid" + guid;

        //     // this is where memoizeOnField stashes results. putting
        //     // them all in a single member variable makes it easy to
        //     // create a clean prototype
        //     this._caches = {};

        //     guid += 1;
        // }
        // F.prototype = baseType;
        // return new F();

        var result = function() {
            return result.callOperator.apply(result, _.toArray(arguments));
        };

        for (var key in newObj) {
            result[key] = newObj[key];
        }
        result.guid = guid;

        // this is where memoizeOnField stashes results. putting
        // them all in a single member variable makes it easy to
        // create a clean prototype
        result._caches = {};

        guid += 1;
        result.__proto__ = baseType;
        return result;
    };
})();

Shade._createConcrete = function(base, requirements)
{
    function createIt(newObj) {
        for (var i=0; i<requirements.length; ++i) {
            var field = requirements[i];
            if (!(field in newObj)) {
                throw new Error("new expression missing " + requirements[i]);
            }
            if (_.isUndefined(newObj[field])) {
                throw new Error("field '" + field + "' cannot be undefined");
            }
        }
        return Shade._create(base, newObj);
    }
    return createIt;
};
