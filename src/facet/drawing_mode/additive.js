Facet.DrawingMode.additive = {
    set_caps: function()
    {
        var ctx = Facet.ctx;
        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
    }
};
