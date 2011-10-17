var gl;
var pc_batch;

//////////////////////////////////////////////////////////////////////////////

function create_table()
{
    var data = Data.cars();
    var row_ix = 0;
    var which_row = [];
    var which_col = [];
    var vals = [];
    var col_min = [], col_max = [];
    _.each(data.number_columns, function(v) {
        col_min[v] =  1e10;
        col_max[v] = -1e10;
    });
    for (var i=0; i<data.data.length; ++i) {
        var row = data.data[i];
        if (_.any(row, function(v) { return _.isUndefined(v); }))
            continue;
        for (var j=0; j<data.number_columns.length; ++j) {
            var col = data.number_columns[j];
            var val = row[data.columns[col]];
            which_row.push(row_ix);
            which_col.push(j);
            vals.push(val);
            col_max[col] = Math.max(col_max[col], val);
            col_min[col] = Math.min(col_min[col], val);
        }
        ++row_ix;
    }
    return {
        value:      Facet.attribute_buffer(vals, 1),
        row:        Facet.attribute_buffer(which_row, 1),
        column:     Facet.attribute_buffer(which_col, 1),
        column_min: col_min,
        column_max: col_max,
        n_rows:     row_ix,
        n_columns:  vals.length / row_ix
    };
};

function create_parallel_coords_batch()
{
    var table = create_table();
    var elements = [];
    
    for (var i=0; i<table.n_rows; ++i)
        for (var j=0; j<table.n_columns-1; ++j)
            elements.push(i * table.n_columns + j,
                          i * table.n_columns + j+1);

    var column_min = Shade.constant(table.column_min);
    var column_max = Shade.constant(table.column_max);
    var y = Shade.Utils.linear(column_min.at(table.column),
                               column_max.at(table.column),
                               -0.9, 0.9)(table.value);
    var x = Shade.Utils.linear(0, Shade.sub(table.n_columns, 1), -0.9, 0.9)(table.column);
    Shade.debug = true;
    return Facet.bake(Facet.model({
        type: "lines",
        elements: elements
    }),{
        position: Shade.vec(x,y,0,1),
        color: Shade.mix(Shade.color("brown"),
                         Shade.color("steelblue"),
                         Shade.Utils.linear(0, table.n_rows, 0, 1)(table.row))
            .mul(Shade.vec(1,1,1,0.8))
    });
}

function draw_it()
{
    gl.lineWidth(2);
    gl.clearDepth(1.0);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA,
                         gl.SRC_ALPHA, gl.ONE);
    pc_batch.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Facet.initGL(canvas, {
        display: draw_it
    });
    pc_batch = create_parallel_coords_batch();
    var start = new Date().getTime();

    gl.display();
    f();
});
