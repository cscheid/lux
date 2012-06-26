Shade.Types.array = function(base_type, size) {
    return Shade._create(Shade.Types.base_t, {
        is_array: function() { return true; },
        declare: function(glsl_name) {
            return base_type.declare(glsl_name) + "[" + size + "]";
        },
        repr: function() {
            return base_type.repr() + "[" + size + "]";
        },
        array_size: function() {
            return size;
        },
        array_base: function() {
            return base_type;
        }
    });
};
