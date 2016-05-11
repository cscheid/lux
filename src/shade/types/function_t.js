// function types are opaque objects. Not ideal, but about the
// best we can do in javascript.
Shade.Types.functionT = Shade._create(Shade.Types.baseT, {
    repr: function() {
        return "function";
    },
    isFunction: function() {
        return true;
    }
});
