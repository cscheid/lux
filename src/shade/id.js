// converts a 32-bit integer into an 8-bit RGBA value.
// this is most useful for picking.

// Ideally we would like this to take shade expressions,
// but WebGL does not support bitwise operators.

Shade.id = function(id_value)
{
    var r = id_value & 255;
    var g = (id_value >> 8) & 255;
    var b = (id_value >> 16) & 255;
    var a = (id_value >> 24) & 255;
    
    return vec4.make([r / 255, g / 255, b / 255, a / 255]);
};

Shade.shade_id = Shade(function(id_value)
{
    return id_value.div(Shade.vec(1, 256, 65536, 16777216)).mod(256).floor().div(255);
});
