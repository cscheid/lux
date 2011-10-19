(function() {

var rb;

Facet.Picker = {
    picking_mode: 0,
    draw_pick_scene: function(callback) {
        var ctx = Facet._globals.ctx;
        if (!rb) {
            rb = Facet.render_buffer({
                width: ctx.viewportWidth,
                height: ctx.viewportHeight,
                TEXTURE_MAG_FILTER: ctx.NEAREST,
                TEXTURE_MIN_FILTER: ctx.NEAREST
            });
        }

        callback = callback || Facet._globals.display_callback;
        this.picking_mode = 1;
        try {
            rb.render_to_buffer(function() {
                ctx.clearColor(0,0,0,0);
                ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
                callback();
            });
        } finally {
            this.picking_mode = 0;
        }
    },
    pick: function(x, y) {
        var ctx = Facet._globals.ctx;
        var buf = new ArrayBuffer(4);
        var result_bytes = new Uint8Array(4);
        ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                       result_bytes);
        rb.render_to_buffer(function() {
            ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                           result_bytes);
        });
        var result_words = new Uint32Array(result_bytes.buffer);
        return result_words[0];
    }
};

})();
