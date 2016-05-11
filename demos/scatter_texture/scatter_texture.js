var S = Shade;

var gl;
var strokeWidth;
var pointDiameter;
var pointAlpha;
var data;
var scatterplotBatch;
var alive = false;

//////////////////////////////////////////////////////////////////////////////

function display()
{
    scatterplotBatch.draw();
}

function dataBuffers()
{
    var d = Data.flowers();
    var tt = Lux.Data.textureTable(d);
    var pointIndex = Lux.attributeBuffer({ 
        vertexArray: _.range(tt.nRows), 
        itemSize: 1
    });
    
    return {
        sepalLength: tt.at(pointIndex, 0),
        sepalWidth:  tt.at(pointIndex, 1),
        petalLength: tt.at(pointIndex, 2),
        petalWidth:  tt.at(pointIndex, 3),
        species:     tt.at(pointIndex, 4),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species'],
        nRows: d.data.length,
        nColumns: 5
    };
}

function initWebgl()
{
    data = dataBuffers();

    pointDiameter = S.parameter("float", 10);
    strokeWidth   = S.parameter("float", 2.5);
    pointAlpha    = S.parameter("float", 1.0);

    var speciesColor = Shade.Colors.Brewer.qualitative({
        name: "Set1",
        alpha: pointAlpha
    })(data.species);
    // var speciesColor = S.Utils.choose(
    //     [S.vec(1, 0, 0, pointAlpha),
    //      S.vec(0, 1, 0, pointAlpha),
    //      S.vec(0, 0, 1, pointAlpha)])(data.species);

    // Shade.debug = true;
    scatterplotBatch = Lux.Marks.scatterplot({
        elements: data.nRows,
        x: data.sepalLength,
        y: data.petalLength,
        xScale: S.Scale.linear({ domain: [4, 8], range: [0, 1] }),
        yScale: S.Scale.linear({ domain: [1, 7], range: [0, 1] }),
        fillColor: speciesColor,
        strokeWidth: strokeWidth,
        strokeColor: S.mix(speciesColor, S.color("black", pointAlpha), 0.5),
        pointDiameter: pointDiameter,
        mode: Lux.DrawingMode.over
    });
}

$().ready(function() {
    function changePointsize() {
        var newValue = $("#pointsize").slider("value") / 10.0;
        pointDiameter.set(newValue);
        gl.display();
    };
    function changeAlpha() {
        var newValue = $("#pointalpha").slider("value") / 100.0;
        pointAlpha.set(newValue);
        gl.display();
    };
    function changeStrokeWidth() {
        var newValue = $("#strokewidth").slider("value") / 10.0;
        strokeWidth.set(newValue);
        gl.display();
    };
    $("#pointsize").slider({
        min: 0, 
        max: 1000, 
        orientation: "horizontal",
        value: 100,
        slide: changePointsize,
        change: changePointsize
    });
    $("#pointalpha").slider({
        min: 0, 
        max: 100, 
        orientation: "horizontal",
        value: 100,
        slide: changeAlpha,
        change: changeAlpha
    });
    $("#strokewidth").slider({
        min: 0, 
        max: 150, 
        orientation: "horizontal",
        value: 25,
        slide: changeStrokeWidth,
        change: changeStrokeWidth
    });
    var canvas = document.getElementById("scatterplot");
    gl = Lux.init({
        display: display,
        clearColor: [0, 0, 0, 0.2]
    });
    initWebgl();
    var start = new Date().getTime();
    var f = function () {
        if (alive) {
            window.requestAnimationFrame(f, canvas);
        }
        gl.display();
    };
    f();
});
