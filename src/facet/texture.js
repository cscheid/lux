//////////////////////////////////////////////////////////////////////////////
// load texture from DOM element or URL. 
// BEWARE SAME-DOMAIN POLICY!

// FIXME: replace all this with the code from Facet.load_image_into_texture

Facet.texture = function(opts)
{
    var ctx = Facet._globals.ctx;
    var texture = ctx.createTexture();

    texture._shade_type = 'texture';
    // Each texture has to be associated with a particular context, so we
    // store that in ._ctx
    // FIXME: This must be true for other WebGL resources as well. Are we checking them?
    texture._ctx = ctx;

    texture.init = Facet.on_context(ctx, function(opts) {
        var ctx = Facet._globals.ctx;
        opts = _.defaults(opts, {
            onload: function() {},
            mipmaps: false,
            mag_filter: ctx.LINEAR,
            min_filter: ctx.LINEAR,
            wrap_s: ctx.CLAMP_TO_EDGE,
            wrap_t: ctx.CLAMP_TO_EDGE,
            format: ctx.RGBA,
            type: ctx.UNSIGNED_BYTE
        });
        this.width = opts.width;
        this.height = opts.height;

        this.ready = false;
        var that = this;

        /*
         * Texture.load:
         * 
         *   Replaces a rectangle of a Facet texture with a given image.
         * 
         *   This is useful to store a large set of rectangular images into a single texture, for example.
         * 
         *   Example usage:
         * 
         *   * Load an image from a URL:
         * 
         *     texture.load({
         *       src: "http://www.example.com/image.png"
         *     })
         * 
         *   * Invoke a callback when image is successfully loaded:
         * 
         *     texture.load({
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
         *     texture.load({
         *       src: "http://www.example.com/image.png",
         *       x_offset: 64,
         *       y_offset: 32
         *     })
         * 
         *   * Load an image from an existing element in the DOM:
         * 
         *     texture.load({
         *       img: document.getElementById("image-element")
         *     });
         *
         *     texture.load({
         *       canvas: document.getElementById("canvas-element")
         *     });
         * 
         *   * Load an image from a TypedArray buffer (currently only supports 8-bit RGBA):
         * 
         *     Facet.load({
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
                Facet.set_context(texture._ctx);
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
                Facet.unload_batch();
                that.ready = true;
                onload.call(texture, image);
            }

            function buffer_handler()
            {
                var ctx = texture._ctx;
                Facet.set_context(texture._ctx);
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
                if (_.isUndefined(opts.buffer)) {
                    if (x_offset !== 0 || y_offset !== 0) {
                        throw "texture.load cannot be called with nonzero offsets and no data";
                    }
                    ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format,
                                   that.width, that.height,
                                   0, opts.format, opts.type, null);
                } else {
                    ctx.texSubImage2D(ctx.TEXTURE_2D, 0, x_offset, y_offset,
                                      opts.width, opts.height,
                                      ctx.RGBA, ctx.UNSIGNED_BYTE, opts.buffer);
                }
                if (opts.mipmaps)
                    ctx.generateMipmap(ctx.TEXTURE_2D);
                that.ready = true;
                Facet.unload_batch();
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
        
        Facet.set_context(ctx);
        ctx.bindTexture(ctx.TEXTURE_2D, that);
        ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format,
                       that.width, that.height,
                       0, opts.format, opts.type, null);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, opts.mag_filter);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, opts.min_filter);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, opts.wrap_s);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, opts.wrap_t);

        delete this.buffer;
        delete this.image;

        this.load(opts);
    });
    texture.init(opts);

    return texture;
};
