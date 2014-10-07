//////////////////////////////////////////////////////////////////////////////
// load texture from DOM element or URL. 
// BEWARE SAME-DOMAIN POLICY!

Lux.texture = function(opts)
{
    var ctx = Lux._globals.ctx;
    var texture = ctx.createTexture();

    texture._shade_type = 'texture';
    // Each texture has to be associated with a particular context, so we
    // store that in ._ctx
    // FIXME: This must be true for other WebGL resources as well. Are we checking them?
    texture._ctx = ctx;

    texture.init = Lux.on_context(ctx, function(opts) {
        var ctx = Lux._globals.ctx;
        var has_mipmaps = _.isUndefined(opts.mipmaps) || opts.mipmaps;
        opts = _.defaults(opts, {
            onload: function() {},
            max_anisotropy: has_mipmaps ? 2 : 1,
            mipmaps: true,
            mag_filter: Lux.texture.linear,
            min_filter: has_mipmaps ? Lux.texture.linear_mipmap_linear : Lux.texture.linear,
            wrap_s: Lux.texture.clamp_to_edge,
            wrap_t: Lux.texture.clamp_to_edge,
            format: Lux.texture.rgba,
            type: Lux.texture.unsigned_byte
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
         *       x_offset: 64,
         *       y_offset: 32
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
                x_offset: 0,
                y_offset: 0,
                transform_image: function(i) { return i; }
            });

            var texture = this;
            var onload = opts.onload;
            var x_offset = opts.x_offset;
            var y_offset = opts.y_offset;

            function image_handler(image) {
                image = opts.transform_image(image);
                var ctx = texture._ctx;
                Lux.set_context(texture._ctx);
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
                if (_.isUndefined(that.width)) {
                    that.width = image.width;
                    that.height = image.height;
                    ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format,
                                   that.width, that.height,
                                   0, opts.format, opts.type, null);
                }
                ctx.texSubImage2D(ctx.TEXTURE_2D, 0, x_offset, y_offset,
                                  ctx.RGBA, ctx.UNSIGNED_BYTE, image);
                if (opts.mipmaps)
                    ctx.generateMipmap(ctx.TEXTURE_2D);
                Lux.unload_batch();
                that.ready = true;
                onload.call(texture, image);
            }

            function buffer_handler()
            {
                var ctx = texture._ctx;
                Lux.set_context(texture._ctx);
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                if (_.isUndefined(opts.buffer)) {
                    if (x_offset !== 0 || y_offset !== 0) {
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
                    ctx.texSubImage2D(ctx.TEXTURE_2D, 0, x_offset, y_offset, 
                                      opts.width, opts.height,
                                      ctx.RGBA, map[ctor], opts.buffer);
                }
                if (opts.mipmaps)
                    ctx.generateMipmap(ctx.TEXTURE_2D);
                that.ready = true;
                Lux.unload_batch();
                onload.call(texture, opts.buffer);
            }

            if (opts.src) {
                var image = new Image();
                image.onload = function() {
                    image_handler(image);
                };
                // CORS support
                if (opts.crossOrigin)
                    image.crossOrigin = opts.crossOrigin;
                image.src = opts.src;
            } else if (opts.canvas) {
                image_handler(opts.canvas);
            } else if (opts.img) {
                if (opts.img.isComplete) {
                    image_handler(opts.img);
                } else {
                    var old_onload = texture.image.onload || function() {};
                    opts.img.onload = function() {
                        image_handler(opts.img);
                        old_onload();
                    };
                }
            } else {
                buffer_handler();
            }
        };
        
        Lux.set_context(ctx);
        ctx.bindTexture(ctx.TEXTURE_2D, that);
        ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format,
                       that.width, that.height,
                       0, opts.format, opts.type, null);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, opts.mag_filter);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, opts.min_filter);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, opts.wrap_s);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, opts.wrap_t);
        if (ctx._luxGlobals.webgl_extensions.EXT_texture_filter_anisotropic &&
            opts.max_anisotropy > 1 && opts.mipmaps) {
            ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_MAX_ANISOTROPY_EXT, opts.max_anisotropy);
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
Lux.texture.nearest                = 0x2600;
Lux.texture.linear                 = 0x2601;

// min_filter 
Lux.texture.nearest_mipmap_nearest = 0x2700;
Lux.texture.linear_mipmap_nearest  = 0x2701;
Lux.texture.nearest_mipmap_linear  = 0x2702;
Lux.texture.linear_mipmap_linear   = 0x2703;

// wrap_s and wrap_t
Lux.texture.repeat                 = 0x2901;
Lux.texture.clamp_to_edge          = 0x812F;
Lux.texture.mirrored_repeat        = 0x8370;

// format
Lux.texture.depth_component        = 0x1902;
Lux.texture.alpha                  = 0x1906;
Lux.texture.rgb                    = 0x1907;
Lux.texture.rgba                   = 0x1908;
Lux.texture.luminance              = 0x1909;
Lux.texture.luminance_alpha        = 0x190A;

// type
Lux.texture.unsigned_byte          = 0x1401;
Lux.texture.unsigned_short_4_4_4_4 = 0x8033;
Lux.texture.unsigned_short_5_5_5_1 = 0x8034;
Lux.texture.unsigned_short_5_6_5   = 0x8363;
Lux.texture["float"]               = 0x1406;
