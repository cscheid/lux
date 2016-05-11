/* Shade.Bits.extractBits returns a certain bit substring of the
   original number using no bitwise operations, which are not available in WebGL.

   if they were, then the definition of extractBits would be:

     extractBits(num, from, to) = (num >> from) & ((1 << (to - from)) - 1)

   Shade.Bits.extractBits assumes:

     num > 0
     from < to
*/

Shade.Bits.extractBits = Shade.make(function(num, from, to) {
    from = from.add(0.5).floor();
    to = to.add(0.5).floor();
    return Shade.Bits.maskLast(Shade.Bits.shiftRight(num, from), to.sub(from));
});
