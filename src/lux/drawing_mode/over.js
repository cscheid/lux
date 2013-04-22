// over is the standard porter-duff over operator

// NB: since over is associative but not commutative, we need
// back-to-front rendering for correct results,
// and then the depth buffer is not necessary. 
// 
// In the case of incorrect behavior (that is, when contents are not
// rendered back-to-front), it is not clear which of the two incorrect 
// behaviors is preferable:
// 
// 1. that depth buffer writing be enabled, and some things which should
// be rendered "behind" alpha-blended simply disappear (this gets
// worse the more transparent objects get)
//
// 2. that depth buffer writing be disabled, and some things which would be
// entirely occluded by others simply appear (this gets worse the more opaque
// objects get)
//
// These two behaviors correspond respectively to 
// Lux.DrawingMode.over_with_depth and Lux.DrawingMode.over

Lux.DrawingMode.over = {
    set_draw_caps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.BLEND);
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, 
                              ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
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

Lux.DrawingMode.over_with_depth = {
    set_draw_caps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.BLEND);
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, 
                              ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LEQUAL);
    },
    set_pick_caps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LEQUAL);
    },
    set_unproject_caps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LEQUAL);
    }
};

Lux.DrawingMode.over_no_depth = {
    set_draw_caps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.enable(ctx.BLEND);
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, 
                              ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
    },
    set_pick_caps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
    },
    set_unproject_caps: function()
    {
        var ctx = Lux._globals.ctx;
        ctx.disable(ctx.DEPTH_TEST);
        ctx.depthMask(false);
    }
};
