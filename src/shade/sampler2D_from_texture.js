Shade.sampler2D_from_texture = function(texture)
{
    return texture._shade_expression || function() {
        var result = Shade.parameter("sampler2D");
        result.set(texture);
        texture._shade_expression = result;
        // FIXME: What if the same texture is bound to many samplers?!
        return result;
    }();
};

