/* Shade.Bits.encode_float encodes a single 32-bit IEEE 754
   floating-point number as a 32-bit RGBA value, so that when rendered
   to a non-floating-point render uffer and read with readPixels, the
   resulting ArrayBufferView can be cast directly as a Float32Array,
   which will encode the correct value.

   These gymnastics are necessary because, shockingly, readPixels does
   not support reading off floating-point values of an FBO bound to a
   floating-point texture (!):

   https://www.khronos.org/webgl/public-mailing-list/archives/1108/threads.html#00020

   WebGL does not support bitwise operators. As a result, much of what
   is happening here is less efficient than it should be, and incurs
   precision losses. That is unfortunate, but currently unavoidable as
   well.

*/

// This function is currently only defined for "well-behaved" IEEE 754
// numbers. No denormals, NaN, infinities, etc.
Shade.Bits.encode_float = Shade.make(function(val) {

    var byte1, byte2, byte3, byte4;

    var is_zero = val.eq(0);

    var sign = val.gt(0).ifelse(0, 1);
    val = val.abs();

    var exponent = val.log2().floor();
    var biased_exponent = exponent.add(127);
    var fraction = val.div(exponent.exp2()).sub(1).mul(8388608); // 2^23

    var t = biased_exponent.div(2);
    var last_bit_of_biased_exponent = t.fract().mul(2);
    var remaining_bits_of_biased_exponent = t.floor();

    byte4 = Shade.Bits.extract_bits(fraction, 0, 8).div(255);
    byte3 = Shade.Bits.extract_bits(fraction, 8, 16).div(255);
    byte2 = last_bit_of_biased_exponent.mul(128)
        .add(Shade.Bits.extract_bits(fraction, 16, 23)).div(255);
    byte1 = sign.mul(128).add(remaining_bits_of_biased_exponent).div(255);

    return is_zero.ifelse(Shade.vec(0, 0, 0, 0),
                          Shade.vec(byte4, byte3, byte2, byte1));
});
