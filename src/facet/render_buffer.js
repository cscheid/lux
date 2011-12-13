Facet.render_buffer = function(opts)
{
    var ctx = Facet._globals.ctx;
    var rttFramebuffer = ctx.createFramebuffer();
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, rttFramebuffer);
    opts = _.defaults(opts || {}, {
        width: 512,
        height: 512
    });
    rttFramebuffer.width  =  opts.width;
    rttFramebuffer.height = opts.height;

    var rttTexture = ctx.createTexture();
    rttTexture._shade_type = 'texture';
    ctx.bindTexture(ctx.TEXTURE_2D, rttTexture);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, opts.TEXTURE_MAG_FILTER || ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, opts.TEXTURE_MIN_FILTER || ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, opts.TEXTURE_WRAP_S || ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, opts.TEXTURE_WRAP_T || ctx.CLAMP_TO_EDGE);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);

    var renderbuffer = ctx.createRenderbuffer();
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, renderbuffer);
    ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

    ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, rttTexture, 0);
    ctx.framebufferRenderbuffer(ctx.FRAMEBUFFER, ctx.DEPTH_ATTACHMENT, ctx.RENDERBUFFER, renderbuffer);

    var status = ctx.checkFramebufferStatus(ctx.FRAMEBUFFER);
    switch (status) {
        case ctx.FRAMEBUFFER_COMPLETE:
            break;
        case ctx.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
            break;
        case ctx.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
            break;
        case ctx.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
            break;
        case ctx.FRAMEBUFFER_UNSUPPORTED:
            throw("Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED");
            break;
        default:
            throw("Incomplete framebuffer: " + status);
    }

    ctx.bindTexture(ctx.TEXTURE_2D, null);
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);

    return {
        _shade_type: 'render_buffer',
        texture: rttTexture,
        width: rttFramebuffer.width,
        height: rttFramebuffer.height,
        frame_buffer: rttFramebuffer,
        render_to_buffer: function (render) {
            try {
                ctx.bindFramebuffer(ctx.FRAMEBUFFER, rttFramebuffer);
                ctx.viewport(0, 0, rttFramebuffer.width, rttFramebuffer.height);
                render();
            } finally {
                ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
            }
        },
        make_screen_batch: function (with_texel_at_uv) {
            var sq = Facet.Models.square();
            return Facet.bake(sq, {
                position: Shade.vec(sq.vertex.mul(2).sub(Shade.vec(1, 1)), 0, 1),
                color: with_texel_at_uv(Shade.texture2D(rttTexture, sq.tex_coord), sq.tex_coord)
            });
        }
    };
};
