var S = Shade;

var gl;
var stroke_width;
var point_diameter;
var point_alpha;
var data;
var splom_row, splom_col;
var alive = false;

//////////////////////////////////////////////////////////////////////////////

function data_buffers()
{
    var d = Data.flowers();
    var tt = Facet.Data.texture_table(d);
    var point_index = Facet.attribute_buffer(_.range(tt.n_rows), 1);
    
    return {
        sepalLength: tt.at(point_index, 0),
        sepalWidth:  tt.at(point_index, 1),
        petalLength: tt.at(point_index, 2),
        petalWidth:  tt.at(point_index, 3),
        species:     tt.at(point_index, 4),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species'],
        at: tt.at,
        n_rows: d.data.length,
        index: point_index,
        n_columns: 5
    };
}

function init_webgl()
{
    Facet.set_context(gl);
    data = data_buffers();

    point_diameter = S.parameter("float", 10);
    stroke_width   = S.parameter("float", 2.5);
    point_alpha    = S.parameter("float", 0.5);

    var species_color = S.Utils.choose(
        [S.vec(1, 0, 0, point_alpha),
         S.vec(0, 1, 0, point_alpha),
         S.vec(0, 0, 1, point_alpha)])(data.species);

    var min_range = S.array([4.3, 2.0, 1.0, 0.1]);
    var max_range = S.array([7.9, 4.4, 6.9, 2.5]);

    var x = S.parameter("float", 0);
    var y = S.parameter("float", 1);

    splom_col = x;
    splom_row = y;

    var min_x = splom_col.add(0.1).div(4);
    var max_x = splom_col.add(0.9).div(4);
    var min_y = splom_row.add(0.1).div(4);
    var max_y = splom_row.add(0.9).div(4);

    var scatterplot_batch = Facet.Marks.scatterplot({
        elements: data.n_rows,
        x: data.at(data.index, x),
        y: data.at(data.index, y),
        x_scale: S.Utils.linear(min_range.at(x), max_range.at(x), min_x, max_x),
        y_scale: S.Utils.linear(min_range.at(y), max_range.at(y), min_y, max_y),
        fill_color: species_color,
        stroke_color: species_color,
        point_diameter: point_diameter,
        mode: Facet.DrawingMode.over
    });

    var scale = S.Utils.linear(0, 1, -1, 1);
    var el_row = function(index) { return index.mod(4); };
    var el_col = function(index) { return index.div(4).floor(); };
    var aligned_rects = Facet.Marks.aligned_rects({
        elements: 16,
        left:   function(index) { return scale(el_col(index).add(0.05).div(4)); },
        right:  function(index) { return scale(el_col(index).add(0.95).div(4)); },
        top:    function(index) { return scale(el_row(index).add(0.95).div(4)); },
        bottom: function(index) { return scale(el_row(index).add(0.05).div(4)); },
        color:  function(index) { return Shade.vec(0,0,0,0.3); },
        z: function(index) { return 0.1; }
    });

    Facet.Scene.add({
        draw: function() {
            aligned_rects.draw();
            for (var i=0; i<4; ++i) {
                for (var j=0; j<4; ++j) {
                    splom_row.set(i);
                    splom_col.set(j);
                    scatterplot_batch.draw();
                }
            }
        }
    });
}

$().ready(function() {
    function change_pointsize() {
        var new_value = $("#pointsize").slider("value") / 10.0;
        point_diameter.set(new_value);
        gl.display();
    };
    function change_alpha() {
        var new_value = $("#pointalpha").slider("value") / 100.0;
        point_alpha.set(new_value);
        gl.display();
    };
    function change_stroke_width() {
        var new_value = $("#strokewidth").slider("value") / 10.0;
        stroke_width.set(new_value);
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
    var canvas = document.getElementById("scatterplot");
    gl = Facet.init(canvas, { 
        clearColor: [0, 0, 0, 0]
    });
    init_webgl();
});
