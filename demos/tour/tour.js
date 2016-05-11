var S = Shade;

var gl;
var strokeWidth;
var pointDiameter;
var pointAlpha;
var data;
var tourBatch;

var axis1Parameters, axis2Parameters;

//////////////////////////////////////////////////////////////////////////////

function dataBuffers()
{
    var d = Data.flowers();
    var result = {};
    var fields = ["sepalLength", "sepalWidth", "petalLength", "petalWidth", "species"];
    _.each(fields, function(field) {
        result[field] = Lux.attributeBuffer({
            vertexArray: d.data.map(function(v) { return v[field]; }),
            itemSize: 1,
            keepArray: true
        });
    });
    result.columns = fields;
    return result;
}

function random2dFrame(dimension)
{
    var v1 = [], v2 = [];
    var l1 = 0, l2 = 0;
    for (var i=0; i<dimension; ++i) {
        v1[i] = Math.random() * 2 - 1;
        v2[i] = Math.random() * 2 - 1;
        l1 += v1[i] * v1[i];
        l2 += v2[i] * v2[i];
    }
    l1 = Math.sqrt(l1);
    l2 = Math.sqrt(l2);
    // exceedingly unlikely; just try again.
    if (l1 === 0 || l2 === 0)
        return random2dFrame(dimension);
    var d = 0;
    for (i=0; i<dimension; ++i) {
        v1[i] /= l1;
        v2[i] /= l2;
        d += v1[i] * v2[i];
    }
    var l = 0;
    for (i=0; i<dimension; ++i) {
        v2[i] = v2[i] - d * v1[i];
        l += v2[i] * v2[i];
    }
    l = Math.sqrt(l);
    // exceedingly unlikely; just try again.
    if (l === 0)
        return random2dFrame(dimension);
    for (i=0; i<dimension; ++i) {
        v2[i] /= l;
    }
    return [v1, v2];
}

function initWebgl()
{
    data = dataBuffers();

    pointDiameter = S.parameter("float", 10);
    strokeWidth   = S.parameter("float", 2.5);
    pointAlpha    = S.parameter("float", 1.0);

    axis1Parameters = [];
    axis2Parameters = [];
    var columnMin, columnMax, columnCenter = [];
    var xyExpression = Shade.vec(0, 0),
        xyCenter = Shade.vec(0, 0),
        xyDistance = Shade.vec(0, 0);

    for (var i=0; i<4; ++i) {
        var thisColumn = data[data.columns[i]];
        axis1Parameters.push(Shade.parameter("float"));
        axis2Parameters.push(Shade.parameter("float"));
        var axes = Shade.vec(axis1Parameters[i], axis2Parameters[i]);
        columnMin = _.min(thisColumn.array);
        columnMax = _.max(thisColumn.array);
        columnCenter = (columnMax + columnMin) / 2;
        xyExpression = xyExpression.add(axes.mul(thisColumn));
        xyCenter = xyCenter.add(axes.mul(columnCenter));
        xyDistance = xyDistance.add(axes.mul(columnCenter - columnMin).abs());
    };

    var speciesColor = Shade.Colors.Brewer.qualitative({
        name: "Set1"
    })(data.species);

    Lux.Scene.add(Lux.Marks.scatterplot({
        elements: data.sepalWidth.numItems,
        xy: xyExpression,
        xyScale: S.Scale.linear({ domain: [xyCenter.sub(xyDistance),
                                            xyCenter.add(xyDistance)],
                                   range: [S.vec(0,0), 
                                           S.vec(1,1)] }),
        fillColor: S.vec(speciesColor.swizzle("rgb"), pointAlpha),
        strokeColor: S.vec(S.mix(Shade.color("black"), speciesColor, 0.5).swizzle("rgb"), pointAlpha),
        strokeWidth: strokeWidth,
        pointDiameter: pointDiameter
    }));
}

$().ready(function() {
    function changePointsize() {
        var newValue = $("#pointsize").slider("value") / 10.0;
        pointDiameter.set(newValue);
        Lux.Scene.invalidate();
    };
    function changeAlpha() {
        var newValue = $("#pointalpha").slider("value") / 100.0;
        pointAlpha.set(newValue);
        Lux.Scene.invalidate();
    };
    function changeStrokeWidth() {
        var newValue = $("#strokewidth").slider("value") / 10.0;
        strokeWidth.set(newValue);
        Lux.Scene.invalidate();
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
    gl = Lux.init({clearColor:[0,0,0,0.1]});
    initWebgl();
    var frame1 = random2dFrame(4);
    var frame2 = random2dFrame(4);
    var start = new Date().getTime();
    var prevU = 1;
    Lux.Scene.animate(function () {
        var elapsed = (new Date().getTime() - start) / 1000;
        var u = elapsed/3;
        u -= Math.floor(u);
        if (u < prevU) {
            frame1 = frame2;
            frame2 = random2dFrame(4);
        }
        prevU = u;
        for (var i=0; i<4; ++i) {
            axis1Parameters[i].set(u*frame2[0][i] + (1-u) * frame1[0][i]);
            axis2Parameters[i].set(u*frame2[1][i] + (1-u) * frame1[1][i]);
        }
    });
});
