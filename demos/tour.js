var S = Shade;

var gl;
var stroke_width;
var point_diameter;
var point_alpha;
var data;
var tour_batch;
var alive = true;
var axis_1_uniforms, axis_2_uniforms;

//////////////////////////////////////////////////////////////////////////////

function display()
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearDepth(1.0);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    tour_batch.draw();
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

function random_2d_frame(dimension)
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
        return random_2d_frame(dimension);
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
        return random_2d_frame(dimension);
    for (i=0; i<dimension; ++i) {
        v2[i] /= l;
    }
    return [v1, v2];
}

function init_webgl()
{
    Facet.set_context(gl);
    data = data_buffers();

    point_diameter = S.uniform("float", 10);
    stroke_width   = S.uniform("float", 2.5);
    point_alpha    = S.uniform("float", 1.0);

    axis_1_uniforms = [];
    axis_2_uniforms = [];
    var column_min, column_max, column_center = [];
    var xy_expression = Shade.vec(0, 0),
        xy_center = Shade.vec(0, 0),
        xy_distance = Shade.vec(0, 0);

    for (var i=0; i<4; ++i) {
        var this_column = data[data.columns[i]];
        axis_1_uniforms.push(Shade.uniform("float"));
        axis_2_uniforms.push(Shade.uniform("float"));
        var axes = Shade.vec(axis_1_uniforms[i], axis_2_uniforms[i]);
        column_min = _.min(this_column.array);
        column_max = _.max(this_column.array);
        column_center = (column_max + column_min) / 2;
        xy_expression = xy_expression.add(axes.mul(this_column));
        xy_center = xy_center.add(axes.mul(column_center));
        xy_distance = xy_distance.add(axes.mul(column_center - column_min).abs());
    };

    var species_color = S.Utils.choose(
        [S.vec(1,0,0,point_alpha),
         S.vec(0,1,0,point_alpha),
         S.vec(0,0,1,point_alpha)])(data.species);

    tour_batch = Facet.Marks.scatterplot({
        elements: data.sepalWidth.numItems,
        xy: xy_expression,
        xy_scale: S.Utils.linear(xy_center.sub(xy_distance),
                                 xy_center.add(xy_distance),
                                 S.vec(0,0), 
                                 S.vec(1,1)),
        fill_color: species_color,
        stroke_color: S.mix(Shade.color("black"), species_color, 0.5),
        stroke_width: stroke_width,
        point_diameter: point_diameter
    });
}

$().ready(function() {
    function change_pointsize() {
        var new_value = $("#pointsize").slider("value") / 10.0;
        point_diameter.set(new_value);
        display();
    };
    function change_alpha() {
        var new_value = $("#pointalpha").slider("value") / 100.0;
        point_alpha.set(new_value);
        display();
    };
    function change_stroke_width() {
        var new_value = $("#strokewidth").slider("value") / 10.0;
        stroke_width.set(new_value);
        display();
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
                                           }
                             });
    init_webgl();
    var frame_1 = random_2d_frame(4);
    var frame_2 = random_2d_frame(4);
    var start = new Date().getTime();
    var prev_u = 1;
    var f = function () {
        var elapsed = (new Date().getTime() - start) / 1000;
        var u = elapsed/3;
        u -= Math.floor(u);
        if (u < prev_u) {
            frame_1 = frame_2;
            frame_2 = random_2d_frame(4);
        }
        prev_u = u;
        for (var i=0; i<4; ++i) {
            axis_1_uniforms[i].set(u*frame_2[0][i] + (1-u) * frame_1[0][i]);
            axis_2_uniforms[i].set(u*frame_2[1][i] + (1-u) * frame_1[1][i]);
        }
        if (alive) {
            window.requestAnimFrame(f, canvas);
        }
        display();
    };
    f();
});
