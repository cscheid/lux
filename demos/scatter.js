var S = Shade;

var gl;
var stroke_width;
var point_diameter;
var point_alpha;
var data;
var scatterplot_drawable;
var alive = false;

//////////////////////////////////////////////////////////////////////////////

function display()
{
    scatterplot_drawable.draw();
}

function data_buffers()
{
    var d = Data.flowers();
    return {
        sepalLength: Facet.attribute_buffer(d.flowers.map(function(v) { return v.sepalLength; }), 1),
        sepalWidth:  Facet.attribute_buffer(d.flowers.map(function(v) { return v.sepalWidth; }), 1),
        petalLength: Facet.attribute_buffer(d.flowers.map(function(v) { return v.petalLength; }), 1),
        petalWidth:  Facet.attribute_buffer(d.flowers.map(function(v) { return v.petalWidth; }), 1),
        species:     Facet.attribute_buffer(d.flowers.map(function(v) { return d.species.indexOf(v.species); }), 1, 'ubyte'),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species']
    };
}

function init_webgl()
{
    Facet.set_context(gl);
    data = data_buffers();

    point_diameter = S.uniform("float", 10);
    stroke_width   = S.uniform("float", 2.5);
    point_alpha    = S.uniform("float", 1.0);

    var species_color = S.Utils.choose(
        [S.vec(1,0,0,point_alpha),
         S.vec(0,1,0,point_alpha),
         S.vec(0,0,1,point_alpha)])(data.species);

    scatterplot_drawable = Facet.Marks.scatterplot({
        elements: data.sepalWidth.numItems,
        x: data.sepalLength,
        y: data.petalLength,
        x_scale: S.Utils.fit(data.sepalLength),
        y_scale: S.Utils.fit(data.petalLength),
        fill_color: species_color,
        stroke_color: S.mix(species_color, S.color("black"), 0.5), // mul(S.vec(0.5, 0.5, 0.5, 0.5)),
        stroke_width: stroke_width,
        point_diameter: point_diameter,
        mode: Facet.DrawingMode.over
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
    gl = Facet.init(canvas, { attributes: { alpha: true,
                                            depth: true
                                          },
                              debugging: true,
                              display: display,
                              clearColor: [0, 0, 0, 0.2]
                            });
    init_webgl();
    var start = new Date().getTime();
    var f = function () {
        if (alive) {
            window.requestAnimFrame(f, canvas);
        }
        gl.display();
    };
    f();
});
