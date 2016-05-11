// converts a 32-bit integer into an 8-bit RGBA value.
// this is most useful for picking.

// Ideally we would like this to take shade expressions,
// but WebGL does not support bitwise operators.

Shade.id = function(idValue)
{
    var r = idValue & 255;
    var g = (idValue >> 8) & 255;
    var b = (idValue >> 16) & 255;
    var a = (idValue >> 24) & 255;
    
    return vec4.make([r / 255, g / 255, b / 255, a / 255]);
};

Shade.shadeId = Shade(function(idValue)
{
    return idValue.div(Shade.vec(1, 256, 65536, 16777216)).mod(256).floor().div(255);
});
