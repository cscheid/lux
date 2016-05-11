/* If webgl supported bitwise operations,
   maskLast(v, bits) = v & ((1 << bits) - 1)

   We use the slower version via mod():

   v & ((1 << k) - 1) = v % (1 << k)
*/
Shade.Bits.maskLast = Shade.make(function(v, bits) {
    return v.mod(Shade.Bits.shiftLeft(1, bits));
});
