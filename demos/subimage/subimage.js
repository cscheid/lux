function sphereMercatorCoords(tess)
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
        elements: elements,
        vertex: function() {
            var xf = this.texCoord.mul(2*Math.PI).add(Shade.vec(0, -Math.PI));
            var lat = xf.at(1).sinh().atan();
            var lon = xf.at(0);
            var stretch = lat.cos();
            return Shade.vec(lon.sin().mul(stretch),
                             lat.sin(),
                             lon.cos().mul(stretch), 1);
        }
    });
}


$().ready(function () {
    function drawIt() {
        var r1 = Lux.rotation(latitudeCenter * (Math.PI/180), [1, 0, 0]);
        var r2 = Lux.rotation((longitudeCenter + 180) * (Math.PI/180), [0,-1, 0]);
        var earthModel = mat4.product(r1, r2);
        var view = Lux.translation(0.0, 0.0, -6.0);
        gl.clear(gl.depthBufferBit | gl.colorBufferBit);
        mv.set(mat4.product(view, earthModel));
        proj.set(Lux.perspective(22.5 / zoom, 720/480, 4.0, 8.0));
        sphereDrawable.draw();
    };

    var canvas = document.getElementById("webgl");
    var longitudeCenter = -98;
    var latitudeCenter = 38;
    var zoom = 3;
    var prevMousePos;
    var mv = Shade.parameter("mat4");
    var proj = Shade.parameter("mat4");
    var gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,1],
        attributes: {
            alpha: true,
            depth: true
        },
        mousedown: function(event) {
            prevMousePos = [event.offsetX, event.offsetY];
        },
        mousemove: function(event) {
            if ((event.which & 1) && !event.shiftKey) {
                longitudeCenter -= (event.offsetX - prevMousePos[0]) / 
                    (3 * zoom);
                latitudeCenter  += (event.offsetY - prevMousePos[1]) / 
                    (4 * zoom);
                latitudeCenter = Math.max(Math.min(80, latitudeCenter), -80);
            }
            if ((event.which & 1) && event.shiftKey) {
                zoom *= 1.0 + (event.offsetY - prevMousePos[1]) / 240;
            }
            prevMousePos = [event.offsetX, event.offsetY];
            drawIt();
        }
    });
    gl.enable(gl.depthTest);
    gl.depthFunc(gl.LESS);
    var sphere = sphereMercatorCoords(20);
    var texture = Lux.texture({ width: 2048, height: 2048, mipmaps: false });

    for (var i=0; i<8; ++i)
    for (var j=0; j<8; ++j)
        texture.load({
            src: "http://tile.openstreetmap.org/3/" + i + "/" + j + ".png",
            crossOrigin: "anonymous",
            xOffset: i * 256,
            yOffset: 2048 - (j+1) * 256,
            onload: function() { drawIt(); }
        });

    var sphereDrawable = Lux.bake(sphere, {
        position: proj.mul(mv).mul(sphere.vertex()),
        color: Shade.texture2D(texture, sphere.texCoord)
    });
    drawIt();
});
