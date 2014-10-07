Lux.render_buffer = function(opts)
{
    opts = _.defaults(opts || {}, {
        context: Lux._globals.ctx,
        width: 512,
        height: 512,
        mag_filter: Lux.texture.linear,
        min_filter: Lux.texture.linear,
        mipmaps: false,
        max_anisotropy: 1,
        wrap_s: Lux.texture.clamp_to_edge,
        wrap_t: Lux.texture.clamp_to_edge,
        clearColor: [0,0,0,1],
        clearDepth: 1.0
    });
    var ctx = opts.context;
    var frame_buffer = ctx.createFramebuffer();

    // Weird:
    // http://www.khronos.org/registry/gles/specs/2.0/es_full_spec_2.0.25.pdf
    // Page 118
    // 
    // Seems unenforced in my implementations of WebGL, even though 
    // the WebGL spec defers to GLSL ES spec.
    // 
    // if (opts.width != opts.height)
    //     throw new Error("renderbuffers must be square (blame GLSL ES!)");

    var rttTexture = Lux.texture(opts);

    frame_buffer.init = function(width, height) {
        Lux.setContext(ctx);
        this.width  = opts.width;
        this.height = opts.height;
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, this);
        var renderbuffer = ctx.createRenderbuffer();
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, renderbuffer);
        ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH_COMPONENT16, this.width, this.height);

        ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, rttTexture, 0);
        ctx.framebufferRenderbuffer(ctx.FRAMEBUFFER, ctx.DEPTH_ATTACHMENT, ctx.RENDERBUFFER, renderbuffer);
        var status = ctx.checkFramebufferStatus(ctx.FRAMEBUFFER);
        try {
            switch (status) {
            case ctx.FRAMEBUFFER_COMPLETE:
                break;
            case ctx.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                throw new Error("incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
            case ctx.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                throw new Error("incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
            case ctx.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                throw new Error("incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
            case ctx.FRAMEBUFFER_UNSUPPORTED:
                throw new Error("incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED");
            default:
                throw new Error("incomplete framebuffer: " + status);
            }
        } finally {
            ctx.bindTexture(ctx.TEXTURE_2D, null);
            ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
            ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        }
    };

    frame_buffer.init(opts.width, opts.height);
    frame_buffer._shade_type = 'render_buffer';
    frame_buffer.texture = rttTexture;
    frame_buffer.resize = function(width, height) {
        opts.width = width;
        opts.height = height;
        this.texture.init(opts);
        this.init(width, height);
    };
    frame_buffer.with_bound_buffer = function(what) {
        var v = ctx.getParameter(ctx.VIEWPORT);
        try {
            ctx.bindFramebuffer(ctx.FRAMEBUFFER, this);
            ctx.viewport(0, 0, this.width, this.height);
            return what();
        } finally {
            ctx.viewport(v[0], v[1], v[2], v[3]);
            ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        }
    };
    frame_buffer.screen_actor = function(opts) {
        opts = _.defaults(opts, {
            mode: Lux.DrawingMode.standard
        });
        var with_texel_at_uv = opts.texel_function;
        var mode = opts.mode;
        var that = this;
        var sq = Lux.Models.square();
        mode = mode || Lux.DrawingMode.standard;
        return Lux.actor({
            model: sq,
            appearance: {
                screen_position: sq.vertex.mul(2).sub(1),
                color: with_texel_at_uv(function(offset) {
                    var texcoord = sq.tex_coord;
                    if (arguments.length > 0)
                        texcoord = texcoord.add(offset);
                    return Shade.texture2D(that.texture, texcoord);
                }),
                mode: mode
            },
            bake: opts.bake
        });
    };
    
    var old_v;
    frame_buffer.scene = Lux.default_scene({
        clearColor: opts.clearColor,
        clearDepth: opts.clearDepth,
        context: ctx,
        pre_draw: function() {
            old_v = ctx.getParameter(ctx.VIEWPORT);
            ctx.bindFramebuffer(ctx.FRAMEBUFFER, frame_buffer);
            ctx.viewport(0, 0, frame_buffer.width, frame_buffer.height);
        },
        post_draw: function() {
            ctx.viewport(old_v[0], old_v[1], old_v[2], old_v[3]);
            ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        }
    });

    return frame_buffer;
};
