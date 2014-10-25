Lux.DrawingMode.standard = {
    setDrawCaps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.disable(ctx.BLEND);
    },
    setPickCaps: function()
    { 
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.disable(ctx.BLEND);
    },
    setUnprojectCaps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.disable(ctx.BLEND);
    }
};
