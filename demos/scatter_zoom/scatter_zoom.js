var S = Shade;

var strokeWidth;
var pointDiameter;
var pointAlpha;
var alive = false;
var gl;

//////////////////////////////////////////////////////////////////////////////

function dataBuffers()
{
    var d = Data.flowers();
    return {
        sepalLength: Lux.attributeBuffer({ vertexArray: d.data.map(function(v) { return v.sepalLength; }), itemSize: 1, keepArray: true }),
        sepalWidth:  Lux.attributeBuffer({ vertexArray: d.data.map(function(v) { return v.sepalWidth; }), itemSize: 1, keepArray: true}),
        petalLength: Lux.attributeBuffer({ vertexArray: d.data.map(function(v) { return v.petalLength; }), itemSize: 1, keepArray: true}),
        petalWidth:  Lux.attributeBuffer({ vertexArray: d.data.map(function(v) { return v.petalWidth; }), itemSize: 1, keepArray: true}),
        species:     Lux.attributeBuffer({ vertexArray: d.data.map(function(v) { return v.species; }), itemSize: 1, itemType: 'ubyte', keepArray: true}),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species']
    };
}

$().ready(function() {

    pointDiameter = S.parameter("float", 10);
    strokeWidth   = S.parameter("float", 2.5);
    pointAlpha    = S.parameter("float", 1.0);
    Lux.UI.parameterSlider({
        element: "#pointsize",
        parameter: pointDiameter,
        min: 0, 
        max: 100
    });
    Lux.UI.parameterSlider({
        element: "#pointalpha",
        parameter: pointAlpha,
        min: 0,
        max: 1
    });
    Lux.UI.parameterSlider({
        element: "#strokewidth",
        parameter: strokeWidth,
        min: 0,
        max: 100
    });

    gl = Lux.init({
        interactor: Lux.UI.centerZoomInteractor({width: 400, height: 400}),
        clearColor: [0, 0, 0, 0.2]
    });

    var data = dataBuffers();

    var speciesColor = Shade.Colors.Brewer.qualitative({
        name: "Set1",
        alpha: pointAlpha
    })(data.species);

    Lux.Scene.add(Lux.Marks.scatterplot({
        elements: data.sepalWidth.numItems,
        x: data.sepalLength,
        y: data.petalLength,
        xScale: S.Utils.fit(data.sepalLength),
        yScale: S.Utils.fit(data.petalLength),
        fillColor: speciesColor,
        strokeColor: Shade.Colors.darken(0.8)(speciesColor),
        strokeWidth: strokeWidth,
        pointDiameter: pointDiameter,
        mode: Lux.DrawingMode.over
    }));
    Lux.Scene.add(Lux.Marks.rectangleBrush({
        acceptEvent: function(event) {
            return event.button === 2 || (event.shiftKey && (event.button === 0));
        }
    }));
});
