function add_scatterplot(json)
{
    var lats = make_buffer(json, "lat"),
        lons = make_buffer(json, "lon"),
        ids = make_buffer(json, "id");
    var scale = Shade.Scale.linear(
        {domain: [Shade.vec(-180, -90), Shade.vec(180, 90)],
         range: [Shade.vec(-1, -1), Shade.vec(1, 1)]});
    var position = scale(Shade.vec(lons, lats));
    Lux.Scene.add(Lux.Marks.dots({
        position: position,
        fill_color: Shade.color("white"),
        stroke_width: 1,
        elements: json.length,
        pick_id: Shade.shade_id(ids)
    }));
}

$().ready(function () {
    Lux.init({
        clearColor: [0, 0, 0, 0.2]
    });
    Lux.Net.json("airports.json", add_scatterplot);
});

//////////////////////////////////////////////////////////////////////////////

function make_buffer(json, field) {
    return Lux.attribute_buffer({
        vertex_array: _.map(json, function(o) { return o[field]; }), 
        item_size: 1
    });
};
