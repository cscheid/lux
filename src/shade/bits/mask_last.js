/* If webgl supported bitwise operations,
   mask_last(v, bits) = v & ((1 << bits) - 1)

   We use the slower version via mod():

   v & ((1 << k) - 1) = v % (1 << k)
*/
Shade.Bits.mask_last = Shade.make(function(v, bits) {
    return v.mod(Shade.Bits.shift_left(1, bits));
});
