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
    var dots = Lux.Marks.dots({
        position: Shade.vec(lats, lons).radians(),
        fill_color: Shade.color("white"),
        stroke_width: 1,
        elements: json.length,
        pick_id: Shade.shade_id(ids)
    });
    var scene = Lux.Scene;

    var zoom_scene = Lux.scene({transform: function(appearance) {
        appearance.position = appearance.position.div(3);
        return appearance;
    }});
    scene.add(zoom_scene);
    var lat_lon_scene = Lux.Scene.Transform.Geo.latlong_to_mercator();
    zoom_scene.add(lat_lon_scene);

    lat_lon_scene.add(dots);

    Lux.Scene.add(Lux.Marks.rectangle_brush({
        on: {
            brush_updated: function(b1, b2) { console.log(b1, b2); }
        },
        accept_event: function(event) {
            return event.shiftKey;
        }}));
}

$().ready(function () {
    Lux.init({
        // interactor: Lux.UI.center_zoom_interactor({width: 720, height: 72, zoom: 0.5}),
        clearColor: [0, 0, 0, 0.2]
    });
    Lux.Net.json("airports.json", add_scatterplot);
});
