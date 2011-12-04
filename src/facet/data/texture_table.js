// currently this does not support storing tables in RGBA textures.
// Storing tables in RGBA textures instead of luminance textures is important
// when pushing large data onto the GPU because of texture addressing limitations
// 
// (8192^2 = 64M texture entries, which becomes a more respectable total 256M entries if allowing
// 4 entries per texture pixel)
//
//
Facet.Data.texture_table = function(table)
{
    var ctx = Facet._globals.ctx;

    var elements = [];
    for (var row_ix = 0; row_ix < table.data.length; ++row_ix) {
        var row = table.data[row_ix];
        for (var col_ix = 0; col_ix < table.number_columns.length; ++col_ix) {
            var col_name = table.columns[table.number_columns[col_ix]];
            var val = row[col_name];
            if (typeof val !== "number")
                throw "texture_table requires numeric values";
            elements.push(val);
        }
    }

    var table_ncols = table.number_columns.length;
    var table_nrows = table.data.length;

    var texture_width = 1;
    while (texture_width * texture_width < elements.length) {
        texture_width = texture_width * 2;
    }
    var texture_height = Math.ceil(elements.length / texture_width);
    while (elements.length < texture_height * texture_width)
        elements.push(0);

    var texture = Facet.texture({
        width: texture_width,
        height: texture_height,
        buffer: new Float32Array(elements),
        type: ctx.FLOAT,
        format: ctx.LUMINANCE,
        min_filter: ctx.NEAREST,
        mag_filter: ctx.NEAREST
    });

    var index = Shade.make(function(row, col) {
        var linear_index = row.mul(table_nrows).add(col);
        var y = linear_index.div(texture_width).floor();
        var x = linear_index.sub(y.mul(texture_width));
        return Shade.vec(x, y);
    });

    var at = Shade.make(function(row, col) {
        // returns Shade expression with value at row, col
        var uv = index(row, col).div(Shade.vec(texture_width, texture_height));
        return Shade.texture2D(texture, uv).at(0);
    });

    return {
        n_rows: table_nrows,
        n_cols: table_ncols,
        at: at,
        index: index
    };
};
