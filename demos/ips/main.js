var attributes, values;

function change(n) {
    values.set(attributes[n]);
    Lux.Scene.invalidate();
}

$().ready(function() {
    var interactor = Lux.UI.center_zoom_interactor({ 
        width: 720, 
        height: 480
    });
    var gl = Lux.init({ interactor: interactor, clearColor: [0,0,0,0.1] });
    Lux.Net.json("ips.json", function(data) {
        var xs = _.map(data.xs, function(x) { return x / 65536; }),
            ys = _.map(data.ys, function(x) { return x / 65536; });

        interactor.center.set(vec.make([xs[0], ys[0]]));
        interactor.zoom.set(500);
        var x = Lux.attribute_buffer({ vertex_array: xs, item_size: 1 });
        var y = Lux.attribute_buffer({ vertex_array: ys, item_size: 1 });
        var c1 = Lux.attribute_buffer({ vertex_array: data.vs[10], item_size: 1 });
        var color_map = Shade.Colors.Brewer.sequential({
            name: 'Oranges',
            min: 0,
            max: 50
        });
        attributes = data.vs;
        values = c1;
        var color = color_map(c1);
        var actor = Lux.Marks.dots({
            position: Shade.vec(x, y),
            elements: data.xs.length,
            fill_color: color,
            stroke_color: color,
            point_diameter: Shade.max(4, interactor.zoom.div(180))
        });
        Lux.Scene.add(actor);
    });
    Lux.Scene.invalidate();
    $("#foo").click(function() { 
        change(Number($("#field").val()));
    });
    Lux.UI.parameter_slider({
        element: "#slider",
        min: 1,
        max: 50,
        slide: function(elt, p, v) {
            change(Math.round(v));
            $("#which").text(Math.round(v));
        }
    });
});
