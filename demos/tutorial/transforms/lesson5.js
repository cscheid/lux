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
        position: Shade.vec(lats, lons),
        fill_color: Shade.color("white"),
        stroke_width: 1,
        elements: json.length,
        pick_id: Shade.shade_id(ids)
    });
    var scene = Lux.Scene;
    var lat_lon_scene = Lux.Scene.Transform.Geo.latlong_to_mercator();
    var degrees_scene = Lux.scene({ transform: deg2rad });

    scene.add(lat_lon_scene);
    lat_lon_scene.add(degrees_scene);
    degrees_scene.add(dots);

    degrees_scene.add(Lux.Marks.rectangle_brush({
        on: {
            brush_updated: function(b1, b2) { console.log(b1, b2); }
        },
        accept_event: function(event) {
            return event.shiftKey;
        }}));
}

$().ready(function () {
    Lux.init({
        interactor: Lux.UI.center_zoom_interactor({width: 720, height: 720, zoom: 0.5}),
        clearColor: [0, 0, 0, 0.2]
    });
    Lux.Net.json("airports.json", add_scatterplot);
});

//////////////////////////////////////////////////////////////////////////////
// transformation spec

function deg2rad(appearance) {
    appearance = _.clone(appearance);
    appearance.position = Shade.radians(appearance.position);
    return appearance;
}
function rad2deg(appearance) {
    appearance = _.clone(appearance);
    appearance.position = Shade.degrees(appearance.position);
    return appearance;
}
deg2rad.inverse = rad2deg;
rad2deg.inverse = deg2rad;
