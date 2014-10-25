Shade.Bits.shiftRight = Shade.make(function(v, amt) {
    // NB: this is *not* equivalent to any sequence of operations
    // involving round()

    // The extra gymnastics are necessary because
    //
    // 1. we cannot round the result, since some of the fractional values
    // might be larger than 0.5
    //
    // 2. shifting right by a large number (>22 in my tests) creates
    // a large enough float that precision is an issue (2^22 / exp2(22) < 1, for example). 
    // So we divide an ever so slightly larger number so that flooring
    // does the right thing.
    //
    // THIS REMAINS TO BE THOROUGHLY TESTED.
    //
    // There's possibly a better alternative involving integer arithmetic,
    // but GLSL ES allows implementations to use floating-point in place of integers.
    // 
    // It's likely that the only portably correct implementation of this
    // uses look-up tables. I won't fix this for now.

    v = v.floor().add(0.5);
    return v.div(amt.exp2()).floor();
});
