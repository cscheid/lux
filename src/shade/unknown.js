// Shade.unknown encodes a Shade expression whose value
// is not determinable at compile time.
//
// This is used only internally by the compiler

(function() {
    var obj = { _caches: {} };
    obj.fun = Shade.memoizeOnField("_cache", function(type) {
        return Shade._createConcreteValueExp({
            parents: [],
            type: type,
            evaluate: function() { throw new Error("<unknown> does not support evaluation"); },
            value: function() { throw new Error("<unknown> should never get to compilation"); }
        });
    }, function(type) { 
        return type.repr();
    });
    Shade.unknown = function(type) {
        return obj.fun(type);
    };
})();
