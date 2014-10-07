Lux.DrawingMode.multiplicative = {
    set_draw_caps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.DST_COLOR, ctx.ZERO);
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(false);
    },
    set_pick_caps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(false);
    },
    set_unproject_caps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(false);
    }
};