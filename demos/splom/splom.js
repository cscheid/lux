var S = Shade;

var gl;
var strokeWidth;
var pointDiameter;
var pointAlpha;
var data;
var splomRow, splomCol;
var alive = false;
var hasSelection;
var selectionCol, selectionRow, selectionU1, selectionV1, selectionU2, selectionV2;

var padding = 0.05;
var isSelecting = false;

//////////////////////////////////////////////////////////////////////////////

function dataBuffers()
{
    var d = Data.flowers();
    var tt = Lux.Data.textureTable(d);
    var pointIndex = Lux.attributeBuffer({ vertexArray: _.range(tt.nRows), itemSize: 1 });
    
    return {
        sepalLength: tt.at(pointIndex, 0),
        sepalWidth:  tt.at(pointIndex, 1),
        petalLength: tt.at(pointIndex, 2),
        petalWidth:  tt.at(pointIndex, 3),
        species:     tt.at(pointIndex, 4),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species'],
        at: tt.at,
        nRows: d.data.length,
        index: pointIndex,
        nColumns: 5
    };
}

function initWebgl()
{
    data = dataBuffers();

    var speciesColor = Shade.Colors.Brewer.qualitative({
        name: "Set1",
        alpha: 0.5
    })(data.species);
    var minRange = Shade.array([4.3, 2.0, 1.0, 0.1]);
    var maxRange = Shade.array([7.9, 4.4, 6.9, 2.5]);

    hasSelection = Shade.parameter("float", 0);
    selectionU1  = Shade.parameter("float", 0);
    selectionU2  = Shade.parameter("float", 0);
    selectionV1  = Shade.parameter("float", 0);
    selectionV2  = Shade.parameter("float", 0);
    selectionRow = Shade.parameter("float", 0);
    selectionCol = Shade.parameter("float", 0);

    splomCol     = Shade.parameter("float", 0);
    splomRow     = Shade.parameter("float", 0);

    var minX = splomCol.add(  2*padding).div(4);
    var maxX = splomCol.add(1-2*padding).div(4);
    var minY = splomRow.add(  2*padding).div(4);
    var maxY = splomRow.add(1-2*padding).div(4);

    var firstPickId = Lux.freshPickId(data.nRows);

    var pickedColor = Shade.mix(speciesColor, Shade.vec(1,1,1,1), 0.8);
    var dotPickId  = Shade.add(firstPickId, data.index);

    var insideInterval = Shade(function(i, v1, v2) {
        var m = S.Scale.linear({ domain: [minRange.at(i), maxRange.at(i)], 
                                 range: [2*padding, 1-2*padding] });
        var d = m(data.at(data.index, i));
        return d.ge(v1.min(v2)).and(d.le(v1.max(v2)));
    });

    var insideBox = 
             insideInterval(selectionCol, selectionU1, selectionU2)
        .and(insideInterval(selectionRow, selectionV1, selectionV2));

    var selectionColor = insideBox.ifelse(speciesColor, Shade.color("gray", 0.3));
    var dotColor = hasSelection.ne(0).ifelse(selectionColor, speciesColor);

    var scatterplotActor = Lux.Marks.scatterplot({
        elements: data.nRows,
        x: data.at(data.index, splomCol),
        y: data.at(data.index, splomRow),
        xScale: S.Scale.linear({ domain: [ minRange.at(splomCol), maxRange.at(splomCol) ], 
                                  range: [ minX, maxX ]}),
        yScale: S.Scale.linear({ domain: [ minRange.at(splomRow), maxRange.at(splomRow) ], 
                                  range: [ minY, maxY ]}),
        fillColor: dotColor,
        strokeColor: dotColor,
        pointDiameter: 10,
        mode: Lux.DrawingMode.over,
        pickId: Shade.shadeId(dotPickId)
    });

    var scale = S.Scale.linear({ range: [-1, 1] });
    var elRow = function(index) { return index.mod(4); };
    var elCol = function(index) { return index.div(4).floor(); };
    var alignedRects = Lux.Marks.alignedRects({
        elements: 16,
        left:    function(index) { return scale(elCol(index).add(padding).div(4)); },
        right:   function(index) { return scale(elCol(index).add(1-padding).div(4)); },
        top:     function(index) { return scale(elRow(index).add(1-padding).div(4)); },
        bottom:  function(index) { return scale(elRow(index).add(padding).div(4)); },
        color:   Shade.vec(0,0,0,0.3),
        z:       0.1,
        pickId:  Shade.shadeId(0),
        mode:    Lux.DrawingMode.over
    });

    var selectionRect = Lux.Marks.alignedRects({
        left:   scale(selectionU1.add(selectionCol).div(4)),
        right:  scale(selectionU2.add(selectionCol).div(4)),
        top:    scale(selectionV1.add(selectionRow).div(4)),
        bottom: scale(selectionV2.add(selectionRow).div(4)),
        color:  Shade.vec(1,1,1,0.2),
        elements: 1,
        mode: Lux.DrawingMode.over
    });

    var scatterplotBatch, alignedRectsBatch, selectionRectBatch;
    Lux.Scene.add({
        dress: function(scene) {
            scatterplotBatch = scatterplotActor.dress(scene);
            alignedRectsBatch = alignedRects.dress(scene);
            selectionRectBatch = selectionRect.dress(scene);
            return {
                draw: function() {
                    alignedRectsBatch.draw();
                    for (var i=0; i<4; ++i) {
                        for (var j=0; j<4; ++j) {
                            splomRow.set(i);
                            splomCol.set(j);
                            scatterplotBatch.draw();
                        }
                    }
                    if (hasSelection.get()) {
                        selectionRectBatch.draw();
                    }
                }
            };
        },
        on: function() { return true; }
    });
}

$().ready(function() {
    var canvas = document.getElementById("splom");
    gl = Lux.init({ 
        clearColor: [0, 0, 0, 0],
        mousemove: function(event) {
            if (isSelecting) {
                var u = (event.luxX / gl.viewportWidth * 4);
                var v = (event.luxY / gl.viewportHeight * 4);
                var col = Math.floor(u);
                var row = Math.floor(v);

                u = u % 1;
                v = v % 1;
                
                if (col !== selectionCol.get() ||
                    row !== selectionRow.get())
                    return;
                selectionU2.set(u);
                selectionV2.set(v);
            }
            Lux.Scene.invalidate();
        },
        mousedown: function(event) {
            canvas.style.cursor = "crosshair";
            var u = (event.luxX / gl.viewportWidth * 4);
            var v = (event.luxY / gl.viewportHeight * 4);
            var col = Math.floor(u);
            var row = Math.floor(v);

            u = u % 1;
            v = v % 1;
            
            hasSelection.set(true);
            isSelecting = true;
            selectionCol.set(col);
            selectionRow.set(row);
            selectionU1.set(u);
            selectionV1.set(v);
            selectionU2.set(u);
            selectionV2.set(v);
            
            Lux.Scene.invalidate();
        }, mouseup: function(event) {
            canvas.style.cursor = "default";
            if (selectionU1.get() === selectionU2.get() ||
                selectionV1.get() === selectionV2.get()) {
                hasSelection.set(false);
                Lux.Scene.invalidate();
            }
            isSelecting = false;
        }
    });
    initWebgl();
    Lux.Picker.drawPickScene();
});
