Shade.sampler2D_from_texture = function(texture)
{
    return texture._shade_expression || function() {
        var result = Shade.uniform("sampler2D");
        result.set(texture);
        texture._shade_expression = result;
        return result;
    }();
};

