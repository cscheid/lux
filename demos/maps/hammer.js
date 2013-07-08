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

// converts tile-based mercator (x,y in [0,1]*[-inf,inf]) to 
// radian-based latlon (lat in [-pi/2, pi/2], lon in [-pi, pi])
function mercator_to_latlon_scene(opts)
{
    opts = _.clone(opts || {});
    opts.transform = function(appearance) {
        appearance = _.clone(appearance);
        var pos = appearance.position.mul(2*Math.PI).add(Shade.vec(-Math.PI, -Math.PI));
        var lat = pos.at(1).sinh().atan();
        var lon = pos.at(0);
        var out = Shade.vec(lat, lon);
        if (pos.type.equals(Shade.Types.vec2))
            appearance.position = out;
        else if (pos.type.equals(Shade.Types.vec3))
            appearance.position = Shade.vec(out, pos.at(2));
        else if (pos.type.equals(Shade.Types.vec4))
            appearance.position = Shade.vec(out, pos.swizzle("zw"));
        return appearance;
    };
    return Lux.scene(opts);
}

// projects radian-based latlon (lat in [-pi/2, pi/2], lon in [-pi, pi])
// to a Hammer-like projection (Hammer when B=2, other projections for different B)
function hammer_scene(opts)
{
    var B = Shade.parameter("float", 2);
    opts = _.clone(opts || {});
    opts.transform = function(appearance) {
        appearance = _.clone(appearance);
        var pos = appearance.position;
        var phi = pos.at(0), lambda = pos.at(1);

        var eta = phi.cos().mul(lambda.div(B).cos()).add(1).sqrt();
        var x = B.mul(Math.sqrt(2)).mul(phi.cos()).mul(lambda.div(B).sin()).div(eta);
        var y = phi.sin().mul(Math.sqrt(2)).div(eta);
        var out = Shade.vec(x, y);

        if (pos.type.equals(Shade.Types.vec2))
            appearance.position = out;
        else if (pos.type.equals(Shade.Types.vec3))
            appearance.position = Shade.vec(out, pos.at(2));
        else if (pos.type.equals(Shade.Types.vec4))
            appearance.position = Shade.vec(out, pos.swizzle("zw"));
        return appearance;
    };
    var scene = Lux.scene(opts);
    scene.B = B;
    return scene;
}

$().ready(function () {
    var B;
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

    var mercator_to_latlon = mercator_to_latlon_scene();
    var latlon_to_worldspace = hammer_scene();
    B = latlon_to_worldspace.B;

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
