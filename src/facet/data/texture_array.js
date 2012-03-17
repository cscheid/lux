Facet.Data.texture_array = function(opts)
{
    var ctx = Facet._globals.ctx;
    var elements = opts.elements;
    var n_cols = opts.n_cols;
    var n_rows = opts.n_rows;

    var table = {};
    table.number_columns = _.range(0, n_cols);
    table.columns = _.range(0, n_cols);
    table.is_numeric_row_complete = function() { return true; };
    table.data = [];
    for (var i=0; i<n_rows; ++i) {
        var lst = [];
        for (var j=0; j<n_cols; ++j) {
            lst.push(opts.elements[i*n_cols + j]);
        }
        table.data.push(lst);
    }
    return Facet.Data.texture_table(table);

    // var texture_width = 1;
    // while (4 * texture_width * texture_width < opts.elements.length) {
    //     texture_width = texture_width * 2;
    // }
    // var texture_height = Math.ceil(elements.length / (4 * texture_width));

    // console.log("Texture size: ", texture_width, texture_height);

    // // FIXME poking at the input is bad form.
    // if (elements.length < 4 * texture_height * texture_width)
    //     elements[4 * texture_height * texture_width - 1] = 0;
    
    // var texture = Facet.texture({
    //     width: texture_width,
    //     height: texture_height,
    //     buffer: new Float32Array(elements),
    //     type: ctx.FLOAT,
    //     format: ctx.RGBA,
    //     min_filter: ctx.NEAREST,
    //     mag_filter: ctx.NEAREST
    // });

    // var index = Shade(function(row, col) {
    //     var linear_index    = row.mul(n_cols).add(col);
    //     var in_texel_offset = linear_index.mod(4);
    //     var texel_index     = linear_index.div(4).floor();
    //     var x               = texel_index.mod(texture_width);
    //     var y               = texel_index.div(texture_width).floor();
    //     var result          = Shade.vec(x, y, in_texel_offset);
    //     return result;
    // });
    // var at = Shade(function(row, col) {
    //     // returns Shade expression with value at row, col
    //     var ix = index(row, col);
    //     var uv = ix.swizzle("xy")
    //         .add(Shade.vec(0.5, 0.5))
    //         .div(Shade.vec(texture_width, texture_height))
    //         ;
    //     return Shade.texture2D(texture, uv).at(ix.z());
    // });

    // return {
    //     n_rows: n_rows,
    //     n_cols: n_cols,
    //     at: at,
    //     index: index
    // };
};
