(function() {

var rb;

Facet.Picker = {
    draw_pick_scene: function(callback) {
        var ctx = Facet._globals.ctx;
        if (!rb) {
            rb = Facet.render_buffer({
                width: ctx.viewportWidth,
                height: ctx.viewportHeight,
                mag_filter: ctx.NEAREST,
                min_filter: ctx.NEAREST
            });
        }

        callback = callback || ctx._facet_globals.display_callback;
        var old_scene_render_mode = ctx._facet_globals.batch_render_mode;
        ctx._facet_globals.batch_render_mode = 1;
        try {
            rb.with_bound_buffer(function() {
                ctx.clearColor(0,0,0,0);
                ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
                callback();
            });
        } finally {
            ctx._facet_globals.batch_render_mode = old_scene_render_mode;
        }
    },
    pick: function(x, y) {
        var ctx = Facet._globals.ctx;
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
