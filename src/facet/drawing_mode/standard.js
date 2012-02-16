Facet.DrawingMode.standard = {
    set_draw_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
    },
    set_pick_caps: function()
    { 
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
   },
    set_unproject_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
    }
};
