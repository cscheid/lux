var gl;
var sphere_drawable;
var mv;
var proj;
var longitude_center = -98;
var latitude_center = 38;
var zoom = 3;
var texture;
var min_x, max_x, min_y, max_y;
var sampler;
var light_ambient = Shade.vec(0.2, 0.2, 0.2, 1.0);
var light_diffuse = Shade.color('white');
var light_position = Shade.vec(0, 0, 2);

var mat_ambient = Shade.vec(0.2, 0.2, 0.2, 1);

//////////////////////////////////////////////////////////////////////////////

function spherical_mercator_patch(tess)
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

    return Facet.model({
        type: "triangles",
        tex_coord: [tex_coord, 2],
        elements: elements,
        vertex: function(min, max) {
            var xf = this.tex_coord.mul(max.sub(min)).add(min);
            return mercator_to_spherical(xf.at(0), xf.at(1));
        }, transformed_tex_coord: function(min, max) {
            return Shade.mix(min, max, this.tex_coord).div(Math.PI * 2).add(Shade.vec(0, 0.5));
        }
    });
}

function latlong_to_mercator(lat, lon)
{
    lat = lat / (180 / Math.PI);
    lon = lon / (180 / Math.PI);
    return [lon, Math.log(1.0/Math.cos(lat) + Math.tan(lat))];
}

function mercator_to_spherical(x, y)
{
    var lat = y.sinh().atan();
    var lon = x;
    
    var stretch = lat.cos();
    return Shade.vec(x.sin().mul(stretch),
                     lat.sin(),
                     x.cos().mul(stretch), 1);
}

function draw_it()
{
    if (longitude_center < 0) longitude_center += 360;
    if (longitude_center > 360) longitude_center -= 360;

    var r1 = Facet.rotation(latitude_center * (Math.PI/180), [ 1, 0, 0]);
    var r2 = Facet.rotation((longitude_center + 180) * (Math.PI/180), [ 0,-1, 0]);
    var earth_model = mat4.product(r1, r2);
    var view       = Facet.translation(0.0, 0.0, -6.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    mv.set(mat4.product(view, earth_model));
    proj.set(Facet.perspective(20 / zoom, 720/480, 0.1, 100.0));

    var t = latlong_to_mercator(latitude_center, longitude_center);
    var window = Math.PI * Math.min(1, 1 / (zoom * Math.cos(latitude_center / 180 * Math.PI)));

    var mn_x = (t[0] + Math.PI - window);
    var mx_x = (t[0] + Math.PI + window);
    while (mn_x > Math.PI * 2) {
        mn_x -= Math.PI * 2;
        mx_x -= Math.PI * 2;
    }

    min_y.set(t[1] - window);
    max_y.set(t[1] + window);

    if (mn_x < 0) {
        min_x.set(mn_x + Math.PI*2);
        max_x.set(Math.PI*2);
        sphere_drawable.draw();

        min_x.set(0);
        max_x.set(mx_x);
        sphere_drawable.draw();
    } else if (mx_x > Math.PI*2) {
        min_x.set(mn_x);
        max_x.set(Math.PI*2);
        sphere_drawable.draw();

        min_x.set(0);
        max_x.set(mx_x - Math.PI*2);
        sphere_drawable.draw();
    } else {
        min_x.set(mn_x);
        max_x.set(mx_x);
        sphere_drawable.draw();
    }
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var zooming = false, panning = false;
    var prev;
    var inertia_delta = [0,0];
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,1],
        display: draw_it,
        attributes:
        {
            alpha: true,
            depth: true
        },
        mousedown: function(event) {
            prev = [event.offsetX, event.offsetY];
            inertia_delta = [0, 0];
        },
        mousemove: function(event) {
            if (event.which & 1 && !event.shiftKey) {
                panning = true;
                longitude_center -= (event.offsetX - prev[0]) / (3.3 * zoom);
                latitude_center += (event.offsetY - prev[1]) / (4.4 * zoom);
                latitude_center = Math.max(Math.min(80, latitude_center), -80);
            }
            if (event.which & 1 && event.shiftKey) {
                zooming = true;
                zoom *= 1.0 + (event.offsetY - prev[1]) / 240;
            }
            prev = [event.offsetX, event.offsetY];
            gl.display();
        },
        mouseup: function(event) {
            if (panning) {
                inertia_delta[0] = -(event.offsetX - prev[0]) / (3.3 * zoom);
                inertia_delta[1] =  (event.offsetY - prev[1]) / (4.4 * zoom);
                prev = [event.offsetX, event.offsetY];
                var f = function() {
                    gl.display();
                    longitude_center += inertia_delta[0];
                    latitude_center  += inertia_delta[1];
                    latitude_center  = Math.max(Math.min(80, latitude_center),
                                                -80);
                    inertia_delta[0] *= 0.95;
                    inertia_delta[1] *= 0.95;
                    if (Math.max(Math.abs(inertia_delta[0]), Math.abs(inertia_delta[1])) > 0.01)
                        window.requestAnimFrame(f, canvas);
                };
                f();
            }
            panning = zooming = false;
        }
    });
    var sphere = spherical_mercator_patch(40);

    mv = Shade.parameter("mat4");
    proj = Shade.parameter("mat4");

    texture = Facet.texture({
        width: 2048,
        height: 2048,
        mag_filter: gl.LINEAR,
        min_filter: gl.LINEAR
    });

    for (var i=0; i<8; ++i)
        for (var j=0; j<8; ++j)
            Facet.load_image_into_texture({
                texture: texture,
                src: "http://tile.openstreetmap.org/3/" +
                     i + "/" + j + ".png",
                crossOrigin: "anonymous",
                x_offset: i * 256,
                y_offset: 2048 - (j+1) * 256,
                onload: function() { gl.display(); }
            });

    sampler = Shade.parameter("sampler2D");
    sampler.set(texture);

    min_x = Shade.parameter("float");
    max_x = Shade.parameter("float");
    min_y = Shade.parameter("float");
    max_y = Shade.parameter("float");
    var min = Shade.vec(min_x, min_y), max = Shade.vec(max_x, max_y);

    sphere_drawable = Facet.bake(sphere, {
        position: proj.mul(mv).mul(sphere.vertex(min, max)),
        color: Shade.texture2D(sampler, sphere.transformed_tex_coord(min, max))
    });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle = elapsed / 20;
    };
    f();
    gl.display();
});
