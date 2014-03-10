// function types are opaque objects. Not ideal, but about the
// best we can do in javascript.
Shade.Types.function_t = Shade._create(Shade.Types.base_t, {
    repr: function() {
        return "function";
    },
    is_function: function() {
        return true;
    }
});
