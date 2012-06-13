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
        sepalLength: Facet.attribute_buffer({ vertex_array: d.data.map(function(v) { return v.sepalLength; }), item_size: 1}),
        sepalWidth:  Facet.attribute_buffer({ vertex_array: d.data.map(function(v) { return v.sepalWidth; }), item_size: 1}),
        petalLength: Facet.attribute_buffer({ vertex_array: d.data.map(function(v) { return v.petalLength; }), item_size: 1}),
        petalWidth:  Facet.attribute_buffer({ vertex_array: d.data.map(function(v) { return v.petalWidth; }), item_size: 1}),
        species:     Facet.attribute_buffer({ vertex_array: d.data.map(function(v) { return v.species; }), item_size: 1, item_type: 'ubyte'}),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species']
    };
}

$().ready(function() {

    point_diameter = S.parameter("float", 10);
    stroke_width   = S.parameter("float", 2.5);
    point_alpha    = S.parameter("float", 1.0);
    Facet.UI.parameter_slider({
        element: "#pointsize",
        parameter: point_diameter,
        min: 0, 
        max: 100
    });
    Facet.UI.parameter_slider({
        element: "#pointalpha",
        parameter: point_alpha,
        min: 0,
        max: 1
    });
    Facet.UI.parameter_slider({
        element: "#strokewidth",
        parameter: stroke_width,
        min: 0,
        max: 100
    });

    gl = Facet.init(document.getElementById("scatterplot"), {
        clearColor: [0, 0, 0, 0.2]
    });

    var data = data_buffers();

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
