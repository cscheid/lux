var S = Shade;

var gl;
var stroke_width;
var point_diameter;
var point_alpha;
var data;
var tour_batch;

var axis_1_parameters, axis_2_parameters;

//////////////////////////////////////////////////////////////////////////////

function data_buffers()
{
    var d = Data.flowers();
    var result = {};
    var fields = ["sepalLength", "sepalWidth", "petalLength", "petalWidth", "species"];
    _.each(fields, function(field) {
        result[field] = Lux.attribute_buffer({
            vertex_array: d.data.map(function(v) { return v[field]; }),
            item_size: 1,
            keep_array: true
        });
    });
    result.columns = fields;
    return result;
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
    data = data_buffers();

    point_diameter = S.parameter("float", 10);
    stroke_width   = S.parameter("float", 2.5);
    point_alpha    = S.parameter("float", 1.0);

    axis_1_parameters = [];
    axis_2_parameters = [];
    var column_min, column_max, column_center = [];
    var xy_expression = Shade.vec(0, 0),
        xy_center = Shade.vec(0, 0),
        xy_distance = Shade.vec(0, 0);

    for (var i=0; i<4; ++i) {
        var this_column = data[data.columns[i]];
        axis_1_parameters.push(Shade.parameter("float"));
        axis_2_parameters.push(Shade.parameter("float"));
        var axes = Shade.vec(axis_1_parameters[i], axis_2_parameters[i]);
        column_min = _.min(this_column.array);
        column_max = _.max(this_column.array);
        column_center = (column_max + column_min) / 2;
        xy_expression = xy_expression.add(axes.mul(this_column));
        xy_center = xy_center.add(axes.mul(column_center));
        xy_distance = xy_distance.add(axes.mul(column_center - column_min).abs());
    };

    var species_color = Shade.Colors.Brewer.qualitative({
        name: "Set1"
    })(data.species);

    Lux.Scene.add(Lux.Marks.scatterplot({
        elements: data.sepalWidth.numItems,
        xy: xy_expression,
        xy_scale: S.Scale.linear({ domain: [xy_center.sub(xy_distance),
                                            xy_center.add(xy_distance)],
                                   range: [S.vec(0,0), 
                                           S.vec(1,1)] }),
        fill_color: S.vec(species_color.swizzle("rgb"), point_alpha),
        stroke_color: S.vec(S.mix(Shade.color("black"), species_color, 0.5).swizzle("rgb"), point_alpha),
        stroke_width: stroke_width,
        point_diameter: point_diameter
    }));
}

$().ready(function() {
    function change_pointsize() {
        var new_value = $("#pointsize").slider("value") / 10.0;
        point_diameter.set(new_value);
        Lux.Scene.invalidate();
    };
    function change_alpha() {
        var new_value = $("#pointalpha").slider("value") / 100.0;
        point_alpha.set(new_value);
        Lux.Scene.invalidate();
    };
    function change_stroke_width() {
        var new_value = $("#strokewidth").slider("value") / 10.0;
        stroke_width.set(new_value);
        Lux.Scene.invalidate();
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
    gl = Lux.init({clearColor:[0,0,0,0.1]});
    init_webgl();
    var frame_1 = random_2d_frame(4);
    var frame_2 = random_2d_frame(4);
    var start = new Date().getTime();
    var prev_u = 1;
    Lux.Scene.animate(function () {
        var elapsed = (new Date().getTime() - start) / 1000;
        var u = elapsed/3;
        u -= Math.floor(u);
        if (u < prev_u) {
            frame_1 = frame_2;
            frame_2 = random_2d_frame(4);
        }
        prev_u = u;
        for (var i=0; i<4; ++i) {
            axis_1_parameters[i].set(u*frame_2[0][i] + (1-u) * frame_1[0][i]);
            axis_2_parameters[i].set(u*frame_2[1][i] + (1-u) * frame_1[1][i]);
        }
    });
});
