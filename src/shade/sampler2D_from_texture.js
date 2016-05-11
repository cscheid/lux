Shade.sampler2dFromTexture = function(texture)
{
    return texture._shadeExpression || function() {
        var result = Shade.parameter("sampler2D");
        result.set(texture);
        texture._shadeExpression = result;
        // FIXME: What if the same texture is bound to many samplers?!
        return result;
    }();
};

