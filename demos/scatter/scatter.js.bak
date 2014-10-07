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
        sepalLength: Lux.attribute_buffer({ vertex_array: d.data.map(function(v) { return v.sepalLength; }), item_size: 1, keep_array: true }),
        sepalWidth:  Lux.attribute_buffer({ vertex_array: d.data.map(function(v) { return v.sepalWidth; }), item_size: 1, keep_array: true}),
        petalLength: Lux.attribute_buffer({ vertex_array: d.data.map(function(v) { return v.petalLength; }), item_size: 1, keep_array: true}),
        petalWidth:  Lux.attribute_buffer({ vertex_array: d.data.map(function(v) { return v.petalWidth; }), item_size: 1, keep_array: true}),
        species:     Lux.attribute_buffer({ vertex_array: d.data.map(function(v) { return v.species; }), item_size: 1, item_type: 'ubyte', keep_array: true}),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species']
    };
}

$().ready(function() {

    point_diameter = S.parameter("float", 10);
    stroke_width   = S.parameter("float", 2.5);
    point_alpha    = S.parameter("float", 1.0);
    Lux.UI.parameter_slider({
        element: "#pointsize",
        parameter: point_diameter,
        min: 0, 
        max: 100
    });
    Lux.UI.parameter_slider({
        element: "#pointalpha",
        parameter: point_alpha,
        min: 0,
        max: 1
    });
    Lux.UI.parameter_slider({
        element: "#strokewidth",
        parameter: stroke_width,
        min: 0,
        max: 100
    });

    gl = Lux.init({
        clearColor: [0, 0, 0, 0.2]
    });

    var data = data_buffers();

    var species_color = Shade.Colors.Brewer.qualitative({
        name: "Set1",
        alpha: point_alpha
    })(data.species);

    Lux.Scene.add(Lux.Marks.scatterplot({
        elements: data.sepalWidth.numItems,
        x: data.sepalLength,
        y: data.petalLength,
        x_scale: S.Utils.fit(data.sepalLength),
        y_scale: S.Utils.fit(data.petalLength),
        fill_color: species_color,
        stroke_color: Shade.Colors.darken(0.8)(species_color),
        stroke_width: stroke_width,
        point_diameter: point_diameter,
        mode: Lux.DrawingMode.over
    }));
});
