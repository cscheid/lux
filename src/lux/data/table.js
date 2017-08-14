import _ from 'lodash';

exports.table = function(obj) {
  obj = _.defaults(obj || {}, {
    numberColumns: []
  });
  if (_.isUndefined(obj.data)) throw new Error("data is a required field");
  if (_.isUndefined(obj.data)) throw new Error("columns is a required field");
  function table() {
  };
  table.prototype = {
    isNumericRowComplete: function(row) {
      for (var i=0; i<this.numberColumns.length; ++i) {
        var col = this.columns[i];
        var val = row[col];
        if (typeof val !== "number")
          return false;
      }
      return this.numberColumns.length > 0;
    }
  };
  var result = new table();
  for (var key in obj) {
    result[key] = obj[key];
  }
  return result;
};

/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */
