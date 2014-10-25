(function() {

var rb;
var depthValue;
var clearBatch;
    
Lux.Unprojector = {
    drawUnprojectScene: function(callback) {
        var ctx = Lux._globals.ctx;
        if (!rb) {
            rb = Lux.renderBuffer({
                width: ctx.viewportWidth,
                height: ctx.viewportHeight,
                textureMagFilter: ctx.NEAREST,
                textureMinFilter: ctx.NEAREST
            });
        }
        // In addition to clearing the depth buffer, we need to fill
        // the color buffer with
        // the right depth value. We do it via the batch below.

        if (!clearBatch) {
            var xy = Shade(Lux.attributeBuffer({
                vertexArray: [-1, -1,   1, -1,   -1,  1,   1,  1], 
                itemSize: 2}));
            var model = Lux.model({
                type: "triangleStrip",
                elements: 4,
                vertex: xy
            });
            depthValue = Shade.parameter("float");
            clearBatch = Lux.bake(model, {
                position: Shade.vec(xy, depthValue),
                color: Shade.vec(1,1,1,1)
            });
        }

        callback = callback || ctx._luxGlobals.displayCallback;
        var oldSceneRenderMode = ctx._luxGlobals.batchRenderMode;
        ctx._luxGlobals.batchRenderMode = 2;
        rb.withBoundBuffer(function() {
            var oldClearColor = ctx.getParameter(ctx.COLOR_CLEAR_VALUE);
            var oldClearDepth = ctx.getParameter(ctx.DEPTH_CLEAR_VALUE);
            ctx.clearColor(oldClearDepth,
                           oldClearDepth / (1 << 8),
                           oldClearDepth / (1 << 16),
                           oldClearDepth / (1 << 24));
            ctx.clear(ctx.DEPTH_BUFFER_BIT | ctx.COLOR_BUFFER_BIT);
            try {
                callback();
            } finally {
                ctx.clearColor(oldClearColor[0],
                               oldClearColor[1],
                               oldClearColor[2],
                               oldClearColor[3]);
                ctx._luxGlobals.batchRenderMode = oldSceneRenderMode;
            }
        });
    },

    unproject: function(x, y) {
        var ctx = Lux._globals.ctx;
        var buf = new ArrayBuffer(4);
        var resultBytes = new Uint8Array(4);
        ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                       resultBytes);
        rb.withBoundBuffer(function() {
            ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                           resultBytes);
        });
        return resultBytes[0] / 256 + 
            resultBytes[1] / (1 << 16) + 
            resultBytes[2] / (1 << 24);
        // +  resultBytes[3] / (1 << 32);
    }
};

})();
