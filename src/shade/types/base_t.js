// <rant> How I wish I had algebraic data types. </rant>
Shade.Types.base_t = {
    is_floating: function() { return false; },
    is_integral: function() { return false; },
    is_array: function()    { return false; },
    // POD = plain old data (ints, bools, floats)
    is_pod: function()      { return false; },
    is_vec: function()      { return false; },
    is_mat: function()      { return false; },
    vec_dimension: function() { 
        throw new Error("is_vec() === false, cannot call vec_dimension");
    },
    is_function: function() { return false; },
    is_struct:   function() { return false; },
    is_sampler:  function() { return false; },
    equals: function(other) {
        if (_.isUndefined(other))
            throw new Error("type cannot be compared to undefined");
        return this.repr() == other.repr();
    },
    swizzle: function(pattern) {
        throw new Error("type '" + this.repr() + "' does not support swizzling");
    },
    element_type: function(i) {
        throw new Error("invalid call: atomic expression");
    },
    declare: function(glsl_name) {
        return this.repr() + " " + glsl_name;
    }
    // repr
    // 
    // for arrays:
    //   array_base
    //   array_size
    // 
    // for structs:
    //   fields

    // value_equals
    //   value_equals is a function that takes two parameters as produced
    //   by the constant_value() or evaluate() method of an object with
    //   the given type, and tests their equality.
};
