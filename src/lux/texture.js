//////////////////////////////////////////////////////////////////////////////
// load texture from DOM element or URL. 
// BEWARE SAME-DOMAIN POLICY!

Lux.texture = function(opts)
{
    var ctx = Lux._globals.ctx;
    var texture = ctx.createTexture();

    texture._shadeType = 'texture';
    // Each texture has to be associated with a particular context, so we
    // store that in ._ctx
    // FIXME: This must be true for other WebGL resources as well. Are we checking them?
    texture._ctx = ctx;

    texture.init = Lux.onContext(ctx, function(opts) {
        var ctx = Lux._globals.ctx;
        var hasMipmaps = _.isUndefined(opts.mipmaps) || opts.mipmaps;
        opts = _.defaults(opts, {
            onload: function() {},
            maxAnisotropy: hasMipmaps ? 2 : 1,
            mipmaps: true,
            magFilter: Lux.texture.linear,
            minFilter: hasMipmaps ? Lux.texture.linearMipmapLinear : Lux.texture.linear,
            wrapS: Lux.texture.clampToEdge,
            wrapT: Lux.texture.clampToEdge,
            format: Lux.texture.rgba,
            type: Lux.texture.unsignedByte
        });
        this.width = opts.width;
        this.height = opts.height;

        this.ready = false;
        var that = this;

        /*
         * Texture.load:
         * 
         *   Replaces a rectangle of a Lux texture with a given image.
         * 
         *   This is useful to store a large set of rectangular images into a single texture, for example.
         * 
         *   Example usage:
         * 
         *   * Load an image from a URL:
         * 
         *     Lux.texture({
         *       src: "http://www.example.com/image.png"
         *     })
         * 
         *   * Invoke a callback when image is successfully loaded:
         * 
         *     Lux.texture({
         *       src: "http://www.example.com/image.png",
         *       onload: function(image) { 
         *         alert("image has now loaded into texture!");
         *       }
         *     })
         * 
         *     The parameter passed to the callback is the image, canvas 
         *     or buffer loaded into the texture, and in
         *     the callback, 'this' points to the texture. In other words,
         *     the callback is called with "onload.call(texture, image)"
         *        
         *   * Specify an offset:
         * 
         *     Lux.texture({
         *       src: "http://www.example.com/image.png",
         *       xOffset: 64,
         *       yOffset: 32
         *     })
         * 
         *   * Load an image from an existing element in the DOM:
         * 
         *     Lux.texture({
         *       img: document.getElementById("image-element")
         *     });
         *
         *     Lux.texture({
         *       canvas: document.getElementById("canvas-element")
         *     });
         * 
         *   * Load a texture from a TypedArray buffer (currently only supports 8-bit RGBA or 32-bit float RGBA):
         * 
         *     Lux.texture({
         *       width: 128,
         *       height: 128,
         *       buffer: new Uint8Array(128 * 128 * 4)
         *     });
         */
        this.load = function(opts) {
            opts = _.defaults(opts, {
                onload: function() {},
                xOffset: 0,
                yOffset: 0,
                transformImage: function(i) { return i; }
            });

            var texture = this;
            var onload = opts.onload;
            var xOffset = opts.xOffset;
            var yOffset = opts.yOffset;

            function imageHandler(image) {
                image = opts.transformImage(image);
                var ctx = texture._ctx;
                Lux.setContext(texture._ctx);
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
                if (_.isUndefined(that.width)) {
                    that.width = image.width;
                    that.height = image.height;
                    ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format,
                                   that.width, that.height,
                                   0, opts.format, opts.type, null);
                }
                ctx.texSubImage2D(ctx.TEXTURE_2D, 0, xOffset, yOffset,
                                  ctx.RGBA, ctx.UNSIGNED_BYTE, image);
                if (opts.mipmaps)
                    ctx.generateMipmap(ctx.TEXTURE_2D);
                Lux.unloadBatch();
                that.ready = true;
                onload.call(texture, image);
            }

            function bufferHandler()
            {
                var ctx = texture._ctx;
                Lux.setContext(texture._ctx);
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                if (_.isUndefined(opts.buffer)) {
                    if (xOffset !== 0 || yOffset !== 0) {
                        throw new Error("texture.load cannot be called with nonzero offsets and no data");
                    }
                    ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format,
                                   that.width, that.height,
                                   0, opts.format, opts.type, null);
                } else {
                    var type;
                    var ctor = opts.buffer.constructor.name;
                    var map = {
                        "Uint8Array": ctx.UNSIGNED_BYTE,
                        "Float32Array": ctx.FLOAT
                    };
                    if (_.isUndefined(map[ctor])) {
                        throw new Error("opts.buffer must be either Uint8Array or Float32Array");
                    }
                    ctx.texSubImage2D(ctx.TEXTURE_2D, 0, xOffset, yOffset, 
                                      opts.width, opts.height,
                                      ctx.RGBA, map[ctor], opts.buffer);
                }
                if (opts.mipmaps)
                    ctx.generateMipmap(ctx.TEXTURE_2D);
                that.ready = true;
                Lux.unloadBatch();
                onload.call(texture, opts.buffer);
            }

            if (opts.src) {
                var image = new Image();
                image.onload = function() {
                    imageHandler(image);
                };
                // CORS support
                if (opts.crossOrigin)
                    image.crossOrigin = opts.crossOrigin;
                image.src = opts.src;
            } else if (opts.canvas) {
                imageHandler(opts.canvas);
            } else if (opts.img) {
                if (opts.img.isComplete) {
                    imageHandler(opts.img);
                } else {
                    var oldOnload = texture.image.onload || function() {};
                    opts.img.onload = function() {
                        imageHandler(opts.img);
                        oldOnload();
                    };
                }
            } else {
                bufferHandler();
            }
        };
        
        Lux.setContext(ctx);
        ctx.bindTexture(ctx.TEXTURE_2D, that);
        ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format,
                       that.width, that.height,
                       0, opts.format, opts.type, null);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, opts.magFilter);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, opts.minFilter);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, opts.wrapS);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, opts.wrapT);
        if (ctx._luxGlobals.webglExtensions.EXT_texture_filter_anisotropic &&
            opts.maxAnisotropy > 1 && opts.mipmaps) {
            ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_MAX_ANISOTROPY_EXT, opts.maxAnisotropy);
        }

        delete this.buffer;
        delete this.image;

        this.load(opts);
    });

    texture.init(opts);

    return texture;
};

