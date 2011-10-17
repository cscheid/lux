function spherical_mercator_patch(tess)
{
    var uv = [];
    var elements = [];

    for (var i=0; i<=tess; ++i)
        for (var j=0; j<=tess; ++j)
            uv.push(i/tess, j/tess);

    for (i=0; i<tess; ++i)
        for (var j=0; j<tess; ++j) {
            var ix = (tess + 1) * i + j;
            elements.push(ix, ix+1, ix+tess+2, ix, ix+tess+2, ix+tess+1);
        };

    return Facet.model({
        type: "triangles",
        uv: [uv, 2],
        elements: elements,
        vertex: function(min, max) {
            var xf = this.uv.mul(max.sub(min)).add(min);
            return Facet.Scale.Geo.mercator_to_spherical(xf.at(0), xf.at(1));
        }, transformed_uv: function(min, max) {
            return Shade.mix(min, max, this.uv).div(Math.PI * 2).add(Shade.vec(0, 0.5));
        }
    });
};

function latlong_to_mercator(lat, lon)
{
    lat = lat / (180 / Math.PI);
    lon = lon / (180 / Math.PI);
    return [lon, Math.log(1.0/Math.cos(lat) + Math.tan(lat))];
}

Facet.Marks.globe = function(opts)
{
    opts = _.defaults(opts || {}, {
        longitude_center: -98,
        latitude_center: 38,
        zoom: 3
    });

    var gl = Facet.ctx;

    var zooming = false, panning = false;
    var prev;
    var inertia_delta = [0,0];
    var min_x, max_x, min_y, max_y;
    var sphere = spherical_mercator_patch(40);
    var model_matrix = Shade.uniform("mat4");

    var texture = Facet.texture_from_image({
        width: 2048,
        height: 2048,
        TEXTURE_MAG_FILTER: gl.LINEAR,
        TEXTURE_MIN_FILTER: gl.LINEAR
    });

    min_x = Shade.uniform("float");
    max_x = Shade.uniform("float");
    min_y = Shade.uniform("float");
    max_y = Shade.uniform("float");
    var min = Shade.vec(min_x, min_y), max = Shade.vec(max_x, max_y);
    var sampler = Shade.uniform("sampler2D", texture);

    var sphere_drawable = Facet.bake(sphere, {
        gl_Position: opts.view_proj
            .mul(model_matrix)
            .mul(sphere.vertex(min, max)),
        gl_FragColor: Shade.texture2D(sampler, sphere.transformed_uv(min, max))
    });

    for (var i=0; i<8; ++i)
        for (var j=0; j<8; ++j)
            Facet.load_image_into_texture({
                texture: texture,
                src: "http://tile.openstreetmap.org/3/" +
                     i + "/" + j + ".png",
                crossOrigin: "anonymous",
                x_offset: ((i + 4) % 8)  * 256,
                y_offset: 2048 - (j+1) * 256,
                onload: function() { gl.display(); }
            });

    return {
        longitude_center: opts.longitude_center,
        latitude_center: opts.latitude_center,
        zoom: opts.zoom,
        model_matrix: model_matrix,

        mousedown: function(event) {
            prev = [event.offsetX, event.offsetY];
            inertia_delta = [0, 0];
        },

        mousemove: function(event) {
            if (event.which & 1 && !event.shiftKey) {
                panning = true;
                this.longitude_center -= (event.offsetX - prev[0]) / (3.3 * this.zoom);
                this.latitude_center += (event.offsetY - prev[1]) / (4.4 * this.zoom);
                this.latitude_center = Math.max(Math.min(80, this.latitude_center), -80);
            }
            if (event.which & 1 && event.shiftKey) {
                zooming = true;
                this.zoom *= 1.0 + (event.offsetY - prev[1]) / 240;
            }
            prev = [event.offsetX, event.offsetY];
            gl.display();
        },
        mouseup: function(event) {
            var that = this;
            if (panning) {
                inertia_delta[0] = -(event.offsetX - prev[0]) / (3.3 * that.zoom);
                inertia_delta[1] =  (event.offsetY - prev[1]) / (4.4 * that.zoom);
                prev = [event.offsetX, event.offsetY];
                var f = function() {
                    gl.display();
                    that.longitude_center += inertia_delta[0];
                    that.latitude_center  += inertia_delta[1];
                    that.latitude_center  = Math.max(Math.min(80, that.latitude_center),
                                                -80);
                    inertia_delta[0] *= 0.95;
                    inertia_delta[1] *= 0.95;
                    if (Math.max(Math.abs(inertia_delta[0]), Math.abs(inertia_delta[1])) > 0.01)
                        window.requestAnimFrame(f, that.canvas);
                };
                f();
            }
            panning = zooming = false;
        },

        draw: function() {
            while (this.longitude_center < 0)
                this.longitude_center += 360;
            while (this.longitude_center > 360)
                this.longitude_center -= 360;

            var r1 = Facet.rotation(this.latitude_center * (Math.PI/180), [ 1, 0, 0]);
            var r2 = Facet.rotation(this.longitude_center * (Math.PI/180), [ 0,-1, 0]);
            
            // gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);
            this.model_matrix.set(mat4.product(r1, r2));

            var t = latlong_to_mercator(this.latitude_center, this.longitude_center);
            var window = Math.PI * Math.min(1, 1 / (this.zoom * Math.cos(this.latitude_center / 180 * Math.PI)));

            var mn_x = (t[0] - window);
            var mx_x = (t[0] + window);
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
    };
}
