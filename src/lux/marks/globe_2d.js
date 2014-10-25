Lux.Marks.globe2d = function(opts)
{
    opts = _.defaults(opts || {}, {
        zoom: 3,
        resolutionBias: -1,
        patchSize: 10,
        cacheSize: 3, // 3: 64 images; 4: 256 images.
        tilePattern: function(zoom, x, y) {
            return "http://tile.openstreetmap.org/"+zoom+"/"+x+"/"+y+".png";
        },
        camera: function(v) { return v; },
        debug: false, // if true, add outline and x-y-zoom marker to every tile
        noNetwork: false, // if true, tile is always blank white and does no HTTP requests.
        postProcess: function(c) { return c; }
    });

    var hasInteractor = false, getCenterZoom;
    if (opts.interactor) {
        hasInteractor = true;
        getCenterZoom = function() {
            return [opts.interactor.center.get()[0], 
                    opts.interactor.center.get()[1], 
                    opts.interactor.zoom.get()];
        };
    }
    if (opts.noNetwork) {
        opts.debug = true; // noNetwork implies debug;
    }

    var patch = Lux.model({
        type: "triangles",
        uv: [[0,0,1,0,1,1,0,0,1,1,0,1], 2],
        vertex: function(min, max) {
            return this.uv.mul(max.sub(min)).add(min);
        }
    });
    var cacheSize = 1 << (2 * opts.cacheSize);
    var tileSize = 256;
    var tilesPerLine  = 1 << (~~Math.round(Math.log(Math.sqrt(cacheSize))/Math.log(2)));
    var superTileSize = tileSize * tilesPerLine;

    var ctx = Lux._globals.ctx;
    var texture = Lux.texture({
        mipmaps: false,
        width: superTileSize,
        height: superTileSize
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

    var minX = Shade.parameter("float");
    var maxX = Shade.parameter("float");
    var minY = Shade.parameter("float");
    var maxY = Shade.parameter("float");
    var offsetX = Shade.parameter("float");
    var offsetY = Shade.parameter("float");
    var textureScale = 1.0 / tilesPerLine;
    var sampler = Shade.parameter("sampler2D");

    var v = patch.vertex(Shade.vec(minX, minY), Shade.vec(maxX, maxY));

    var xformedPatch = patch.uv 
    // These two lines work around the texture seams on the texture atlas
        .mul((tileSize-1.0)/tileSize)
        .add(0.5/tileSize)
    //
        .add(Shade.vec(offsetX, offsetY))
        .mul(textureScale)
    ;

    var tileActor = Lux.actor({
        model: patch, 
        appearance: {
            position: opts.camera(v),
            color: opts.postProcess(Shade.texture2D(sampler, xformedPatch)),
            mode: Lux.DrawingMode.pass }});

    if (Lux.typeOf(opts.zoom) === "number") {
        opts.zoom = Shade.parameter("float", opts.zoom);
    } else if (Lux.isShadeExpression(opts.zoom) !== "parameter") {
        throw new Error("zoom must be either a number or a parameter");
    }

    var unproject;

    var result = {
        tiles: tiles,
        queue: [],
        currentOsmZoom: 0,
        latLonPosition: Lux.Marks.globe2d.latLonToTileMercator,
        resolutionBias: opts.resolutionBias,
        newCenter: function() {
            // ctx.viewport* here is bad...
            // var mn = unproject(vec.make([0, 0]));
            // var mx = unproject(vec.make([ctx.viewportWidth, ctx.viewportHeight]));
            var t = getCenterZoom();
            var centerX = t[0];
            var centerY = t[1];
            var centerZoom = t[2]; // opts.zoom.get();

            var screenResolutionBias = Math.log(ctx.viewportHeight / 256) / Math.log(2);
            var zoom = this.resolutionBias + screenResolutionBias + (Math.log(centerZoom) / Math.log(2));
            zoom = ~~zoom;
            this.currentOsmZoom = zoom;
            var y = centerY * (1 << zoom);
            var x = centerX * (1 << zoom);
            y = (1 << zoom) - y - 1;

            for (var i=-2; i<=2; ++i) {
                for (var j=-2; j<=2; ++j) {
                    var rx = ~~x + i;
                    var ry = ~~y + j;
                    if (ry < 0 || ry >= (1 << zoom))
                        continue;
                    if (rx < 0)
                        continue;
                    if (rx >= (1 << zoom))
                        continue;
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
                    throw new Error("Internal Error in globe2d");
                }
                d[k] = true;
            }
        },
        request: function(x, y, zoom) {
            var that = this;
            var id = this.getAvailableId(x, y, zoom);
            if (id === -1) {
                console.log("Could not fulfill request " + x + " " + y + " " + zoom);
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
                    that.tiles[id].lastTouched = Date.now();
                    // uncomment this during debugging
                    // that.sanityCheck();
                    Lux.Scene.invalidate();
                };
            };
            var xform = opts.debug ? function(image) {
                var c = document.createElement("canvas");
                c.setAttribute("width", image.width);
                c.setAttribute("height", image.height);
                var ctx = c.getContext('2d');
                ctx.drawImage(image, 0, 0);
                ctx.font = "12pt Helvetica Neue";
                ctx.fillStyle = "black";
                ctx.fillText(zoom + " " + x + " " + y + " ", 10, 250);
                ctx.lineWidth = 3;
                ctx.strokeStyle = "black";
                ctx.strokeRect(0, 0, 256, 256);
                return c;
            } : function(image) { return image; };
            var obj = {
                transformImage: xform,
                crossOrigin: "anonymous",
                xOffset: tiles[id].offsetX * tileSize,
                yOffset: tiles[id].offsetY * tileSize,
                onload: f(x, y, zoom, id)
            };
            if (opts.noNetwork) {
                if (!Lux._globals.blankGlobe2dImage) {
                    var c = document.createElement("canvas");
                    c.setAttribute("width", 256);
                    c.setAttribute("height", 256);
                    var ctx = c.getContext('2d');
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, 256, 256);
                    Lux._globals.blankGlobe2dImage = c;
                }
                obj.canvas = Lux._globals.blankGlobe2dImage;
            } else {
                obj.src = opts.tilePattern(zoom, x, y);
            }
            tiles[id].texture.load(obj);
        },
        dress: function(scene) {
            var tileBatch = tileActor.dress(scene);
            var xf = scene.getTransform().inverse;
            if (!hasInteractor) {
                getCenterZoom = function() {
                    var p1 = unproject(vec.make([0, 0]));
                    var p2 = unproject(vec.make([1, 1]));
                    var zoom = 1.0/(p2[1] - p1[1]);
                    return [p1[0], p1[1], zoom];
                };
                unproject = Shade(function(p) {
                    return xf({position: p}).position;
                }).jsEvaluate;
            }
            var that = this;
            return {
                draw: function() {
                    that.newCenter();
                    var lst = _.range(cacheSize);
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
                        var z = (1 << t.zoom);
                        minX.set(t.x / z);
                        minY.set(1 - (t.y + 1) / z);
                        maxX.set((t.x + 1) / z);
                        maxY.set(1 - t.y / z);
                        offsetX.set(t.offsetX);
                        offsetY.set(t.offsetY);
                        tileBatch.draw();
                    }
                }
            };
        },
        on: function() { return true; }
    };
    result.init();

    return result;
};

Lux.Marks.globe2d.scene = function(opts)
{
    opts = _.clone(opts || {});
    opts.transform = function(appearance) {
        if (_.isUndefined(appearance.position))
            return appearance;
        appearance = _.clone(appearance);
        var lat = appearance.position.x();
        var lon = appearance.position.y();
        appearance.position = Lux.Marks.globe2d.latLonToTileMercator(lat, lon);
        return appearance;
    };
    return Lux.scene(opts);
};

Lux.Marks.globe2d.latLonToTileMercator = Shade(function(lat, lon) {
    return Shade.Scale.Geo.latlongToMercator(lat, lon).div(Math.PI * 2).add(Shade.vec(0.5,0.5));
});

// Lux.Marks.globe2d.transform = function(appearance) {
//     var newAppearance = _.clone(appearance);
//     newAppearance.position = Shade.vec(Lux.Marks.globe2d.latLonToTileMercator(
//         appearance.position.x(),
//         appearance.position.y()), appearance.position.swizzle("xw"));
//     return newAppearance;
// };

// Lux.Marks.globe2d.transform.inverse = function() { throw new Error("unimplemented"); };
