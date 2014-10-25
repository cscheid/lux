/*
 * Lux.DrawingMode.pass is used whenever depth testing needs to be off;
 * 
 * Lux.DrawingMode.pass disables *writing* to the depth test as well
 * 
 */

Lux.DrawingMode.pass = {
    setDrawCaps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
        ctx.disable(ctx.BLEND);
    },
    setPickCaps: function()
    { 
        var ctx = Lux._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
        ctx.disable(ctx.BLEND);
    },
    setUnprojectCaps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
        ctx.disable(ctx.BLEND);
    }
};
