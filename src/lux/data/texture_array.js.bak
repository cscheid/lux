/*
   texture array takes an object with fields:

     n_cols (integer): number of columns in the 2D array of data
     n_rows (integer): number of rows in the 2D array of data
     elements (array, Float32Array): list of elements in the array

   and returns an object with four fields:

   n_cols (integer): number of columns in the data

   n_rows (integer): number of rows in the data

   at (function(Shade(int), Shade(int)) -> Shade(float)): returns the
   value stored at given row and column

   index (function(Shade(int), Shade(int)) -> Shade(vec3)): returns
   the index of the value stored at given row and column. This is a
   three dimensional vector.  The first two coordinates store the
   texture coordinate, and the fourth coordinate stores the
   channel. This is necessary to take advantage of RGBA float
   textures, which have the widest support on WebGL-capable hardware.

   For example, luminance float textures appear to clamp to [0,1], at
   least on Chrome 15 on Linux.

 */

Lux.Data.texture_array = function(opts)
{
    var ctx = Lux._globals.ctx;
    var elements = opts.elements;
    var n_cols = opts.n_cols;
    var n_rows = opts.n_rows;

    var texture_width = 1;
    while (4 * texture_width * texture_width < elements.length) {
        texture_width = texture_width * 2;
    }
    var texture_height = Math.ceil(elements.length / (4 * texture_width));

    var new_elements;
    if (texture_width * texture_height === elements.length) {
        // no chance this will ever happen in practice, but hey, 
        // a man can dream
        if (Lux.type_of(elements) === "array") {
            new_elements = new Float32Array(elements);
        } else
            new_elements = elements;
    } else {
        new_elements = new Float32Array(texture_width * texture_height * 4);
        for (var i=0; i<elements.length; ++i)
            new_elements[i] = elements[i];
    }

    var texture = Lux.texture({
        width: texture_width,
        height: texture_height,
        buffer: new_elements,
        type: ctx.FLOAT,
        format: ctx.RGBA,
        min_filter: ctx.NEAREST,
        mag_filter: ctx.NEAREST
    });

    var index = Shade(function(row, col) {
        var linear_index    = row.mul(n_cols).add(col);
        var in_texel_offset = linear_index.mod(4);
        var texel_index     = linear_index.div(4).floor();
        var x               = texel_index.mod(texture_width);
        var y               = texel_index.div(texture_width).floor();
        var result          = Shade.vec(x, y, in_texel_offset);
        return result;
    });
    var at = Shade(function(row, col) {
        // returns Shade expression with value at row, col
        var ix = index(row, col);
        var uv = ix.swizzle("xy")
            .add(Shade.vec(0.5, 0.5))
            .div(Shade.vec(texture_width, texture_height))
            ;
        return Shade.texture2D(texture, uv).at(ix.z());
    });

    return {
        n_rows: n_rows,
        n_cols: n_cols,
        at: at,
        index: index
    };
};
