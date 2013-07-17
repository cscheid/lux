function add_scatterplot(json)
{
    function make_buffer(field) {
        return Lux.attribute_buffer({
            vertex_array: _.map(json, function(o) { return o[field]; }), 
            item_size: 1
        });
    };
    var lats = make_buffer("lat"),
        lons = make_buffer("lon"),
        ids = make_buffer("id");
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
