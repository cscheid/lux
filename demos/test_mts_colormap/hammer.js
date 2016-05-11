function sphereModel(tess)
{
    var texCoord = [];
    var elements = [];

    for (var i=0; i<=tess; ++i)
        for (var j=0; j<=tess; ++j)
            texCoord.push(i/tess, j/tess);

    for (i=0; i<tess; ++i)
        for (var j=0; j<tess; ++j) {
            var ix = (tess + 1) * i + j;
            elements.push(ix, ix+1, ix+tess+2, ix, ix+tess+2, ix+tess+1);
        };

    return Lux.model({
        type: "triangles",
        texCoord: [texCoord, 2],
        elements: elements
    });
}

$().ready(function () {
    var B = Shade.parameter("float", 2);
    $("#azimuthal").click(function() { B.set(1); Lux.Scene.invalidate(); });
    $("#hammer").click(function() { B.set(2); Lux.Scene.invalidate(); });
    $("#eckert-greifendorff").click(function() { B.set(4); Lux.Scene.invalidate(); });
    $("#siemon").click(function() { B.set(10000); Lux.Scene.invalidate(); });

    var canvas = document.getElementById("webgl");
    var width = canvas.width, height = canvas.height;
    var interactor = Lux.UI.centerZoomInteractor({
        width: width, height: height, zoom: 2/3
    });

    var gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,0.5],
        interactor: interactor
    });

    var mercatorToLatlon = Lux.Scene.Transform.Geo.mercatorToLatlong();
    var latlonToWorldspace = Lux.Scene.Transform.Geo.latlongToHammer({ B: B });

    Lux.Scene.add(latlonToWorldspace);
    latlonToWorldspace.add(mercatorToLatlon);

    var sphere = sphereModel(200);
    var texture = Lux.texture({ width: 2048, height: 2048 });

    for (var i=0; i<8; ++i)
    for (var j=0; j<8; ++j)
        texture.load({
            src: "http://tile.openstreetmap.org/3/" + i + "/" + j + ".png",
            crossOrigin: "anonymous",
            xOffset: i * 256,
            yOffset: 2048 - (j+1) * 256,
            onload: function() { Lux.Scene.invalidate(); }
        });

    var sphereActor = Lux.actor({ 
        model: sphere, 
        appearance: {
            position: sphere.texCoord.swizzle("xy").mul(2*Math.PI).sub(Math.PI),
            color: Shade.texture2D(texture, sphere.texCoord)}});

    mercatorToLatlon.add(sphereActor);
});
