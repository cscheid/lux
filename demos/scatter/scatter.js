var S = Shade;

var stroke_width;
var point_diameter;
var point_alpha;
var alive = false;
var gl;

//////////////////////////////////////////////////////////////////////////////

function data_buffers()
{
    var d = Data.flowers();
    return {
        sepalLength: Facet.attribute_buffer(d.data.map(function(v) { return v.sepalLength; }), 1),
        sepalWidth:  Facet.attribute_buffer(d.data.map(function(v) { return v.sepalWidth; }), 1),
        petalLength: Facet.attribute_buffer(d.data.map(function(v) { return v.petalLength; }), 1),
        petalWidth:  Facet.attribute_buffer(d.data.map(function(v) { return v.petalWidth; }), 1),
        species:     Facet.attribute_buffer(d.data.map(function(v) { return v.species; }), 1, 'ubyte'),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species']
    };
}

$().ready(function() {
    setup_ui();
    gl = Facet.init(document.getElementById("scatterplot"), {
        clearColor: [0, 0, 0, 0.2]
    });

    var data = data_buffers();

    point_diameter = S.parameter("float", 10);
    stroke_width   = S.parameter("float", 2.5);
    point_alpha    = S.parameter("float", 1.0);

    var species_color = S.vec(S.Utils.choose(
        [S.vec(1, 0, 0),
         S.vec(0, 1, 0),
         S.vec(0, 0, 1)])(data.species), point_alpha);

    Facet.Scene.add(Facet.Marks.scatterplot({
        elements: data.sepalWidth.numItems,
        x: data.sepalLength,
        y: data.petalLength,
        x_scale: S.Utils.fit(data.sepalLength),
        y_scale: S.Utils.fit(data.petalLength),
        fill_color: species_color,
        stroke_color: species_color.mul(0.75),
        stroke_width: stroke_width,
        point_diameter: point_diameter,
        mode: Facet.DrawingMode.over
    }));
});

function setup_ui()
{
    function change_pointsize() {
        point_diameter.set($("#pointsize").slider("value") / 10.0);
        gl.display();
    };
    function change_alpha() {
        point_alpha.set($("#pointalpha").slider("value") / 100.0);
        gl.display();
    };
    function change_stroke_width() {
        stroke_width.set($("#strokewidth").slider("value") / 10.0);
        gl.display();
    };
    $("#pointsize").slider({
        min: 0, 
        max: 1000, 
        orientation: "horizontal",
        value: 100,
        slide: change_pointsize,
        change: change_pointsize
    });
    $("#pointalpha").slider({
        min: 0, 
        max: 100, 
        orientation: "horizontal",
        value: 100,
        slide: change_alpha,
        change: change_alpha
    });
    $("#strokewidth").slider({
        min: 0, 
        max: 150, 
        orientation: "horizontal",
        value: 25,
        slide: change_stroke_width,
        change: change_stroke_width
    });
}
