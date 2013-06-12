function sphere_coords(tess, B)
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
        elements: elements,
        vertex: function() {
            var xf = this.tex_coord.mul(2*Math.PI).add(Shade.vec(0, -Math.PI));
            var lat = xf.at(1).sinh().atan();
            var lon = xf.at(0);
            var phi = lat, lambda = lon.sub(Math.PI);

            var eta = phi.cos().mul(lambda.div(B).cos()).add(1).sqrt();
            var x = B.mul(Math.sqrt(2)).mul(phi.cos()).mul(lambda.div(B).sin()).div(eta);
            var y = phi.sin().mul(Math.sqrt(2)).div(eta);

            return Shade.vec(x, y, 0, 1);
        }
    });
}

$().ready(function () {
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

    var B = Shade.parameter("float", 2);

    $("#azimuthal").click(function() { B.set(1); Lux.Scene.invalidate(); });
    $("#hammer").click(function() { B.set(2); Lux.Scene.invalidate(); });
    $("#eckert-greifendorff").click(function() { B.set(4); Lux.Scene.invalidate(); });
    $("#siemon").click(function() { B.set(10000); Lux.Scene.invalidate(); });

    var sphere = sphere_coords(200, B);
    var texture = Lux.texture({ width: 2048, height: 2048, mipmaps: false });

    for (var i=0; i<8; ++i)
    for (var j=0; j<8; ++j)
        texture.load({
            src: "http://tile.openstreetmap.org/3/" + i + "/" + j + ".png",
            crossOrigin: "anonymous",
            x_offset: i * 256,
            y_offset: 2048 - (j+1) * 256,
            onload: function() { gl.display(); }
        });

    var c = Shade.texture2D(texture, sphere.tex_coord);
    var sphere_drawable = Lux.bake(sphere, {
        position: interactor.project(sphere.vertex()),
        color: Shade.vec(c.swizzle("rgb").div(c.a()), 1)
    });
    Lux.Scene.add(sphere_drawable);
});
