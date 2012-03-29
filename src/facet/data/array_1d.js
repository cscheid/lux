Facet.Data.array_1d = function(array)
{
    var ctx = Facet._globals.ctx;

    var elements = array;
    var texture_width = 1;
    while (4 * texture_width * texture_width < elements.length) {
        texture_width = texture_width * 2;
    }
    var texture_height = Math.ceil(elements.length / (4 * texture_width));
    var new_elements;
    if (texture_width * texture_height === elements.length) {
        if (facet_typeOf(elements) === "array") {
            new_elements = new Float32Array(elements);
        } else
            new_elements = elements;
    } else {
        new_elements = new Float32Array(texture_width * texture_height * 4);
        for (var i=0; i<elements.length; ++i)
            new_elements[i] = elements[i];
    }

    var texture = Facet.texture({
        width: texture_width,
        height: texture_height,
        buffer: new_elements,
        type: ctx.FLOAT,
        format: ctx.RGBA,
        min_filter: ctx.NEAREST,
        min_filter: ctx.NEAREST
    });

    var index = Shade(function(linear_index) {
        var in_texel_offset = linear_index.mod(4);
        var texel_index = linear_index.div(4).floor();
        var x = texel_index.mod(texture_width);
        var y = texel_index.div(texture_width).floor();
        var result = Shade.vec(x, y, in_texel_offset);
        return result;
    });

    var at = Shade(function(linear_index) {
        var ix = index(linear_index);
        var uv = ix.swizzle("xy")
            .add(Shade.vec(0.5, 0.5))
            .div(Shade.vec(texture_width, texture_height))
            ;
        return Shade.texture2D(texture, uv).at(ix.z());
    });
    return {
        length: new_elements.length,
        at: at,
        index: index
    };
};
