function add_scatterplot(json)
{
    var lats = make_buffer(json, "lat"),
        lons = make_buffer(json, "lon");
    var dots = Lux.Marks.dots({
        position: Shade.vec(lats.radians(), lons.radians()),
        fill_color: Shade.color("white"),
        stroke_width: 1,
        elements: json.length
    });
    var scene = Lux.Scene;

    var lat_lon_scene = Lux.Scene.Transform.Geo.latlong_to_mercator();
    scene.add(lat_lon_scene);

    lat_lon_scene.add(dots);
}

$().ready(function () {
    Lux.init({
        interactor: Lux.UI.center_zoom_interactor({zoom: 0.3}),
        clearColor: [0, 0, 0, 0.2]
    });
    Lux.Net.json("airports.json", add_scatterplot);
});

//////////////////////////////////////////////////////////////////////////////

function make_buffer(json, field) {
    return Shade(Lux.attribute_buffer({
        vertex_array: _.map(json, function(o) { return o[field]; }), 
        item_size: 1
    }));
};

