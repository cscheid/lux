Shade.Bits.shift_left = Shade.make(function(v, amt) {
    return v.mul(amt.exp2()).round();
});
