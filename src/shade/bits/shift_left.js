Shade.Bits.shiftLeft = Shade.make(function(v, amt) {
    return v.mul(amt.exp2()).round();
});
