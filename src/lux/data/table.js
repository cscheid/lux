Lux.Data.table = function(obj) {
    obj = _.defaults(obj || {}, {
        number_columns: []
    });
    if (_.isUndefined(obj.data)) throw new Error("data is a required field");
    if (_.isUndefined(obj.data)) throw new Error("columns is a required field");
    function table() {
    };
    table.prototype = {
        is_numeric_row_complete: function(row) {
            for (var i=0; i<this.number_columns.length; ++i) {
                var col = this.columns[i];
                var val = row[col];
                if (typeof val !== "number")
                    return false;
            }
            return this.number_columns.length > 0;
        }
    };
    var result = new table();
    for (var key in obj) {
        result[key] = obj[key];
    }
    return result;
};
