// <rant> How I wish I had algebraic data types. </rant>
Shade.Types.baseT = {
    isFloating: function() { return false; },
    isIntegral: function() { return false; },
    isArray: function()    { return false; },
    // POD = plain old data (ints, bools, floats)
    isPod: function()      { return false; },
    isVec: function()      { return false; },
    isMat: function()      { return false; },
    vecDimension: function() { 
        throw new Error("isVec() === false, cannot call vecDimension");
    },
    isFunction: function() { return false; },
    isStruct:   function() { return false; },
    isSampler:  function() { return false; },
    equals: function(other) {
        if (_.isUndefined(other))
            throw new Error("type cannot be compared to undefined");
        return this.repr() == other.repr();
    },
    swizzle: function(pattern) {
        throw new Error("type '" + this.repr() + "' does not support swizzling");
    },
    elementType: function(i) {
        throw new Error("invalid call: atomic expression");
    },
    declare: function(glslName) {
        return this.repr() + " " + glslName;
    }
    // repr
    // 
    // for arrays:
    //   arrayBase
    //   arraySize
    // 
    // for structs:
    //   fields

    // valueEquals
    //   valueEquals is a function that takes two parameters as produced
    //   by the constantValue() or evaluate() method of an object with
    //   the given type, and tests their equality.
};
