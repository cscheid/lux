(function() {

function sphericalMercatorPatch(tess)
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
            return Shade.Scale.Geo.mercatorToSpherical(xf.at(0), xf.at(1));
        },
        transformedUv: function(min, max) {
            return Shade.mix(min, max, this.uv).div(Math.PI * 2).add(Shade.vec(0, 0.5));
        }
    });
}

function latlongToMercator(lat, lon)
{
    lat = lat / (180 / Math.PI);
    lon = lon / (180 / Math.PI);
    return [lon, Math.log(1.0/Math.cos(lat) + Math.tan(lat))];
}

Lux.Marks.globe = function(opts)
{
    opts = _.defaults(opts || {}, {
        longitudeCenter: -98,
        latitudeCenter: 38,
        zoom: 3,
        resolutionBias: 0,
        patchSize: 10,
        cacheSize: 3,
        tilePattern: function(zoom, x, y) {
            return "http://tile.openstreetmap.org/"+zoom+"/"+x+"/"+y+".png";
        }
    });
    var model = Shade.parameter("mat4");
    var patch = sphericalMercatorPatch(opts.patchSize);
    var cacheSize = 1 << (2 * opts.cacheSize); // cache size must be (2^n)^2
    var tileSize = 256;
    var tilesPerLine  = 1 << (~~Math.round(Math.log(Math.sqrt(cacheSize))/Math.log(2)));
    var superTileSize = tileSize * tilesPerLine;

    var ctx = Lux._globals.ctx;
    var texture = Lux.texture({
        width: superTileSize,
        height: superTileSize,
        mipmaps: false
    });

    function newTile(i) {
        var x = i % tilesPerLine;
        var y = ~~(i / tilesPerLine);
        return {
            texture: texture,
            offsetX: x,
            offsetY: y,
            // 0: inactive,
            // 1: mid-request,
            // 2: ready to draw.
            active: 0,
            x: -1,
            y: -1,
            zoom: -1,
            lastTouched: 0
        };
    };

    var tiles = [];
    for (var i=0; i<cacheSize; ++i) {
        tiles.push(newTile(i));
    };

    var zooming = false, panning = false;
    var prev = [0,0];
    var inertia = 1;
    var moveVec = [0,0];

    // FIXME for some reason, sometimes mouseup is preceded by a quick mousemove,
    // even when apparently no mouse movement was detected. This extra tick
    // throws my inertial browsing off. We work around by keeping the
    // second-to-last tick.

    var lastMoves = [0,0];
    function logMove() {
        lastMoves[1] = lastMoves[0];
        lastMoves[0] = new Date().getTime();
    }

    var minX = Shade.parameter("float");
    var maxX = Shade.parameter("float");
    var minY = Shade.parameter("float");
    var maxY = Shade.parameter("float");
    var offsetX = Shade.parameter("float");
    var offsetY = Shade.parameter("float");
    var textureScale = 1.0 / tilesPerLine;
    var sampler = Shade.parameter("sampler2D");

    var v = patch.vertex(Shade.vec(minX, minY), 
                         Shade.vec(maxX, maxY));

    var xformedPatch = patch.uv 
    // These two lines work around the texture seams on the texture atlas
        .mul((tileSize-1.0)/tileSize)
        .add(0.5/tileSize)
    //
        .add(Shade.vec(offsetX, offsetY))
        .mul(textureScale)
    ;

    var sphereActor = Lux.actor({
        model: patch, 
        appearance: {
            position: model(v),
            color: Shade.texture2D(sampler, xformedPatch).discardIf(model.mul(v).z().lt(0)),
            polygonOffset: opts.polygonOffset
        }});

    function inertiaTick() {
        var f = function() {
            Lux.Scene.invalidate();
            result.longitudeCenter += moveVec[0] * inertia;
            result.latitudeCenter  += moveVec[1] * inertia;
            result.latitudeCenter  = Math.max(Math.min(80, result.latitudeCenter), -80);
            result.updateModelMatrix();
            if (inertia > 0.01)
                window.requestAnimationFrame(f, result.canvas);
            inertia *= 0.95;
        };
        f();
    }

    if (Lux.typeOf(opts.zoom) === "number") {
        opts.zoom = Shade.parameter("float", opts.zoom);
    } else if (Lux.isShadeExpression(opts.zoom) !== "parameter") {
        throw new Error("zoom must be either a number or a parameter");
    }
    var foo = Shade.parameter("vec4");

    var result = {
        tiles: tiles,
        queue: [],
        currentOsmZoom: 3,
        longitudeCenter: opts.longitudeCenter,
        latitudeCenter: opts.latitudeCenter,
        zoom: opts.zoom,
        modelMatrix: model,
        // latLonPosition: function(lat, lon) {
        //     return model(Shade.Scale.Geo.latlongToSpherical(lat, lon));
        // },
        resolutionBias: opts.resolutionBias,
        updateModelMatrix: function() {
            while (this.longitudeCenter < 0)
                this.longitudeCenter += 360;
            while (this.longitudeCenter > 360)
                this.longitudeCenter -= 360;
            var r1 = Lux.rotation(this.latitudeCenter * (Math.PI/180), [ 1, 0, 0]);
            var r2 = Lux.rotation(this.longitudeCenter * (Math.PI/180), [ 0,-1, 0]);
            this.modelMatrix.set(mat4.product(r1, r2));
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
            var wDivider = 218.18;
            var hDivider = 109.09;
            var zoom = this.zoom.get();

            if ((event.which & 1) && !event.shiftKey) {
                panning = true;
                moveVec[0] = -(event.offsetX - prev[0]) / (w * zoom / wDivider);
                moveVec[1] =  (event.offsetY - prev[1]) / (h * zoom / hDivider);
                prev[0] = event.offsetX;
                prev[1] = event.offsetY;
                logMove();
                this.longitudeCenter += moveVec[0];
                this.latitudeCenter += moveVec[1];
                this.latitudeCenter = Math.max(Math.min(80, this.latitudeCenter), -80);
                this.updateModelMatrix();
                Lux.Scene.invalidate();
            }
            if (event.which & 1 && event.shiftKey) {
                zooming = true;
                var newZoom = this.zoom.get() * (1.0 + (event.offsetY - prev[1]) / 240);
                this.zoom.set(Math.max(newZoom, 0.5));
                Lux.Scene.invalidate();
            }
            this.newCenter(this.latitudeCenter, this.longitudeCenter, this.zoom.get());
            prev[0] = event.offsetX;
            prev[1] = event.offsetY;
        },
        mouseup: function(event) {
            var w = ctx.viewportWidth;
            var h = ctx.viewportHeight;
            var wDivider = 218.18;
            var hDivider = 109.09;
            var now = Date.now();
            // assume 16.66 ms per tick,
            inertia = Math.pow(0.95, (now - lastMoves[1]) / 16.666);
            if (panning)
                inertiaTick();
            panning = zooming = false;
        },
        newCenter: function(centerLat, centerLon, centerZoom) {
            var w = ctx.viewportWidth;
            var zoomDivider = 63.6396;
            var baseZoom = Math.log(w / zoomDivider) / Math.log(2);

            var zoom = this.resolutionBias + baseZoom + (Math.log(centerZoom / 2.6) / Math.log(2));
            zoom = ~~zoom;
            this.currentOsmZoom = zoom;
            var lst = latlongToMercator(centerLat, centerLon);
            var y = (lst[1] / (Math.PI * 2) + 0.5) * (1 << zoom);
            var x = lst[0] / (Math.PI * 2) * (1 << zoom);
            // var y = (centerLat + 90) / 180 * (1 << zoom);
            // var x = centerLon / 360 * (1 << zoom);
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
        getAvailableId: function(x, y, zoom) {
            // easy cases first: return available tile or a cache hit
            var now = Date.now();
            for (var i=0; i<cacheSize; ++i) {
                if (this.tiles[i].x == x &&
                    this.tiles[i].y == y &&
                    this.tiles[i].zoom == zoom &&
                    this.tiles[i].active != 0) {
                    this.tiles[i].lastTouched = now;
                    return i;
                }
            }
            for (i=0; i<cacheSize; ++i) {
                if (!this.tiles[i].active) {
                    this.tiles[i].lastTouched = now;
                    return i;
                }
            }
            // now we need to bump someone out. who?
            var worstIndex = -1;
            var worstTime = 1e30;
            for (i=0; i<cacheSize; ++i) {
                if (this.tiles[i].active == 1)
                    // don't use this one, it's getting bumped out
                    continue;
                var score = this.tiles[i].lastTouched;
                if (score < worstTime) {
                    worstTime = score;
                    worstIndex = i;
                }
            }
            return worstIndex;
        },
        init: function() {
            for (var z=0; z<3; ++z)
                for (var i=0; i<(1 << z); ++i)
                    for (var j=0; j<(1 << z); ++j)
                        this.request(i, j, z);
            this.newCenter(this.latitudeCenter, this.longitudeCenter, this.zoom.get());
            this.updateModelMatrix();
        },
        sanityCheck: function() {
            var d = {};
            for (var i=0; i<cacheSize; ++i) {
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
            var id = this.getAvailableId(x, y, zoom);
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
                    that.tiles[id].lastTouched = new Date().getTime();
                    // uncomment this during debugging
                    // that.sanityCheck();
                    Lux.Scene.invalidate();
                };
            };
            texture: tiles[id].texture.load({
                src: opts.tilePattern(zoom, x, y),
                crossOrigin: "anonymous",
                xOffset: tiles[id].offsetX * tileSize,
                yOffset: tiles[id].offsetY * tileSize,
                onload: f(x, y, zoom, id)
            });
        },
        scene: function(opts) {
            opts = _.clone(opts || {});
            opts.transform = function(appearance) {
                if (_.isUndefined(appearance.position))
                    return appearance;
                appearance = _.clone(appearance);
                var lat = appearance.position.x();
                var lon = appearance.position.y();
                appearance.position = model(Shade.Scale.Geo.latlongToSpherical(lat, lon));
                return appearance;
            };
            return Lux.scene(opts);
        },
        dress: function(scene) {
            var sphereBatch = sphereActor.dress(scene);
            return {
                draw: function() {
                    var lst = _.range(cacheSize);
                    var that = this;
                    lst.sort(function(id1, id2) { 
                        var g1 = Math.abs(tiles[id1].zoom - that.currentOsmZoom);
                        var g2 = Math.abs(tiles[id2].zoom - that.currentOsmZoom);
                        return g2 - g1;
                    });

                    sampler.set(texture);
                    for (var i=0; i<cacheSize; ++i) {
                        var t = tiles[lst[i]];
                        if (t.active !== 2)
                            continue;
                        minX.set((t.x / (1 << t.zoom))           * Math.PI*2 + Math.PI);
                        minY.set((1 - (t.y + 1) / (1 << t.zoom)) * Math.PI*2 - Math.PI);
                        maxX.set(((t.x + 1) / (1 << t.zoom))     * Math.PI*2 + Math.PI);
                        maxY.set((1 - t.y / (1 << t.zoom))       * Math.PI*2 - Math.PI);
                        offsetX.set(t.offsetX);
                        offsetY.set(t.offsetY);
                        sphereBatch.draw();
                    }
                }
            };
        },
        on: function() { return true; }
    };
    result.init();

    return result;
};

})();
