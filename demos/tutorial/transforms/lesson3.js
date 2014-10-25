function addScatterplot(json)
{
    var lats = makeBuffer(json, "lat"),
        lons = makeBuffer(json, "lon");
    var dots = Lux.Marks.dots({
        position: Shade.vec(lats.radians(), lons.radians()),
        fillColor: Shade.color("white"),
        strokeWidth: 1,
        elements: json.length
    });
    var scene = Lux.Scene;

    var latLonScene = Lux.Scene.Transform.Geo.latlongToMercator();
    scene.add(latLonScene);

    latLonScene.add(dots);
}

$().ready(function () {
    Lux.init({
        interactor: Lux.UI.centerZoomInteractor({zoom: 0.3}),
        clearColor: [0, 0, 0, 0.2]
    });
    Lux.Net.json("airports.json", addScatterplot);
});

//////////////////////////////////////////////////////////////////////////////

function makeBuffer(json, field) {
    return Shade(Lux.attributeBuffer({
        vertexArray: _.map(json, function(o) { return o[field]; }), 
        itemSize: 1
    }));
};

