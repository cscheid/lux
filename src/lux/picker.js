(function() {

var rb;

Lux.Picker = {
    draw_pick_scene: function(callback) {
        var ctx = Lux._globals.ctx;
        if (!rb) {
            rb = Lux.render_buffer({
                width: ctx.viewportWidth,
                height: ctx.viewportHeight,
                mag_filter: ctx.NEAREST,
                min_filter: ctx.NEAREST
            });
        }

        callback = callback || function() { Lux._globals.ctx._luxGlobals.scene.draw(); };
        var old_scene_render_mode = ctx._luxGlobals.batchRenderMode;
        ctx._luxGlobals.batchRenderMode = 1;
        try {
            rb.with_bound_buffer(callback);
        } finally {
            ctx._luxGlobals.batchRenderMode = old_scene_render_mode;
        }
    },
    pick: function(x, y) {
        var ctx = Lux._globals.ctx;
        var buf = new ArrayBuffer(4);
        var result_bytes = new Uint8Array(4);
        rb.with_bound_buffer(function() {
            ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                           result_bytes);
        });
        var result_words = new Uint32Array(result_bytes.buffer);
        return result_words[0];
    }
};

})();
