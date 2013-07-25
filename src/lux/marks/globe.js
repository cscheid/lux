function spherical_mercator_patch(tess)
{
    var uv = [];
    var elements = [];
    var i, j;

    for (i=0; i<=tess; ++i)
        for (j=0; j<=tess; ++j)
            uv.push(i/tess, j/tess);

    for (i=0; i<tess; ++i)
        for (j=0; j<tess; ++j) {
            var ix = (tess + 1) * i + j;
            elements.push(ix, ix+1, ix+tess+2, ix, ix+tess+2, ix+tess+1);
        }

    return Lux.model({
        type: "triangles",
        uv: [uv, 2],
        elements: elements,
        vertex: function(min, max) {
            var xf = this.uv.mul(max.sub(min)).add(min);
            return Shade.Scale.Geo.mercator_to_spherical(xf.at(0), xf.at(1));
        },
        transformed_uv: function(min, max) {
            return Shade.mix(min, max, this.uv).div(Math.PI * 2).add(Shade.vec(0, 0.5));
        }
    });
}

function latlong_to_mercator(lat, lon)
{
    lat = lat / (180 / Math.PI);
    lon = lon / (180 / Math.PI);
    return [lon, Math.log(1.0/Math.cos(lat) + Math.tan(lat))];
}

Lux.Marks.globe = function(opts)
{
    opts = _.defaults(opts || {}, {
        longitude_center: -98,
        latitude_center: 38,
        zoom: 3,
        resolution_bias: 0,
        patch_size: 10,
        tile_pattern: function(zoom, x, y) {
            return "http://tile.openstreetmap.org/"+zoom+"/"+x+"/"+y+".png";
        }
    });
    var model = Shade.parameter("mat4");
    var patch = spherical_mercator_patch(opts.patch_size);
    var cache_size = 64; // cache size must be (2^n)^2
    var tile_size = 256;
    var tiles_per_line  = 1 << (~~Math.round(Math.log(Math.sqrt(cache_size))/Math.log(2)));
    var super_tile_size = tile_size * tiles_per_line;

    var ctx = Lux._globals.ctx;
    var texture = Lux.texture({
        width: super_tile_size,
        height: super_tile_size
    });

    function new_tile(i) {
        var x = i % tiles_per_line;
        var y = ~~(i / tiles_per_line);
        return {
            texture: texture,
            offset_x: x,
            offset_y: y,
            // 0: inactive,
            // 1: mid-request,
            // 2: ready to draw.
            active: 0,
            x: -1,
            y: -1,
            zoom: -1,
            last_touched: 0
        };
    };

    var tiles = [];
    for (var i=0; i<cache_size; ++i) {
        tiles.push(new_tile(i));
    };

    var zooming = false, panning = false;
    var prev = [0,0];
    var inertia = 1;
    var move_vec = [0,0];

    // FIXME for some reason, sometimes mouseup is preceded by a quick mousemove,
    // even when apparently no mouse movement was detected. This extra tick
    // throws my inertial browsing off. We work around by keeping the
    // second-to-last tick.

    var last_moves = [0,0];
    function log_move() {
        last_moves[1] = last_moves[0];
        last_moves[0] = new Date().getTime();
    }

    var min_x = Shade.parameter("float");
    var max_x = Shade.parameter("float");
    var min_y = Shade.parameter("float");
    var max_y = Shade.parameter("float");
    var offset_x = Shade.parameter("float");
    var offset_y = Shade.parameter("float");
    var texture_scale = 1.0 / tiles_per_line;
    var sampler = Shade.parameter("sampler2D");

    var v = patch.vertex(Shade.vec(min_x, min_y), 
                         Shade.vec(max_x, max_y));
    var mvp = opts.view_proj(model);

    var xformed_patch = patch.uv 
    // These two lines work around the texture seams on the texture atlas
        .mul((tile_size-1.0)/tile_size)
        .add(0.5/tile_size)
    //
        .add(Shade.vec(offset_x, offset_y))
        .mul(texture_scale)
    ;

    var sphere_actor = Lux.actor({
        model: patch, 
        appearance: {
            gl_Position: Shade.ThreeD.cull_backface(mvp(v)),
            gl_FragColor: Shade.texture2D(sampler, xformed_patch).discard_if(model.mul(v).z().lt(0)),
            mode: Lux.DrawingMode.pass
        }});

    function inertia_tick() {
        var f = function() {
            Lux.Scene.invalidate();
            result.longitude_center += move_vec[0] * inertia;
            result.latitude_center  += move_vec[1] * inertia;
            result.latitude_center  = Math.max(Math.min(80, result.latitude_center), -80);
            result.update_model_matrix();
            if (inertia > 0.01)
                window.requestAnimFrame(f, result.canvas);
            inertia *= 0.95;
        };
        f();
    }

    if (lux_typeOf(opts.zoom) === "number") {
        opts.zoom = Shade.parameter("float", opts.zoom);
    } else if (Lux.is_shade_expression(opts.zoom) !== "parameter") {
        throw new Error("zoom must be either a number or a parameter");
    }

    var result = {
        tiles: tiles,
        queue: [],
        current_osm_zoom: 3,
        longitude_center: opts.longitude_center,
        latitude_center: opts.latitude_center,
        zoom: opts.zoom,
        model_matrix: model,
        mvp: mvp,
        lat_lon_position: function(lat, lon) {
            return mvp(Shade.Scale.Geo.latlong_to_spherical(lat, lon));
        },
        resolution_bias: opts.resolution_bias,
        update_model_matrix: function() {
            while (this.longitude_center < 0)
                this.longitude_center += 360;
            while (this.longitude_center > 360)
                this.longitude_center -= 360;
            var r1 = Lux.rotation(this.latitude_center * (Math.PI/180), [ 1, 0, 0]);
            var r2 = Lux.rotation(this.longitude_center * (Math.PI/180), [ 0,-1, 0]);
            this.model_matrix.set(mat4.product(r1, r2));
        },
        mousedown: function(event) {
            prev[0] = event.offsetX;
            prev[1] = event.offsetY;
            inertia = 0;
            Lux.Scene.invalidate();
        },
        mousemove: function(event) {
            var w = ctx.viewportWidth;
            var h = ctx.viewportHeight;
            var w_divider = 218.18;
            var h_divider = 109.09;
            var zoom = this.zoom.get();

            if ((event.which & 1) && !event.shiftKey) {
                panning = true;
                move_vec[0] = -(event.offsetX - prev[0]) / (w * zoom / w_divider);
                move_vec[1] =  (event.offsetY - prev[1]) / (h * zoom / h_divider);
                prev[0] = event.offsetX;
                prev[1] = event.offsetY;
                log_move();
                this.longitude_center += move_vec[0];
                this.latitude_center += move_vec[1];
                this.latitude_center = Math.max(Math.min(80, this.latitude_center), -80);
                this.update_model_matrix();
                Lux.Scene.invalidate();
            }
            if (event.which & 1 && event.shiftKey) {
                zooming = true;
                var new_zoom = this.zoom.get() * (1.0 + (event.offsetY - prev[1]) / 240);
                this.zoom.set(Math.max(new_zoom, 0.5));
                Lux.Scene.invalidate();
            }
            this.new_center(this.latitude_center, this.longitude_center, this.zoom.get());
            prev[0] = event.offsetX;
            prev[1] = event.offsetY;
        },
        mouseup: function(event) {
            var w = ctx.viewportWidth;
            var h = ctx.viewportHeight;
            var w_divider = 218.18;
            var h_divider = 109.09;
            var now = Date.now();
            // assume 16.66 ms per tick,
            inertia = Math.pow(0.95, (now - last_moves[1]) / 16.666);
            if (panning)
                inertia_tick();
            panning = zooming = false;
        },
        new_center: function(center_lat, center_lon, center_zoom) {
            var w = ctx.viewportWidth;
            var zoom_divider = 63.6396;
            var base_zoom = Math.log(w / zoom_divider) / Math.log(2);

            var zoom = this.resolution_bias + base_zoom + (Math.log(center_zoom / 2.6) / Math.log(2));
            zoom = ~~zoom;
            this.current_osm_zoom = zoom;
            var lst = latlong_to_mercator(center_lat, center_lon);
            var y = (lst[1] / (Math.PI * 2) + 0.5) * (1 << zoom);
            var x = lst[0] / (Math.PI * 2) * (1 << zoom);
            // var y = (center_lat + 90) / 180 * (1 << zoom);
            // var x = center_lon / 360 * (1 << zoom);
            y = (1 << zoom) - y - 1;
            x = (x + (1 << (zoom - 1))) & ((1 << zoom) - 1);

            for (var i=-2; i<=2; ++i) {
                for (var j=-2; j<=2; ++j) {
                    var rx = ~~x + i;
                    var ry = ~~y + j;
                    if (ry < 0 || ry >= (1 << zoom))
                        continue;
                    if (rx < 0)
                        rx += 1 << zoom;
                    if (rx >= (1 << zoom))
                        rx -= 1 << zoom;
                    this.request(rx, ry, ~~zoom);
                }
            }
        },
        get_available_id: function(x, y, zoom) {
            // easy cases first: return available tile or a cache hit
            var now = Date.now();
            for (var i=0; i<cache_size; ++i) {
                if (this.tiles[i].x == x &&
                    this.tiles[i].y == y &&
                    this.tiles[i].zoom == zoom &&
                    this.tiles[i].active != 0) {
                    this.tiles[i].last_touched = now;
                    return i;
                }
            }
            for (i=0; i<cache_size; ++i) {
                if (!this.tiles[i].active) {
                    this.tiles[i].last_touched = now;
                    return i;
                }
            }
            // now we need to bump someone out. who?
            var worst_index = -1;
            var worst_time = 1e30;
            for (i=0; i<cache_size; ++i) {
                if (this.tiles[i].active == 1)
                    // don't use this one, it's getting bumped out
                    continue;
                var score = this.tiles[i].last_touched;
                if (score < worst_time) {
                    worst_time = score;
                    worst_index = i;
                }
            }
            return worst_index;
        },
        init: function() {
            for (var z=0; z<3; ++z)
                for (var i=0; i<(1 << z); ++i)
                    for (var j=0; j<(1 << z); ++j)
                        this.request(i, j, z);
            this.new_center(this.latitude_center, this.longitude_center, this.zoom.get());
            this.update_model_matrix();
        },
        sanity_check: function() {
            var d = {};
            for (var i=0; i<cache_size; ++i) {
                $("#x" + i).text(this.tiles[i].x);
                $("#y" + i).text(this.tiles[i].y);
                $("#z" + i).text(this.tiles[i].zoom);
                if (this.tiles[i].active !== 2)
                    continue;
                var k = this.tiles[i].x + "-" +
                    this.tiles[i].y + "-" +
                    this.tiles[i].zoom;
                if (d[k] !== undefined) {
                    console.log("BAD STATE!", 
                                this.tiles[i].x, this.tiles[i].y, this.tiles[i].zoom, 
                                this.tiles[i].active,
                                k);                    
                    throw new Error("Internal Error in globe");
                }
                d[k] = true;
            }
        },
        request: function(x, y, zoom) {
            var that = this;
            var id = this.get_available_id(x, y, zoom);
            if (id === -1) {
                alert("Could not fulfill request " + x + " " + y + " " + zoom);
                return;
            }
            if (this.tiles[id].x == x && 
                this.tiles[id].y == y && 
                this.tiles[id].zoom == zoom) {
                return;
            }

            that.tiles[id].x = x;
            that.tiles[id].y = y;
            that.tiles[id].zoom = zoom;
            this.tiles[id].active = 1;
            var f = function(x, y, zoom, id) {
                return function() {
                    that.tiles[id].active = 2;
                    that.tiles[id].last_touched = new Date().getTime();
                    // uncomment this during debugging
                    // that.sanity_check();
                    Lux.Scene.invalidate();
                };
            };
            texture: tiles[id].texture.load({
                src: opts.tile_pattern(zoom, x, y),
                crossOrigin: "anonymous",
                x_offset: tiles[id].offset_x * tile_size,
                y_offset: tiles[id].offset_y * tile_size,
                onload: f(x, y, zoom, id)
            });
        },
        dress: function(scene) {
            var sphere_batch = sphere_actor.dress(scene);
            return {
                draw: function() {
                    var lst = _.range(cache_size);
                    var that = this;
                    lst.sort(function(id1, id2) { 
                        var g1 = Math.abs(tiles[id1].zoom - that.current_osm_zoom);
                        var g2 = Math.abs(tiles[id2].zoom - that.current_osm_zoom);
                        return g2 - g1;
                    });

                    sampler.set(texture);
                    for (var i=0; i<cache_size; ++i) {
                        var t = tiles[lst[i]];
                        if (t.active !== 2)
                            continue;
                        min_x.set((t.x / (1 << t.zoom))           * Math.PI*2 + Math.PI);
                        min_y.set((1 - (t.y + 1) / (1 << t.zoom)) * Math.PI*2 - Math.PI);
                        max_x.set(((t.x + 1) / (1 << t.zoom))     * Math.PI*2 + Math.PI);
                        max_y.set((1 - t.y / (1 << t.zoom))       * Math.PI*2 - Math.PI);
                        offset_x.set(t.offset_x);
                        offset_y.set(t.offset_y);
                        sphere_batch.draw();
                    }
                }
            };
        },
        on: function() { return true; }
    };
    result.init();

    return result;
};
