(function() {

var active = false;
var rb;

Facet.picker = {
    is_active: function() {
        return active;        
    },
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

        active = true;
        try {
            if (callback) {
                rb.render_to_buffer(callback);
            } else {
                rb.render_to_buffer(function() {
                    ctx.clearColor(0,0,0,0);
                    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
                    ctx._globals.display_callback();
                });
            }
        } finally {
            active = false;
        }
    },
    pick_pixel: function(x, y) {
        var ctx = Facet._globals.ctx;
        var buf = new ArrayBuffer(4);
        var result_bytes = new Int8Array(buf);
        var result_words = new Uint32Array(buf);
        rb.render_to_buffer(function() {
            ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                           result_bytes);
        });
        return result_words[0];
    }
};

})();
