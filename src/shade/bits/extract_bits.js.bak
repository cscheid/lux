/* Shade.Bits.extract_bits returns a certain bit substring of the
   original number using no bitwise operations, which are not available in WebGL.

   if they were, then the definition of extract_bits would be:

     extract_bits(num, from, to) = (num >> from) & ((1 << (to - from)) - 1)

   Shade.Bits.extract_bits assumes:

     num > 0
     from < to
*/

Shade.Bits.extract_bits = Shade.make(function(num, from, to) {
    from = from.add(0.5).floor();
    to = to.add(0.5).floor();
    return Shade.Bits.mask_last(Shade.Bits.shift_right(num, from), to.sub(from));
});
