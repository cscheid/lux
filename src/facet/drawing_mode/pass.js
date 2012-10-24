/*
 * Facet.DrawingMode.pass is used whenever depth testing needs to be off;
 * 
 * Facet.DrawingMode.pass disables *writing* to the depth test as well
 * 
 */

Facet.DrawingMode.pass = {
    set_draw_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
        ctx.disable(ctx.BLEND);
    },
    set_pick_caps: function()
    { 
        var ctx = Facet._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
        ctx.disable(ctx.BLEND);
    },
    set_unproject_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
        ctx.disable(ctx.BLEND);
    }
};
