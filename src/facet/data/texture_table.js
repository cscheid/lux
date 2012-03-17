Facet.Data.texture_table = function(table)
{
    var ctx = Facet._globals.ctx;

    var elements = [];
    for (var row_ix = 0; row_ix < table.data.length; ++row_ix) {
        var row = table.data[row_ix];
        if (!table.is_numeric_row_complete(row))
            continue;
        for (var col_ix = 0; col_ix < table.number_columns.length; ++col_ix) {
            var col_name = table.columns[table.number_columns[col_ix]];
            var val = row[col_name];
            if (typeof val !== "number")
                throw "texture_table requires numeric values";
            elements.push(val);
        }
    }

    var table_ncols = table.number_columns.length;
    // can't be table.data.length because not all rows are valid.
    var table_nrows = elements.length / table.number_columns.length;
    var texture_width = 1;

    return Facet.Data.texture_array({
        n_rows: table_nrows,
        n_cols: table_ncols,
        elements: elements
    });
};
