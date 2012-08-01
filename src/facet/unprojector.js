(function() {

var rb;
var depth_value;
var clear_batch;
    
Facet.Unprojector = {
    draw_unproject_scene: function(callback) {
        var ctx = Facet._globals.ctx;
        if (!rb) {
            rb = Facet.render_buffer({
                width: ctx.viewportWidth,
                height: ctx.viewportHeight,
                TEXTURE_MAG_FILTER: ctx.NEAREST,
                TEXTURE_MIN_FILTER: ctx.NEAREST
            });
        }
        // In addition to clearing the depth buffer, we need to fill
        // the color buffer with
        // the right depth value. We do it via the batch below.

        if (!clear_batch) {
            var xy = Shade(Facet.attribute_buffer({
                vertex_array: [-1, -1,   1, -1,   -1,  1,   1,  1], 
                item_size: 2}));
            var model = Facet.model({
                type: "triangle_strip",
                elements: 4,
                vertex: xy
            });
            depth_value = Shade.parameter("float");
            clear_batch = Facet.bake(model, {
                position: Shade.vec(xy, depth_value),
                color: Shade.vec(1,1,1,1)
            });
        }

        callback = callback || ctx._facet_globals.display_callback;
        var old_scene_render_mode = ctx._facet_globals.batch_render_mode;
        ctx._facet_globals.batch_render_mode = 2;
        rb.with_bound_buffer(function() {
            var old_clear_color = ctx.getParameter(ctx.COLOR_CLEAR_VALUE);
            var old_clear_depth = ctx.getParameter(ctx.DEPTH_CLEAR_VALUE);
            ctx.clearColor(old_clear_depth,
                           old_clear_depth / (1 << 8),
                           old_clear_depth / (1 << 16),
                           old_clear_depth / (1 << 24));
            ctx.clear(ctx.DEPTH_BUFFER_BIT | ctx.COLOR_BUFFER_BIT);
            try {
                callback();
            } finally {
                ctx.clearColor(old_clear_color[0],
                               old_clear_color[1],
                               old_clear_color[2],
                               old_clear_color[3]);
                ctx._facet_globals.batch_render_mode = old_scene_render_mode;
            }
        });
    },

    unproject: function(x, y) {
        var ctx = Facet._globals.ctx;
        var buf = new ArrayBuffer(4);
        var result_bytes = new Uint8Array(4);
        ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                       result_bytes);
        rb.with_bound_buffer(function() {
            ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                           result_bytes);
        });
        return result_bytes[0] / 256 + 
            result_bytes[1] / (1 << 16) + 
            result_bytes[2] / (1 << 24);
        // +  result_bytes[3] / (1 << 32);
    }
};

})();
