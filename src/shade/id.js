// converts a 32-bit integer into an 8-bit RGBA value.
// as the name implies, this is most useful for picking.
Shade.id = function(id_value)
{
    var r = id_value & 255;
    var g = (id_value >> 8) & 255;
    var b = (id_value >> 16) & 255;
    var a = (id_value >> 24) & 255;
    
    return Shade.vec(r / 255, g / 255, b / 255, a / 255);
};
