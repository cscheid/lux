Lux.renderBuffer = function(opts)
{
    opts = _.defaults(opts || {}, {
        context: Lux._globals.ctx,
        width: 512,
        height: 512,
        magFilter: Lux.texture.linear,
        minFilter: Lux.texture.linear,
        mipmaps: false,
        maxAnisotropy: 1,
        wrapS: Lux.texture.clampToEdge,
        wrapT: Lux.texture.clampToEdge,
        clearColor: [0,0,0,1],
        clearDepth: 1.0
    });
    var ctx = opts.context;
    var frameBuffer = ctx.createFramebuffer();

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

    frameBuffer.init = function(width, height) {
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

    frameBuffer.init(opts.width, opts.height);
    frameBuffer._shadeType = 'renderBuffer';
    frameBuffer.texture = rttTexture;
    frameBuffer.resize = function(width, height) {
        opts.width = width;
        opts.height = height;
        this.texture.init(opts);
        this.init(width, height);
    };
    frameBuffer.withBoundBuffer = function(what) {
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
    frameBuffer.screenActor = function(opts) {
        opts = _.defaults(opts, {
            mode: Lux.DrawingMode.standard
        });
        var withTexelAtUv = opts.texelFunction;
        var mode = opts.mode;
        var that = this;
        var sq = Lux.Models.square();
        mode = mode || Lux.DrawingMode.standard;
        return Lux.actor({
            model: sq,
            appearance: {
                screenPosition: sq.vertex.mul(2).sub(1),
                color: withTexelAtUv(function(offset) {
                    var texcoord = sq.texCoord;
                    if (arguments.length > 0)
                        texcoord = texcoord.add(offset);
                    return Shade.texture2D(that.texture, texcoord);
                }),
                mode: mode
            },
            bake: opts.bake
        });
    };
    
    var oldV;
    frameBuffer.scene = Lux.defaultScene({
        clearColor: opts.clearColor,
        clearDepth: opts.clearDepth,
        context: ctx,
        preDraw: function() {
            oldV = ctx.getParameter(ctx.VIEWPORT);
            ctx.bindFramebuffer(ctx.FRAMEBUFFER, frameBuffer);
            ctx.viewport(0, 0, frameBuffer.width, frameBuffer.height);
        },
        postDraw: function() {
            ctx.viewport(oldV[0], oldV[1], oldV[2], oldV[3]);
            ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        }
    });

    return frameBuffer;
};
