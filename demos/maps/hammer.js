function sphere_model(tess)
{
    var tex_coord = [];
    var elements = [];

    for (var i=0; i<=tess; ++i)
        for (var j=0; j<=tess; ++j)
            tex_coord.push(i/tess, j/tess);

    for (i=0; i<tess; ++i)
        for (var j=0; j<tess; ++j) {
            var ix = (tess + 1) * i + j;
            elements.push(ix, ix+1, ix+tess+2, ix, ix+tess+2, ix+tess+1);
        };

    return Lux.model({
        type: "triangles",
        tex_coord: [tex_coord, 2],
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
    var interactor = Lux.UI.center_zoom_interactor({
        width: width, height: height, zoom: 2/3
    });

    var gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,0.5],
        interactor: interactor
    });

    var mercator_to_latlon = Lux.Scene.Transform.Geo.mercator_to_latlong();
    var latlon_to_worldspace = Lux.Scene.Transform.Geo.latlong_to_hammer({ B: B });

    Lux.Scene.add(latlon_to_worldspace);
    latlon_to_worldspace.add(mercator_to_latlon);

    var sphere = sphere_model(200);
    var texture = Lux.texture({ width: 2048, height: 2048 });

    for (var i=0; i<8; ++i)
    for (var j=0; j<8; ++j)
        texture.load({
            src: "http://tile.openstreetmap.org/3/" + i + "/" + j + ".png",
            crossOrigin: "anonymous",
            x_offset: i * 256,
            y_offset: 2048 - (j+1) * 256,
            onload: function() { Lux.Scene.invalidate(); }
        });

    var sphere_actor = Lux.actor({ 
        model: sphere, 
        appearance: {
            position: sphere.tex_coord.swizzle("xy"),
            color: Shade.texture2D(texture, sphere.tex_coord)}});

    mercator_to_latlon.add(sphere_actor);
});
