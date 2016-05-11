Shade.Types.array = function(baseType, size) {
    return Shade._create(Shade.Types.baseT, {
        isArray: function() { return true; },
        declare: function(glslName) {
            return baseType.declare(glslName) + "[" + size + "]";
        },
        repr: function() {
            return baseType.repr() + "[" + size + "]";
        },
        arraySize: function() {
            return size;
        },
        arrayBase: function() {
            return baseType;
        }
    });
};
