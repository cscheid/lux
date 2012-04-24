Facet.DrawingMode.pass = {
    set_draw_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
    },
    set_pick_caps: function()
    { 
        var ctx = Facet._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
    },
    set_unproject_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
    }
};
