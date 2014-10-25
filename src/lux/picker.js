(function() {

var rb;

Lux.Picker = {
    drawPickScene: function(callback) {
        var ctx = Lux._globals.ctx;
        if (!rb) {
            rb = Lux.renderBuffer({
                width: ctx.viewportWidth,
                height: ctx.viewportHeight,
                magFilter: ctx.NEAREST,
                minFilter: ctx.NEAREST
            });
        }

        callback = callback || function() { Lux._globals.ctx._luxGlobals.scene.draw(); };
        var oldSceneRenderMode = ctx._luxGlobals.batchRenderMode;
        ctx._luxGlobals.batchRenderMode = 1;
        try {
            rb.withBoundBuffer(callback);
        } finally {
            ctx._luxGlobals.batchRenderMode = oldSceneRenderMode;
        }
    },
    pick: function(x, y) {
        var ctx = Lux._globals.ctx;
        var buf = new ArrayBuffer(4);
        var resultBytes = new Uint8Array(4);
        rb.withBoundBuffer(function() {
            ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                           resultBytes);
        });
        var resultWords = new Uint32Array(resultBytes.buffer);
        return resultWords[0];
    }
};

})();
