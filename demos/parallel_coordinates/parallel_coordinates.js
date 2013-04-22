var gl;
var pc_batch;

//////////////////////////////////////////////////////////////////////////////

function create_parallel_coords_batch()
{
    var raw_table = Data.cars();
    var table = Lux.Data.texture_table(raw_table);
    var elements = [];

    function column_f(f) {
        var lst = [];
        for (var i=0; i<raw_table.number_columns.length; ++i) {
            var col = raw_table.columns[raw_table.number_columns[i]];
            lst.push(f(_.map(raw_table.data, function(row) {
                return row[col];
            }).filter(function(v) {
                return typeof v === "number";
            })));
        }
        return function(x) {
            return Shade.array(lst).at(x);
        };
    }
    var column_min = column_f(function(col) { return _.min(col); });
    var column_max = column_f(function(col) { return _.max(col); });

    var position = function(primitive, vertex) {
        var col = primitive.div(table.n_rows).floor().add(vertex),
            row = primitive.mod(table.n_rows).floor();
        
        var y = Shade.Scale.linear({domain: [column_min(col), column_max(col)],
                                    range: [-0.95, 0.95]})(table.at(row, col));
        var x = Shade.Scale.linear({domain: [0, Shade.sub(table.n_cols, 1)],
                                    range: [-0.95, 0.95]})(col);
        return Shade.vec(x, y);
    };
    
    var color_from_index = function(primitive_index, vertex_in_primitive) {
        var which_column = primitive_index.div(table.n_rows).floor(),
            which_row    = primitive_index.mod(table.n_rows).floor();
        return Shade.Colors.Brewer.sequential({
            name: "Reds",
            min: 0,
            max: table.n_rows
        })(which_row);
    };

    return Lux.Marks.lines({
        position: position,
        elements: table.n_rows * (table.n_cols - 1),
        color: color_from_index
    });
}

function draw_it()
{
    gl.lineWidth(2);
    pc_batch.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    gl = Lux.init(canvas, {
        display: draw_it,
        attributes: { alpha: true,
                      depth: true
                    },
        clearColor: [0, 0, 0, 0.2]
    });
    pc_batch = create_parallel_coords_batch();
    var start = new Date().getTime();
    gl.display();
});
