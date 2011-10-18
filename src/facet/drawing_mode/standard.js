Facet.DrawingMode.standard = {
    set_caps: function()
    {
        var ctx = Facet.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
    }
};
