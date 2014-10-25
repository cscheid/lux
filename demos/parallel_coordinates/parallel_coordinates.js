var gl;
var pcBatch;

//////////////////////////////////////////////////////////////////////////////

function parallelCoords()
{
    var rawTable = Data.cars();
    var table = Lux.Data.textureTable(rawTable);
    var elements = [];

    function columnF(f) {
        var lst = [];
        for (var i=0; i<rawTable.numberColumns.length; ++i) {
            var col = rawTable.columns[rawTable.numberColumns[i]];
            lst.push(f(_.map(rawTable.data, function(row) {
                return row[col];
            }).filter(function(v) {
                return typeof v === "number";
            })));
        }
        return function(x) {
            return Shade.array(lst).at(x);
        };
    }
    var columnMin = columnF(function(col) { return _.min(col); });
    var columnMax = columnF(function(col) { return _.max(col); });

    var position = function(primitive, vertex) {
        var col = primitive.div(table.nRows).floor().add(vertex),
            row = primitive.mod(table.nRows).floor();
        
        var y = Shade.Scale.linear({domain: [columnMin(col), columnMax(col)],
                                    range: [-0.95, 0.95]})(table.at(row, col));
        var x = Shade.Scale.linear({domain: [0, Shade.sub(table.nCols, 1)],
                                    range: [-0.95, 0.95]})(col);
        return Shade.vec(x, y);
    };
    
    var colorFromIndex = function(primitiveIndex, vertexInPrimitive) {
        var whichColumn = primitiveIndex.div(table.nRows).floor(),
            whichRow    = primitiveIndex.mod(table.nRows).floor();
        return Shade.Colors.Brewer.sequential({
            name: "Reds",
            min: 0,
            max: table.nRows
        })(whichRow);
    };

    return Lux.Marks.lines({
        position: position,
        elements: table.nRows * (table.nCols - 1),
        color: colorFromIndex,
        lineWidth: 2
    });
}

function drawIt()
{
    pcBatch.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    gl = Lux.init({
        clearColor: [0, 0, 0, 0.2]
    });
    Lux.Scene.add(parallelCoords());
});
