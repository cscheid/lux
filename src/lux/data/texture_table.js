Lux.Data.textureTable = function(table)
{
    debugger;
    var elements = [];
    for (var rowIx = 0; rowIx < table.data.length; ++rowIx) {
        var row = table.data[rowIx];
        if (!table.isNumericRowComplete(row))
            continue;
        for (var colIx = 0; colIx < table.numberColumns.length; ++colIx) {
            var colName = table.columns[table.numberColumns[colIx]];
            var val = row[colName];
            if (typeof val !== "number")
                throw new Error("textureTable requires numeric values");
            elements.push(val);
        }
    }

    var tableNcols = table.numberColumns.length;
    // can't be table.data.length because not all rows are valid.
    var tableNrows = elements.length / table.numberColumns.length;
    var textureWidth = 1;

    return Lux.Data.textureArray({
        nRows: tableNrows,
        nCols: tableNcols,
        elements: elements
    });
};
