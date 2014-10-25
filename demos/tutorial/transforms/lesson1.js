function create(json)
{
    var lats = makeBuffer(json, "lat"),
        lons = makeBuffer(json, "lon");
    var scale = Shade.Scale.linear(
        {domain: [Shade.vec(-180, -90), Shade.vec(180, 90)],
         range: [Shade.vec(-1, -1), Shade.vec(1, 1)]});
    var position = scale(Shade.vec(lons, lats));
    Lux.Scene.add(Lux.Marks.dots({
        position: position,
        fillColor: Shade.color("white"),
        strokeWidth: 1,
        elements: json.length
    }));
}

$().ready(function () {
    Lux.init({clearColor: [0,0,0,0.2]});
    Lux.Net.json("airports.json", create);
});

//////////////////////////////////////////////////////////////////////////////

function makeBuffer(json, field) {
    return Shade(Lux.attributeBuffer({
        vertexArray: _.map(json, function(o) { return o[field]; }), 
        itemSize: 1
    }));
};
