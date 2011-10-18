// over corresponds to the standard porter-duff over operator
Facet.DrawingMode.over = {
    set_caps: function()
    {
        var ctx = Facet.ctx;
        ctx.enable(ctx.BLEND);
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, 
                              ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
    }
};