//////////////////////////////////////////////////////////////////////////////
// texture-related enums go here

// mag_filter
Lux.texture.nearest              = 0x2600;
Lux.texture.linear               = 0x2601;

// min_filter 
Lux.texture.nearestMipmapNearest = 0x2700;
Lux.texture.linearMipmapNearest  = 0x2701;
Lux.texture.nearestMipmapLinear  = 0x2702;
Lux.texture.linearMipmapLinear   = 0x2703;

// wrap_s and wrap_t
Lux.texture.repeat               = 0x2901;
Lux.texture.clampToEdge          = 0x812F;
Lux.texture.mirroredRepeat       = 0x8370;

// format
Lux.texture.depthComponent       = 0x1902;
Lux.texture.alpha                = 0x1906;
Lux.texture.rgb                  = 0x1907;
Lux.texture.rgba                 = 0x1908;
Lux.texture.luminance            = 0x1909;
Lux.texture.luminanceAlpha       = 0x190A;

// type
Lux.texture.unsignedByte         = 0x1401;
Lux.texture.unsignedShort4_4_4_4 = 0x8033;
Lux.texture.unsignedShort5_5_5_1 = 0x8034;
Lux.texture.unsignedShort5_6_5   = 0x8363;
Lux.texture["float"]             = 0x1406;
