function addScatterplot(json)
{
    var lats = makeBuffer(json, "lat"),
        lons = makeBuffer(json, "lon"),
        ids = makeBuffer(json, "id");
    var dots = Lux.Marks.dots({
        position: Shade.vec(lats, lons).radians(),
        fillColor: Shade.color("white"),
        strokeWidth: 1,
        elements: json.length,
        pickId: Shade.shadeId(ids)
    });
    var scene = Lux.Scene;

    var latLonScene = Lux.Scene.Transform.Geo.latlongToMercator();
    scene.add(latLonScene);

    latLonScene.add(dots);
}

$().ready(function () {
    Lux.init();
    Lux.Net.json("airports.json", addScatterplot);
});

//////////////////////////////////////////////////////////////////////////////

function makeBuffer(json, field) {
    return Shade(Lux.attributeBuffer({
        vertexArray: _.map(json, function(o) { return o[field]; }), 
        itemSize: 1
    }));
};
